import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '@/config/db.config'
import { v4 as uuidv4 } from 'uuid';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, fullName } = req.body;
      const userType = "user";
      const userId = uuidv4()

      const postQuery = "INSERT INTO tabular.users (user_id, email, full_name, user_type) VALUES(?,?,?,?)";
      const getQuery = "SELECT * FROM tabular.users WHERE email=?";

      const user = await client.execute(getQuery, [email]);

      if (user.rows.length === 0) {
        await client.execute(postQuery, [userId, email, fullName, userType]);
      }

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: user.rows[0]
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Something went wrong"});
    }
  } else if (req.method === "GET") {
      try {
        const query = "SELECT * FROM tabular.users";

        const users = await client.execute(query);

        res.status(200).json({ success: true, data: users.rows});
      } catch (error) {
        
      }
  }
}