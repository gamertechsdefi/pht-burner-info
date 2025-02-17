export async function getBurntAmount(tokenName) {
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
    };

    const token = tokenData[tokenName.toUpperCase()];
    if (!token) {
      console.warn(`Token ${tokenName} not found.`);
      return null;
    }

    const { contractAddress, decimals } = token;
    const apiUrl = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=0x000000000000000000000000000000000000dEaD&tag=latest&apikey=${process.env.BSCSCAN_API_KEY}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.status === '1' && data.message === 'OK') {
      const burntSupply = parseInt(data.result) / Math.pow(10, decimals);
      return burntSupply;
    } else {
      throw new Error(data.message || 'Failed to fetch burn amount');
    }
  } catch (error) {
    console.error('Error fetching burn amount:', error.message);
    return null;
  }
}

export async function getBurnAmount(tokenName) {
  try {
    const response = await fetch(`/api/0xbalance?tokenName=${tokenName}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.totalBurnedToday;
  } catch (error) {
    console.error('Error fetching 24h burn amount:', error);
    return "0.00";
  }
}
