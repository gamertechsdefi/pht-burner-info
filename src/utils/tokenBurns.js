import axios from 'axios';

export async function fetchBurns(contractAddress, burnAddresses = []) {
  try {
    if (!contractAddress || burnAddresses.length === 0) {
      throw new Error('Contract address and burn addresses are required');
    }

    // Helper function to format time ago
    const timeAgo = (timestamp) => {
      const now = Date.now();
      const secondsAgo = Math.floor((now - timestamp) / 1000);

      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
      };

      for (let [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(secondsAgo / seconds);
        if (interval >= 1) {
          return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
        }
      }
      return 'Just now';
    };

    // Fetch the latest block number from BscScan API
    const latestBlockResponse = await axios.get('https://api.bscscan.com/api', {
      params: {
        module: 'proxy',
        action: 'eth_blockNumber',
        apikey: process.env.BSCSCAN_API_KEY,
      },
    });

    const latestBlockNumber = parseInt(latestBlockResponse.data.result, 16);
    console.log('Latest Block on BSC:', latestBlockNumber);

    // Fetch burns using BscScan API, but only transactions to any of the burn addresses
    const response = await axios.get('https://api.bscscan.com/api', {
      params: {
        module: 'account',
        action: 'tokentx',
        contractaddress: contractAddress,
        address: burnAddresses.join(','), // Join multiple burn addresses with commas
        apikey: process.env.BSCSCAN_API_KEY,
        sort: 'desc', // Sort by block number descending (most recent first)
        page: 1,
        offset: 100, // Limit to 100 recent transactions
      },
    });

    if (response.data.status === '1') {
      // Filter out transactions that happened after the latest block (this will help avoid any discrepancies)
      const recentBurns = response.data.result.filter((transaction) => {
        const transactionBlockNumber = parseInt(transaction.blockNumber, 10);
        return transactionBlockNumber <= latestBlockNumber;
      });

      // Map the filtered response data to our desired output format
      return recentBurns.map((transaction) => {
        const timestamp = parseInt(transaction.timeStamp, 10) * 1000; // Convert to milliseconds

        return {
          from: transaction.from,
          value: transaction.value / Math.pow(10, transaction.tokenDecimal), // Convert to decimals
          blockNumber: parseInt(transaction.blockNumber, 10),
          time: timeAgo(timestamp), // Convert timestamp to "time ago"
        };
      });
    } else {
      console.error('BscScan API error:', response.data.message);
      throw new Error('Failed to fetch burns from BscScan');
    }
  } catch (error) {
    console.error('Error fetching burns:', error.message, error.stack);
    throw error;
  }
}
