import { NextApiRequest, NextApiResponse } from "next";
import { BoardService } from "@/app/services/BoardService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const page = parseInt(req.query.page as string) || 1;
    const boards = await BoardService.getAllBoards(page);
    res.status(200).json(boards);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}