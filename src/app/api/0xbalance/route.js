// pages/api/burns/[contractAddress].js
import axios from 'axios';

export default async function handler(req, res) {
  const { contractAddress } = req.query;
  const burnAddresses = ["0x0000000000000000000000000000000000000000"];

  try {
    if (!contractAddress) {
      return res.status(400).json({ error: 'Contract address is required' });
    }

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

    const formatNumber = (number) => {
      const suffixes = ['', 'K', 'M', 'B', 'T'];
      let i = 0;
      while (number >= 1000 && i < suffixes.length - 1) {
        number /= 1000;
        i++;
      }
      return `${number.toFixed(2)}${suffixes[i]}`;
    };

    const latestBlockResponse = await axios.get('https://api.bscscan.com/api', {
      params: {
        module: 'proxy',
        action: 'eth_blockNumber',
        apikey: process.env.BSCSCAN_API_KEY,
      },
    });

    const latestBlockNumber = parseInt(latestBlockResponse.data.result, 16);

    let totalBurned = 0;
    let allBurns = [];
    let page = 1;
    const offset = 1000;
    let hasMoreData = true;

    while (hasMoreData) {
      const response = await axios.get('https://api.bscscan.com/api', {
        params: {
          module: 'account',
          action: 'tokentx',
          contractaddress: contractAddress,
          address: burnAddresses.join(','),
          apikey: process.env.BSCSCAN_API_KEY,
          sort: 'asc',
          page: page,
          offset: offset,
        },
      });

      if (response.data.status === '1') {
        const burns = response.data.result;
        if (burns && burns.length > 0) {
          allBurns = allBurns.concat(burns);

          burns.forEach(transaction => {
            const transactionBlockNumber = parseInt(transaction.blockNumber, 10);
            if (transactionBlockNumber <= latestBlockNumber) {
              totalBurned += parseFloat(transaction.value) / Math.pow(10, transaction.tokenDecimal);
            }
          });
          page++;
        } else {
          hasMoreData = false;
        }
      } else {
        console.error('BscScan API error:', response.data.message);
        return res.status(500).json({ error: 'Failed to fetch burns from BscScan' });
      }
    }

    const formattedTotalBurned = formatNumber(totalBurned);

    const recentBurns = allBurns.filter((transaction) => {
        const transactionBlockNumber = parseInt(transaction.blockNumber, 10);
        return transactionBlockNumber <= latestBlockNumber;
      }).slice(-100).map((transaction) => {
        const timestamp = parseInt(transaction.timeStamp, 10) * 1000;
        return {
            from: transaction.from,
            value: parseFloat(transaction.value) / Math.pow(10, transaction.tokenDecimal),
            blockNumber: parseInt(transaction.blockNumber, 10),
            time: timeAgo(timestamp),
        };
    });

    res.status(200).json({
      totalBurned: formattedTotalBurned,
      recentBurns: recentBurns,
    });

  } catch (error) {
    console.error('Error fetching burns:', error.message, error.stack);
    res.status(500).json({ error: 'An error occurred' });
  }
}