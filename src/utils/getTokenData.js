async function getBurnAmount(tokenName) {
  try {
      // Token data with contract addresses and decimals
      const tokenData = {
          PHT: { contractAddress: '0x885c99a787BE6b41cbf964174C771A9f7ec48e04', decimals: 18 },
          WKC: { contractAddress: '0x6Ec90334d89dBdc89E08A133271be3d104128Edb', decimals: 18 },
          DTG: { contractAddress: '0xb1957BDbA889686EbdE631DF970ecE6A7571A1B6', decimals: 9 },
          WAR: { contractAddress: '0x57bfe2af99aeb7a3de3bc0c42c22353742bfd20d', decimals: 18 },
          YUKAN: { contractAddress: '0xd086B849a71867731D74D6bB5Df4f640de900171', decimals: 9 },
          BTCDRAGON: { contractAddress: '0x1ee8a2f28586e542af677eb15fd00430f98d8fd8', decimals: 18 },
          // Add more tokens as needed
      };

      // Ensure token exists in the map
      const token = tokenData[tokenName.toUpperCase()];
      if (!token) {
          console.warn(`Token ${tokenName} not found.`);
          return null; // or return 0 if you prefer a default value
      }

      const { contractAddress, decimals } = token;

      const apiUrl = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=0x000000000000000000000000000000000000dEaD&tag=latest&apikey=${process.env.BSCSCAN_API_KEY}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === '1' && data.message === 'OK') {
          // Adjust the burn amount based on token decimals
          const burntSupply = parseInt(data.result) / Math.pow(10, decimals);
          return burntSupply;
      } else {
          throw new Error(data.message || 'Failed to fetch burn amount');
      }
  } catch (error) {
      console.error('Error fetching burn amount:', error.message);
      return null; // Return null instead of throwing to prevent breaking the app
  }
}

async function getTokenCSupply(tokenName) {
  try {
      // Define token data with both contractAddress and decimals
      const tokenData = {
          PHT: { 
              contractAddress: '0x885c99a787BE6b41cbf964174C771A9f7ec48e04', 
              decimals: 18 
          },
          WKC: { 
              contractAddress: '0x6Ec90334d89dBdc89E08A133271be3d104128Edb', 
              decimals: 18 
          },
          DTG: { 
              contractAddress: '0xb1957BDbA889686EbdE631DF970ecE6A7571A1B6', 
              decimals: 9
          },
          WAR: { 
              contractAddress: '0x57bfe2af99aeb7a3de3bc0c42c22353742bfd20d', 
              decimals: 18 
          },
          YUKAN: { 
              contractAddress: '0xd086B849a71867731D74D6bB5Df4f640de900171', 
              decimals: 9
          },
          BTCDRAGON: { 
              contractAddress: '0x1ee8a2f28586e542af677eb15fd00430f98d8fd8', 
              decimals: 18 
          },
          // Add more tokens as needed
      };

      // Fetch contractAddress and decimals for the given tokenName
      const token = tokenData[tokenName];
      if (!token) {
          throw new Error('Token not found');
      }

      const { contractAddress, decimals } = token;

      // Fetch circulatory supply using the contract address and token details
      const response = await fetch(
        `https://api.bscscan.com/api?module=stats&action=tokenCsupply&contractaddress=${contractAddress}&apikey=${process.env.BSCSCAN_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === '1' && data.message === 'OK') {
        // Convert circulatory supply based on the token's decimals
        const supply = parseInt(data.result) / Math.pow(10, decimals); // Use decimals dynamically
        return supply;
      } else {
        throw new Error(data.message || 'Failed to fetch circulatory supply');
      }
  } catch (error) {
    console.error('Error fetching circulatory supply:', error);
    throw error;
  }
}

export async function getDexPrice(tokenName) {
  try {
    // Token data with contract addresses and decimals
    const tokenData = {
        PHT: { contractAddress: '0x885c99a787BE6b41cbf964174C771A9f7ec48e04', decimals: 18 },
        WKC: { contractAddress: '0x6Ec90334d89dBdc89E08A133271be3d104128Edb', decimals: 18 },
        DTG: { contractAddress: '0xb1957BDbA889686EbdE631DF970ecE6A7571A1B6', decimals: 9 },
        WAR: { contractAddress: '0x57bfe2af99aeb7a3de3bc0c42c22353742bfd20d', decimals: 18 },
        YUKAN: { contractAddress: '0xd086B849a71867731D74D6bB5Df4f640de900171', decimals: 9 },
        BTCDRAGON: { contractAddress: '0x1ee8a2f28586e542af677eb15fd00430f98d8fd8', decimals: 18 },
        // Add more tokens as needed
    };

    const token = tokenData[tokenName];

    if (!token) {
        throw new Error('Token not found');
    }

    const { contractAddress, decimals } = token;

    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.pairs || data.pairs.length === 0) {
        throw new Error('No trading pairs found for this token');
    }

    // Assuming we want to return the price in token units, convert the price based on decimals
    const pair = data.pairs[0];
    const price = parseFloat(pair.priceUsd || 0);
    
    return {
        ...pair,
        priceUsd: price,
        priceAdjustedForDecimals: price / Math.pow(10, decimals), // Adjust price for decimals
    };
  } catch (error) {
    console.error('Error fetching Dex price:', error);
    throw error;
  }
}

export async function getTokenData(tokenName) {
  try {
      const tokenData = {
          PHT: { 
              contractAddress: '0x885c99a787BE6b41cbf964174C771A9f7ec48e04', 
              decimals: 18 
          },
          WKC: { 
              contractAddress: '0x6Ec90334d89dBdc89E08A133271be3d104128Edb', 
              decimals: 18 
          },
          DTG: { 
              contractAddress: '0xb1957BDbA889686EbdE631DF970ecE6A7571A1B6', 
              decimals: 9
          },
          WAR: { 
              contractAddress: '0x57bfe2af99aeb7a3de3bc0c42c22353742bfd20d', 
              decimals: 18 
          },
          YUKAN: { 
              contractAddress: '0xd086B849a71867731D74D6bB5Df4f640de900171', 
              decimals: 9
          },
          BTCDRAGON: { 
              contractAddress: '0x1ee8a2f28586e542af677eb15fd00430f98d8fd8', 
              decimals: 18 
          },
          // Add more tokens as needed
      };

      const token = tokenData[tokenName];

      if (!token) {
          throw new Error('Token not found');
      }

      const { contractAddress, decimals } = token;

      // Fetch both supply and dex data
      const [supply, burntSupply, dexData] = await Promise.all([
          getTokenCSupply(tokenName), // Fetch circulating supply using the correct function call
          getBurnAmount(tokenName),   // Fetch burnt amount using the correct function call
          getDexPrice(tokenName),     // Fetch Dex price using the correct function call
      ]);

      const circulatingSupply = supply - (burntSupply || 0); // Calculate circulating supply
      const price = parseFloat(dexData.priceUsd || 0); // Ensure we have a valid price

      return {
          price,
          priceChange24h: parseFloat(dexData.priceChange?.h24 || 0),
          volume24h: parseFloat(dexData.volume?.h24 || 0),
          liquidityUsd : parseFloat(dexData.liquidity?.usd || 0),
          marketCap : price * circulatingSupply, // Calculate market cap based on price and circulating supply
          totalSupply : supply,
          circulatingSupply,
          dexId : dexData.dexId,
          pairAddress : dexData.pairAddress,
          lastUpdated : dexData.priceDate,
       };
  } catch (error) {
       console.error('Error fetching token data:', error);
       throw error;
  }
}
