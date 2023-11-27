import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { code, email } = req.body;

      const data = await prisma.verification.findUnique({ where: { verification_code: +code }});

      if (!data?.verification_code) {
        res.status(404).json({
          success: false,
          message: "You have entered an invalid verification code",
        });
      } else {
        await prisma.users.update({
          where: {
            email: email,
          },
          data: {
            verified: true,
          },
        });  
      }
    
      res.status(200).json({
        success: true,
        message: "User updated successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Something went wrong"});
    }
  }
}
