import { NextResponse } from 'next/server';
import  db  from '@/app/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM boards');
    return NextResponse.json({ boards: rows });
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}