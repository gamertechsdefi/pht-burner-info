// pages/api/tokenTotalSupply.js

import { NextResponse } from 'next/server';
import { getDexPrice } from '@/utils/getTokenDexPrice';  // Adjust the import path

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
    const price = await getDexPrice(tokenName);
    
    // Return the total supply
    return NextResponse.json({ price });
  } catch (error) {
    // Return a 500 error in case of any failure
    return NextResponse.json(
      { message: 'Error fetching token supply', error: error.message },
      { status: 500 }
    );
  }
}
