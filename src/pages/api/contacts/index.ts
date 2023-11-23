import type { NextApiRequest, NextApiResponse } from 'next'
import { serverApi } from '@/config/axiosInstance';
import { randomizeImageUrl } from '@/utils';

type ReqBodyProps = {
  email: string;
  fullName: string;
  address: string;
  phone: string;
  type: string;
  url: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const url = randomizeImageUrl();
      const {
        email,
        fullName,
        address,
        phone,
        type,
      } = req.body;

      const body: ReqBodyProps = {
        email,
        address,
        fullName,
        phone,
        type,
        url: url
      };
      await await serverApi.post("/namespaces/document/collections/contacts", JSON.stringify(body));

      res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Something went wrong"});
    }
  } else if (req.method === "GET") {
      try {
        const { data } = await serverApi.get('/namespaces/document/collections/contacts?page-size=19');

        res.status(200).json({ success: true, data });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong"});
      }
  }
}