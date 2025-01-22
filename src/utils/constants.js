export const BURN_ADDRESSES = [
    '0x000000000000000000000000000000000000dead',
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000001',
  ];
  
  export const TOKEN_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    }
  ];