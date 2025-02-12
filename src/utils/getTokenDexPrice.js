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
      NENE: { contractAddress: '0x551877C1A3378c3A4b697bE7f5f7111E88Ab4Af3', decimals: 18 },
      OCICAT: {contractAddress: '0x37Fe635D1e25B2F7276C1B9dBBcc7b087f80C050', decimals: 18},
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
    
    // Return the pair data along with price adjusted to the token decimals
    return {
      ...pair,
      priceUsd: price,
      price: price / Math.pow(10, decimals), // Adjust price for decimals
    };
  } catch (error) {
    console.error('Error fetching Dex price:', error);
    throw error;
  }
}
