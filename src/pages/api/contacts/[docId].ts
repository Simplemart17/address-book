import type { NextApiRequest, NextApiResponse } from 'next'
import { serverApi } from '@/config/axiosInstance';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      const { fullName, address, phone, type } = req.body;

      const { docId } = req.query;

      await serverApi.patch(`/namespaces/document/collections/contacts/${docId}`, { fullName: fullName, address: address, type: type, phone: phone });

      res.status(200).json({
        success: true,
        message: "Contact updated successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Something went wrong"});
    }
  } else if (req.method === "GET") {
      try {
        const { docId } = req.query;

        const { data } = await serverApi.get(`/namespaces/document/collections/contacts/${docId}`);

        res.status(200).json({ success: true, data: data });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong"});
      }
  } else if (req.method === "DELETE") {
    try {
      const { docId } = req.query;

      await serverApi.delete(`/namespaces/document/collections/contacts/${docId}`);

      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Something went wrong"});
    }
  }
}