// src/utils/tokenBurns.js
import axios from 'axios';

const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY;
const CONTRACT_ADDRESS = '0x885c99a787BE6b41cbf964174C771A9f7ec48e04'; // Your actual contract address
const BURN_ADDRESS = "0x000000000000000000000000000000000000dEaD"; // Common burn address on BSC

export async function fetchBurns() {
  try {
    // Fetch burns using BscScan API. Note: This API call fetches transfers to the burn address.
    const response = await axios.get('https://api.bscscan.com/api', {
      params: {
        module: 'account',
        action: 'tokentx',
        contractaddress: CONTRACT_ADDRESS,
        address: BURN_ADDRESS, // Here we're looking for transfers to the burn address
        apikey: BSCSCAN_API_KEY,
        sort: 'desc', // Sort by block number descending (most recent first)
        page: 1, 
        offset: 100 // Limit to 30 recent transactions
      }
    });

    if (response.data.status === '1') {
      // Map the response data to our desired output format
      return response.data.result.map(transaction => ({
        from: transaction.from,
        value: transaction.value / Math.pow(10, transaction.tokenDecimal), // Convert to decimal
        blockNumber: parseInt(transaction.blockNumber, 10)
      }));
    } else {
      console.error('BscScan API error:', response.data.message);
      throw new Error('Failed to fetch burns from BscScan');
    }
  } catch (error) {
    console.error('Error fetching burns:', error.message, error.stack);
    throw error;
  }
}