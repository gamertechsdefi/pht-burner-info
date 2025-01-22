import { NextResponse } from 'next/server';
import { getTokenData } from '@/utils/tokenInfo';

export async function GET() {
  try {
    const tokenData = await getTokenData();
    return NextResponse.json(tokenData);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching token data', error: error.message },
      { status: 500 }
    );
  }
}