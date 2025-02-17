import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenName = searchParams.get('tokenName')?.toUpperCase();

  const tokenData = {
    PHT: { 
      contractAddress: '0x885c99a787BE6b41cbf964174C771A9f7ec48e04', 
      decimals: 18,
      burnAddresses: ["0x000000000000000000000000000000000000dEaD"]
    },
    WKC: { 
      contractAddress: '0x6Ec90334d89dBdc89E08A133271be3d104128Edb', 
      decimals: 18,
      burnAddresses: [
        "0x0000000000000000000000000000000000000000",
      ]
    },
    DTG: { 
      contractAddress: '0xb1957BDbA889686EbdE631DF970ecE6A7571A1B6', 
      decimals: 9,
      burnAddresses: ["0x0000000000000000000000000000000000000000"]
    },
    WAR: { 
      contractAddress: '0x57bfe2af99aeb7a3de3bc0c42c22353742bfd20d', 
      decimals: 18,
      burnAddresses: ["0x0000000000000000000000000000000000000000"]
    },
    YUKAN: { 
      contractAddress: '0xd086B849a71867731D74D6bB5Df4f640de900171', 
      decimals: 9,
      burnAddresses: ["0x000000000000000000000000000000000000dEaD"]
    },
    BTCDRAGON: { 
      contractAddress: '0x1ee8a2f28586e542af677eb15fd00430f98d8fd8', 
      decimals: 18,
      burnAddresses: ["0x0000000000000000000000000000000000000000"]
    },
    NENE: { 
      contractAddress: '0x551877C1A3378c3A4b697bE7f5f7111E88Ab4Af3', 
      decimals: 18,
      burnAddresses: ["0x0000000000000000000000000000000000000000"]
    },
    OCICAT: {
      contractAddress: '0x37Fe635D1e25B2F7276C1B9dBBcc7b087f80C050', 
      decimals: 18,
      burnAddresses: ["0x0000000000000000000000000000000000000000"]
    },
  };

  try {
    if (!tokenName) {
      return NextResponse.json({ error: 'Token name is required' }, { status: 400 });
    }

    if (!tokenData[tokenName]) {
      return NextResponse.json({ error: 'Invalid token name' }, { status: 400 });
    }

    const { contractAddress, decimals, burnAddresses } = tokenData[tokenName];

    const formatNumber = (number) => {
      const suffixes = ['', 'K', 'M', 'B', 'T'];
      let i = 0;
      while (number >= 1000 && i < suffixes.length - 1) {
        number /= 1000;
        i++;
      }
      return `${number.toFixed(2)}${suffixes[i]}`;
    };

    // Get current date at midnight UTC
    const now = new Date();
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const startOfTodayTimestamp = Math.floor(startOfToday.getTime() / 1000);
    const currentTimestamp = Math.floor(now.getTime() / 1000);

    // First get the latest block
    const latestBlockResponse = await axios.get('https://api.bscscan.com/api', {
      params: {
        module: 'proxy',
        action: 'eth_blockNumber',
        apikey: process.env.BSCSCAN_API_KEY,
      },
    });
    
    const latestBlock = parseInt(latestBlockResponse.data.result, 16);

    // Get starting block for today
    const startBlockResponse = await axios.get('https://api.bscscan.com/api', {
      params: {
        module: 'block',
        action: 'getblocknobytime',
        timestamp: startOfTodayTimestamp.toString(),
        closest: 'after',
        apikey: process.env.BSCSCAN_API_KEY,
      },
    });

    const startBlock = parseInt(startBlockResponse.data.result);
    
    let totalBurnedToday = 0;
    let recentBurns = [];

    const response = await axios.get('https://api.bscscan.com/api', {
      params: {
        module: 'account',
        action: 'tokentx',
        contractaddress: contractAddress,
        address: burnAddresses.join(','),
        startblock: startBlock,
        endblock: latestBlock,
        apikey: process.env.BSCSCAN_API_KEY,
        sort: 'desc',
        offset: 10000,
        page: 1,
      },
    });

    if (response.data.status === '1' && response.data.result.length > 0) {
      const burns = response.data.result;
      recentBurns = burns.map(transaction => {
        const value = parseFloat(transaction.value) / Math.pow(10, decimals);
        totalBurnedToday += value;
        const timestamp = parseInt(transaction.timeStamp, 10) * 1000;
        return {
          from: transaction.from,
          value: value,
          blockNumber: parseInt(transaction.blockNumber, 10),
          timestamp: timestamp,
          time: new Date(timestamp).toISOString(),
        };
      });
    }

    const formattedTotalBurned = formatNumber(totalBurnedToday);

    return NextResponse.json({
      token: tokenName,
      contractAddress: contractAddress,
      burnAddresses: burnAddresses,
      totalBurnedToday: formattedTotalBurned,
      burnCount: recentBurns.length,
      recentBurns: recentBurns.slice(0, 100),
      timeframe: {
        startTime: new Date(startOfTodayTimestamp * 1000).toISOString(),
        currentTime: new Date(currentTimestamp * 1000).toISOString(),
        startBlock: startBlock,
        currentBlock: latestBlock
      }
    });

  } catch (error) {
    console.error('Error fetching burns:', error.message, error.stack);
    return NextResponse.json({ 
      error: 'An error occurred',
      totalBurnedToday: "0.00" 
    }, { status: 500 });
  }
}