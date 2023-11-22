import type { NextApiRequest, NextApiResponse } from 'next'
import { serverApi } from '@/config/axiosInstance';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      const { fullName } = req.body;
      const { userEmail } = req.query;

      await serverApi.patch(`/keyspaces/tabular/users/${userEmail}`, { full_name: fullName });

      res.status(200).json({
        success: true,
        message: "User updated successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Something went wrong"});
    }
  } else if (req.method === "GET") {
      try {
        const { userEmail } = req.query;

        const { data } = await serverApi.get(`/keyspaces/tabular/users/${userEmail}`);

        res.status(200).json({ success: true, data: data[0] });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong"});
      }
  } else if (req.method === "DELETE") {
    try {
      const { userEmail } = req.query;

      await serverApi.delete(`/keyspaces/tabular/users/${userEmail}`);

      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Something went wrong"});
    }
  }
}