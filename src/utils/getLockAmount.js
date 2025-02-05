export async function getLockAmount(tokenName) {
    try {
      // Define the token data with both contractAddress and decimals
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
        NENE: { contractAddress: '0x551877C1A3378c3A4b697bE7f5f7111E88Ab4Af3', decimals: 18 },
        // Add more tokens as needed
      };
  
      // Fetch contractAddress and decimals for the given tokenName
      const token = tokenData[tokenName];
      if (!token) {
        throw new Error('Token not found');
      }
  
      const { contractAddress, decimals } = token;
  
      // Fetch lock amount using the contract address and token details
      const response = await fetch(
        `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=0x407993575c91ce7643a4d4cCACc9A98c36eE1BBE&tag=latest&apikey=${process.env.BSCSCAN_API_KEY}`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.status === '1' && data.message === 'OK') {
        // Convert the lock amount based on the token's decimals
        const lockAmount = parseInt(data.result) / Math.pow(10, decimals); // Use decimals dynamically
        return lockAmount;
      } else {
        throw new Error(data.message || 'Failed to fetch lock amount');
      }
    } catch (error) {
      console.error('Error fetching lock amount:', error);
      throw error;
    }
  }
  