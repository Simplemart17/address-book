import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';

import { generateRandomNumber, hashPassword } from '@/utils';
import { sendVerificationEmail } from '@/lib/mailer';
import { normalizeEmail, validateEmail } from '@/utils/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, fullName, password } = req.body;

      // Validate email format and check for + aliases in production
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: emailValidation.message
        });
      }

      // Normalize email (remove + aliases in production)
      const normalizedEmail = normalizeEmail(email);

      const userType = "user";
      const userId = uuidv4();
      const hashedPassword = await hashPassword(password);

      let msg: any;

      const body: any = {
        email: normalizedEmail,
        full_name: fullName,
        user_type: userType,
        user_id: userId,
        password: hashedPassword
      };
      let data: any = await prisma.users.create({ data: body });

        if (data?.user_id) {
          const code = generateRandomNumber();
          await prisma.verification.create({
            data: {
              user_id: data.user_id,
              verification_code: code,
              verification_id: uuidv4()
          }});

          // Send verification email with link instead of code
          try {
            const emailResult = await sendVerificationEmail(normalizedEmail, data.user_id, data.full_name);
            if (emailResult.success) {
              msg = "Account created successfully. Please check your email to verify your account.";
            } else {
              console.error('Failed to send verification email:', emailResult.error);
              msg = "Account created successfully, but failed to send verification email. Please contact support.";
            }
          } catch (emailError) {
            console.error('Error sending verification email:', emailError);
            msg = "Account created successfully, but failed to send verification email. Please contact support.";
          }
        } else {
          data = null;
        }

      delete data.password;
      res.status(201).json({
        success: true,
        message: msg,
        ...data
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        res.status(400).json({ success: false, message: "Email already exists"});
      }
      res.status(500).json({ success: false, message: "Something went wrong"});
    }
  } else if (req.method === "GET") {
      try {
        const users = await prisma.users.findMany({
          include: {
            verification: true
          }
        });

        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong"});
      }
  }
}