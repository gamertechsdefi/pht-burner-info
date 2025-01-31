// pages/api/getLockAmount.js

import { NextResponse } from 'next/server';
import { getLockAmount } from '@/utils/getLockAmount';  // Adjust the import path based on your file structure

export async function GET(req) {
  try {
    const tokenName = req.nextUrl.searchParams.get('tokenName');

    if (!tokenName) {
      return NextResponse.json(
        { message: 'Token name is required' },
        { status: 400 }
      );
    }

    const lockAmount = await getLockAmount(tokenName);
    return NextResponse.json({ lockAmount });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching lock amount', error: error.message },
      { status: 500 }
    );
  }
}
