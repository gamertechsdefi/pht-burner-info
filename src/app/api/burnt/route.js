import { NextResponse } from 'next/server';
import { getBurnAmount } from '@/utils/tokenInfo';  // Adjust the import path based on your file structure

export async function GET() {
  try {
    const burnt = await getBurnAmount();
    return NextResponse.json({ burnt });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching token supply', error: error.message },
      { status: 500 }
    );
  }
}