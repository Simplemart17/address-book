import type { NextApiRequest, NextApiResponse } from 'next'
import Contacts from '@/models/Contacts';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      const { docId } = req.query;

      const contact = await Contacts.findByIdAndUpdate(docId, req.body, { new: true, runValidators: true });

      res.status(200).json({
        success: true,
        ...contact?._doc,
        message: "Contact updated successfully",
      });
    } catch (error: any) {
      if (error.message.includes("phone_1 dup key")) {
        res.status(400).json({ success: false, message: "Phone number already exist" });
      }
      res.status(500).json({ success: false, error: "Something went wrong"});
    }
  } else if (req.method === "GET") {
      try {
        const { docId } = req.query;

        const contact = await Contacts.findById(docId);

        res.status(200).json({ success: true, data: contact?._doc });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong"});
      }
  } else if (req.method === "DELETE") {
    try {
      await Contacts.deleteOne({ _id: req.query.docId });
  
      res.status(201).json({ success: true });
    } catch (error: any) { 
      res.status(500).json({ success: false, message: "Something went wrong!" });
    }
  }
}
