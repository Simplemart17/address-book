import { NextApiRequest, NextApiResponse } from 'next'
import mongoDbConnect from '@/config/mongoDbConnection.config'
import Contact from '@/models/Contacts';
import { randomizeImageUrl } from '@/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req

  await mongoDbConnect();

  switch (method) {
    case 'GET':
      try {
        const contacts = await Contact.find({ email: query.email });

        res.status(200).json({ success: true, data: contacts });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break
    case 'POST':
      try {
        const contact = await Contact.create({
          ...req.body, url: randomizeImageUrl()
        });

        res.status(201).json({ success: true, ...contact._doc });
      } catch (error: any) {
        if (error.message.includes("phone_1 dup key")) {
          res.status(400).json({ success: false, message: "Phone number already exist" });
        }

        res.status(500).json({ success: false, message: "Something went wrong!" });
      }
      break
    default:
      res.status(400).json({ success: false, message: "Something went wrong!" });
      break
  }
}
