import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/mailer';
import { normalizeEmail } from '@/utils/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;

      // Normalize email for consistent lookup
      const normalizedEmail = normalizeEmail(email);

      const data = await prisma.users.findUnique({ where: { email: normalizedEmail }});

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Account not found, please register",
        });
      }

      // Send verification email with link
      try {
        const emailResult = await sendVerificationEmail(normalizedEmail, data.user_id, data.full_name || undefined);
        if (emailResult.success) {
          res.status(200).json({
            success: true,
            message: "Verification email sent successfully! Please check your email.",
          });
        } else {
          console.error('Failed to resend verification email:', emailResult.error);
          res.status(500).json({
            success: false,
            message: "Failed to send verification email. Please try again later.",
          });
        }
      } catch (emailError) {
        console.error('Error resending verification email:', emailError);
        res.status(500).json({
          success: false,
          message: "Failed to send verification email. Please try again later.",
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Something went wrong"});
    }
  }
}

