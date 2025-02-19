// app/api/batchData/route.js

import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenName = searchParams.get('tokenName');

  if (!tokenName) {
    return NextResponse.json({ error: 'Token name is required' }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

  try {
    // Make multiple API requests in parallel
    const [
      tokenDataRes,
      supplyDataRes,
      holdersDataRes,
      burntDataRes,
      circulatoryDataRes,
      lockedDataRes,
      burned24hDataRes
    ] = await Promise.all([
        fetch(`${baseUrl}/api/tokenData?tokenName=${tokenName}`),
        fetch(`${baseUrl}/api/tokenSupply?tokenName=${tokenName}`),
        fetch(`${baseUrl}/api/holders?tokenName=${tokenName}`),
        fetch(`${baseUrl}/api/burnt?tokenName=${tokenName}`),
        fetch(`${baseUrl}/api/circulatorySupply?tokenName=${tokenName}`),
        fetch(`${baseUrl}/api/lock?tokenName=${tokenName}`),
        fetch(`${baseUrl}/api/0xbalance?tokenName=${tokenName}`)
    ]);

    // Parse the JSON responses
    const [
      tokenData,
      supply,
      holders,
      burnt,
      circulatory,
      locked,
      burned24h
    ] = await Promise.all([
      tokenDataRes.json(),
      supplyDataRes.json(),
      holdersDataRes.json(),
      burntDataRes.json(),
      circulatoryDataRes.json(),
      lockedDataRes.json(),
      burned24hDataRes.json()
    ]);

    // Check for any errors in the responses
    if (!tokenDataRes.ok) throw new Error(tokenData.error || "Failed to fetch token data");

    // Return the combined response
    return NextResponse.json({
      tokenData,
      supply,
      holders,
      burnt,
      circulatory,
      locked,
      burned24h
    });

  } catch (error) {
    console.error("Batch Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}