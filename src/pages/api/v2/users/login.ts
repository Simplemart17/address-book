import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      
      let msg: any;
      let statusCode: any;
      let status: any;

      const data = await prisma.users.findUnique({
        where: {
          email: email
        },
        include: {
          verification: true
        }
      });

      if (!data) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      if (data?.email) {
        if (!data.verified) {
          res.status(401).json({
            success: false,
            message: "User not verified!",
          });
          return;
        }

        if (data.verification[0].status) {
          res.status(401).json({
            success: false,
            message: "Account blocked! Contact the administrator",
          });
        }
        const check = await bcrypt.compare(password, data.password);

        if (!check) {
          res.status(401).json({
            success: false,
            message: "email/password not correct",
          });
          return;
        }
      }

      delete data.password;

      res.status(200).json({
        success: true,
        message: "Login successful",
        ...data
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Something went wrong"});
    }
  }
}
