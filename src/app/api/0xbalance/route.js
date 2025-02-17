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
      try {
        if (number === 0 || !number) return "0.00";

        const suffixes = ['', 'K', 'M', 'B', 'T'];
        const suffixNum = Math.floor(Math.log10(Math.abs(number)) / 3);
        const shortValue = number / Math.pow(1000, suffixNum);
        
        if (suffixNum >= suffixes.length) {
          return number.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        }

        // Format with appropriate decimal places
        const formattedNumber = shortValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });

        return `${formattedNumber}${suffixes[suffixNum]}`;
      } catch (error) {
        console.error('Error formatting number:', error);
        return "0.00";
      }
    };

    // Get timestamps
    const now = new Date();
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const startOfTodayTimestamp = Math.floor(startOfToday.getTime() / 1000);
    const currentTimestamp = Math.floor(now.getTime() / 1000);

    // Get blocks in parallel
    const [latestBlockResponse, startBlockResponse] = await Promise.all([
      axios.get('https://api.bscscan.com/api', {
        params: {
          module: 'proxy',
          action: 'eth_blockNumber',
          apikey: process.env.BSCSCAN_API_KEY,
        },
      }),
      axios.get('https://api.bscscan.com/api', {
        params: {
          module: 'block',
          action: 'getblocknobytime',
          timestamp: startOfTodayTimestamp.toString(),
          closest: 'after',
          apikey: process.env.BSCSCAN_API_KEY,
        },
      })
    ]);

    const latestBlock = parseInt(latestBlockResponse.data.result, 16);
    const startBlock = parseInt(startBlockResponse.data.result);

    let totalBurnedToday = 0;
    let recentBurns = [];
    let page = 1;
    let hasMoreTransactions = true;
    const pageSize = 10000;

    // Fetch transactions in batches until we get them all
    while (hasMoreTransactions) {
      try {
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
            offset: pageSize,
            page: page,
          },
        });

        if (response.data.status === '1' && response.data.result.length > 0) {
          const burns = response.data.result;
          const newBurns = burns.map(transaction => {
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

          recentBurns = [...recentBurns, ...newBurns];
          
          // Check if we need to fetch more
          hasMoreTransactions = burns.length === pageSize;
          page++;

          // Add delay to avoid rate limiting
          if (hasMoreTransactions) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } else {
          hasMoreTransactions = false;
        }
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        hasMoreTransactions = false;
      }
    }

    const formattedTotalBurned = formatNumber(totalBurnedToday);

    return NextResponse.json({
      token: tokenName,
      contractAddress: contractAddress,
      burnAddresses: burnAddresses,
      totalBurnedToday: formattedTotalBurned,
      rawBurnedToday: totalBurnedToday,
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
      totalBurnedToday: "0.00",
      rawBurnedToday: 0,
      burnCount: 0,
      recentBurns: []
    }, { status: 500 });
  }
}