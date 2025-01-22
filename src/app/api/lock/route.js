import { NextResponse } from 'next/server';
import { getLockAmount } from '@/utils/tokenInfo';  // Adjust the import path based on your file structure

export async function GET() {
  try {
    const lock = await getLockAmount();
    return NextResponse.json({ lock });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching token supply', error: error.message },
      { status: 500 }
    );
  }
}