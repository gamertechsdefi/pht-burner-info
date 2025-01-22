export async function getTokenTotalSupply() {

  try {
    const response = await fetch("https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=0x885c99a787BE6b41cbf964174C771A9f7ec48e04&apikey=9IFFYSFYPYXI6KAWB3ATRMCHH8DZBJATRH");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === '1' && data.message === 'OK') {
      const totalSupply = parseInt(data.result) / Math.pow(10, 18);
      return totalSupply;
    } else {
      throw new Error(data.message || 'Failed to fetch token supply');
    }
  } catch (error) {
    console.error('Error fetching token supply:', error);
    throw error;
  }
}

export async function getTokenCSupply() {

  try {
    const response = await fetch("https://api.bscscan.com/api?module=stats&action=tokenCsupply&contractaddress=0x885c99a787BE6b41cbf964174C771A9f7ec48e04&apikey=9IFFYSFYPYXI6KAWB3ATRMCHH8DZBJATRH");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === '1' && data.message === 'OK') {
      const totalSupply = parseInt(data.result) / Math.pow(10, 18);
      return totalSupply;
    } else {
      throw new Error(data.message || 'Failed to fetch token supply');
    }
  } catch (error) {
    console.error('Error fetching token supply:', error);
    throw error;
  }
}

export async function getBurnAmount() {

  try {
    const response = await fetch("https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x885c99a787BE6b41cbf964174C771A9f7ec48e04&address=0x000000000000000000000000000000000000dEaD&tag=latest&apikey=9IFFYSFYPYXI6KAWB3ATRMCHH8DZBJATRH");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === '1' && data.message === 'OK') {
      const totalSupply = parseInt(data.result) / Math.pow(10, 18);
      return totalSupply;
    } else {
      throw new Error(data.message || 'Failed to fetch token supply');
    }
  } catch (error) {
    console.error('Error fetching token supply:', error);
    throw error;
  }
}

export async function getLockAmount() {
  try {
    const response = await fetch("https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x885c99a787BE6b41cbf964174C771A9f7ec48e04&address=0x407993575c91ce7643a4d4cCACc9A98c36eE1BBE&tag=latest&apikey=9IFFYSFYPYXI6KAWB3ATRMCHH8DZBJATRH");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === '1' && data.message === 'OK') {
      const totalSupply = parseInt(data.result) / Math.pow(10, 18);
      return totalSupply;
    } else {
      throw new Error(data.message || 'Failed to fetch token supply');
    }
  } catch (error) {
    console.error('Error fetching token supply:', error);
    throw error;
  }
}

async function getTokenSupply() {

  const response = await fetch(
    "https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=0x885c99a787BE6b41cbf964174C771A9f7ec48e04&apikey=9IFFYSFYPYXI6KAWB3ATRMCHH8DZBJATRH"
  );

  const data = await response.json();
  
  if (data.status !== '1' || data.message !== 'OK') {
    throw new Error('Failed to fetch token supply');
  }

  // Convert from wei to token units (assuming 18 decimals)
  return parseInt(data.result) / Math.pow(10, 18);
}

async function getDexPrice() {

  const response = await fetch(
    "https://api.dexscreener.com/latest/dex/tokens/0x885c99a787BE6b41cbf964174C771A9f7ec48e04"
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.pairs || data.pairs.length === 0) {
    throw new Error('No trading pairs found for this token');
  }

  return data.pairs[0];
}

export async function getTokenData() {
  try {
    const [supply, dexData] = await Promise.all([
      getTokenSupply(),
      getDexPrice()
    ]);

    const price = parseFloat(dexData.priceUsd || 0);
    const marketCap = price * supply;

    return {
      price,
      priceChange24h: parseFloat(dexData.priceChange.h24 || 0),
      volume24h: parseFloat(dexData.volume.h24 || 0),
      liquidity: parseFloat(dexData.liquidity.usd || 0),
      marketCap,
      totalSupply: supply,
      dexId: dexData.dexId,
      pairAddress: dexData.pairAddress,
      lastUpdated: dexData.priceDate
    };
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw error;
  }
}
