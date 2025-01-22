import { NextResponse } from 'next/server';
import { getTokenCSupply } from '@/utils/tokenInfo';  // Adjust the import path based on your file structure

export async function GET() {
  try {
    const circulatorySupply = await getTokenCSupply();
    return NextResponse.json({ circulatorySupply });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching token supply', error: error.message },
      { status: 500 }
    );
  }
}