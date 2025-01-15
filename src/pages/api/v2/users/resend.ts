import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';
import sendEmail from '@/lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;

      const data = await prisma.users.findUnique({ where: { email }});

      if (!data) {
        res.status(404).json({
          success: false,
          message: "Account not found, please register",
        });
      }

      // get verification code from verification table
      const code = await prisma.verification.findFirst({
        where: {
          user_id: data?.user_id
        }
      });

      await sendEmail("Verification Code", `<p>${code?.verification_code}</p>`, email as string);
    
      res.status(200).json({
        success: true,
        message: "Verification code sent successfully!",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Something went wrong"});
    }
  }
}
function generateRandomNumber() {
  throw new Error('Function not implemented.');
}

