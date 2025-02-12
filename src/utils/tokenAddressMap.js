// utils/tokenAddressMap.js

const tokenAddressMap = {
    PHT: '0x885c99a787BE6b41cbf964174C771A9f7ec48e04',
    WKC: '0x6Ec90334d89dBdc89E08A133271be3d104128Edb',
    DTG: '0xb1957BDbA889686EbdE631DF970ecE6A7571A1B6',
    WAR: '0x57bfe2af99aeb7a3de3bc0c42c22353742bfd20d',
    YUKAN: '0xd086B849a71867731D74D6bB5Df4f640de900171',
    BTCDRAGON: '0x...ContractAddressForTokenB',
    
    // Add more tokens here as needed
  };
  
  // Function to get the contract address based on the token name
  export function getContractAddressByName(tokenName) {
    return tokenAddressMap[tokenName.toUpperCase()];
  }
  