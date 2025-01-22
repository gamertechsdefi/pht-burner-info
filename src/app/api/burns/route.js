// src/app/api/burns/route.js
import { NextResponse } from 'next/server';
import { fetchBurns } from '@/utils/tokenBurns'; // Assuming this is your path

export async function GET() {
  try {
    const burns = await fetchBurns();
    return NextResponse.json({ burns });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// If you need to handle other HTTP methods:
export async function POST() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function all() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}