import { NextResponse } from 'next/server';
import { getTokenTotalSupply } from '@/utils/tokenInfo';  // Adjust the import path based on your file structure

export async function GET() {
  try {
    const totalSupply = await getTokenTotalSupply();
    return NextResponse.json({ totalSupply });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching token supply', error: error.message },
      { status: 500 }
    );
  }
}