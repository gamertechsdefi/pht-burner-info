// pages/api/tokenTotalSupply.js

import { NextResponse } from 'next/server';
import { getNetCirculatingSupply } from '@/utils/getTokenCSupply';

export async function GET(req) {
  try {
    // Extract tokenName from query parameters
    const tokenName = req.nextUrl.searchParams.get('tokenName');

    // If tokenName is not provided, return a 400 error
    if (!tokenName) {
      return NextResponse.json(
        { message: 'Token name is required' },
        { status: 400 }
      );
    }

    // Call the getTokenTotalSupply function with the tokenName
    const totalCSupply = await getNetCirculatingSupply(tokenName);
    
    // Return the total supply
    return NextResponse.json({ totalCSupply });
  } catch (error) {
    // Return a 500 error in case of any failure
    return NextResponse.json(
      { message: 'Error fetching token supply', error: error.message },
      { status: 500 }
    );
  }
}
