import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return NextResponse.json({ status: 'connected' });
  } catch (error) {
    return NextResponse.json({ status: 'disconnected' }, { status: 500 });
  }
}