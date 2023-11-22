import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';
import { serverApi } from '@/config/axiosInstance';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, fullName } = req.body;
      const userType = "user";
      const userId = uuidv4();
      const body: any = {
        email,
        full_name: fullName,
        user_type: userType,
        user_id: userId
      };

      const { data } = await serverApi.get(`/keyspaces/tabular/users/${email}`);

      if (data.length === 0) {
        await await serverApi.post("/keyspaces/tabular/users", JSON.stringify(body));
      }

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: data[0]
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Something went wrong"});
    }
  } else if (req.method === "GET") {
      try {
        const { data } = await serverApi.get('/keyspaces/tabular/users/rows');

        res.status(200).json({ success: true, data });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong"});
      }
  }
}