import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/app/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query("SELECT * FROM users");
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ message: "Database error", error });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, email } = req.body;
      await pool.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
      return res.status(201).json({ message: "User created" });
    } catch (error) {
      return res.status(500).json({ message: "Database error", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}