import { NextResponse } from 'next/server';
import { getBurntAmount } from '@/utils/getBurnAmount';

export async function GET(req) {
  try {
    // Extract tokenName from query parameters
    const tokenName = req.nextUrl.searchParams.get('tokenName');

    // If tokenName is not provided, return a 400 error
    if (!tokenName) {
      return NextResponse.json(
        { error: 'Token name is required' },
        { status: 400 }
      );
    }

    // Fetch burn amount
    const burnData = await getBurntAmount(tokenName);

    // Ensure burnData is a number
    const burnt = typeof burnData === 'object' && burnData.value ? burnData.value : burnData;

    // Return formatted response
    return NextResponse.json({ burnt: burnt || 0 });
  } catch (error) {
    console.error('Error fetching burn amount:', error);
    return NextResponse.json(
      { error: 'Failed to fetch burn amount', details: error.message },
      { status: 500 }
    );
  }
}
