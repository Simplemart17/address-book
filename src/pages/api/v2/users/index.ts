import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';

import { generateRandomNumber, hashPassword } from '@/utils';
import sendEmail from '@/lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, fullName, password } = req.body;
      const userType = "user";
      const userId = uuidv4();
      const hashedPassword = await hashPassword(password);
      
      let msg: any;

      const body: any = {
        email,
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

          await sendEmail("Verification Code", `<p>${code}</p>`, data.email as string);
          msg = "Account created successfully";
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