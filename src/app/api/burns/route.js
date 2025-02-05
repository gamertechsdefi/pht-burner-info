import { NextResponse } from 'next/server';
import { fetchBurns } from '@/utils/tokenBurns'; // Path to fetchBurns function

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const tokenName = url.searchParams.get('tokenName');

    // Predefined token data with contract addresses and burn addresses
    const tokenData = {
      PHT: {
        contractAddress: '0x885c99a787BE6b41cbf964174C771A9f7ec48e04',
        burnAddresses: [
          '0x000000000000000000000000000000000000dEaD',  // Default burn address

        ]
      },
      WKC: {
        contractAddress: '0x6Ec90334d89dBdc89E08A133271be3d104128Edb',
        burnAddresses: [
          '0x0000000000000000000000000000000000000000',  // Default burn address
        ]
      },
      WAR: {
        contractAddress: '0x57bfe2af99aeb7a3de3bc0c42c22353742bfd20d',
        burnAddresses: [
          '0x0000000000000000000000000000000000000000',  // Default burn address
        ]
      },
      DTG: {
        contractAddress: '0xb1957BDbA889686EbdE631DF970ecE6A7571A1B6',
        burnAddresses: [
          '0x0000000000000000000000000000000000000000',  // Default burn address
        ]
      },
      YUKAN: {
        contractAddress: '0xd086B849a71867731D74D6bB5Df4f640de900171',
        burnAddresses: [
          '0x000000000000000000000000000000000000dEaD',  // Default burn address
        ]
      },
      BTCDRAGON: {
        contractAddress: '0x1ee8a2f28586e542af677eb15fd00430f98d8fd8',
        burnAddresses: [
          '0x0000000000000000000000000000000000000000',  // Default burn address
        ]
      },
      BTCDRAGON: {
        contractAddress: '0x1ee8a2f28586e542af677eb15fd00430f98d8fd8',
        burnAddresses: [
          '0x0000000000000000000000000000000000000000',  // Default burn address
        ]
      },
      NENE: {
        contractAddress: '0x551877C1A3378c3A4b697bE7f5f7111E88Ab4Af3',
        burnAddresses: [
          '0x0000000000000000000000000000000000000000',
        ]
      },
      // Add more tokens here as needed
    };

    const token = tokenData[tokenName.toUpperCase()];

    if (!token) {
      return NextResponse.json({ message: 'Token not found' }, { status: 400 });
    }

    // Use the predefined burn addresses for the token
    const burns = await fetchBurns(token.contractAddress, token.burnAddresses);

    return NextResponse.json({ burns });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
