export const fetchTokenData = async (tokenName) => {
    const response = await fetch(`/api/tokenData?token=${tokenName}`);
    if (!response.ok) {
      throw new Error('Failed to fetch token data');
    }
    return response.json();
  };
  
  export const fetchSupply = async (tokenName) => {
    const response = await fetch(`/api/tokenSupply?token=${tokenName}`);
    if (!response.ok) {
      throw new Error('Failed to fetch total supply');
    }
    return response.json();
  };
  
  export const fetchCirculatorySupply = async (tokenName) => {
    const response = await fetch(`/api/circulatorySupply?token=${tokenName}`);
    if (!response.ok) {
      throw new Error('Failed to fetch circulatory supply');
    }
    return response.json();
  };
  
  export const fetchBurnt = async (tokenName) => {
    const response = await fetch(`/api/burnt?token=${tokenName}`);
    if (!response.ok) {
      throw new Error('Failed to fetch burnt supply');
    }
    return response.json();
  };
  
  export const fetchLocked = async (tokenName) => {
    const response = await fetch(`/api/lock?token=${tokenName}`);
    if (!response.ok) {
      throw new Error('Failed to fetch locked supply');
    }
    return response.json();
  };
  