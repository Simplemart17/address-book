import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      const { fullName } = req.body;
      const { userEmail } = req.query;

      await prisma.users.update({
        where: {
          email: userEmail as string,
        },
        data: {
          full_name: fullName,
        },
      });

      res.status(200).json({
        success: true,
        message: "User updated successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Something went wrong"});
    }
  } else if (req.method === "GET") {
      try {
        const { userEmail } = req.query;

        const user = await prisma.users.findUnique({
          where: {
            email: userEmail as string
          },
          include: {
            verification: true
          }
        });

        res.status(200).json({ success: true, data: user });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong"});
      }
  } else if (req.method === "DELETE") {
    try {
      const { userEmail } = req.query;

      await prisma.users.delete({
        where: {
          user_id: userEmail as string,
        }
      });

      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Something went wrong"});
    }
  } else if (req.method === "PUT") {
    try {
      const { userEmail } = req.query;

      const user = await prisma.users.findUnique({
        where: {
          user_id: userEmail as string
        },
        include: {
          verification: true
        }
      });

      await prisma.verification.update({
        where: {
          verification_id: user?.verification[0].verification_id,
        },
        data: {
          status: !user?.verification[0].status,
        },
      });

      res.status(200).json({
        success: true,
        message: "Action successful",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Something went wrong"});
    }
  }
}