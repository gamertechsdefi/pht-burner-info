import axios from "axios";

const ETHERSCAN_API_KEY = "1E2JNG6XDN9SB1HXKHVJS6U1ZVR8GR1GFC";
const ETHERSCAN_API_URL = "https://api.bscscan.com/api";
const BURN_ADDRESS = "0x0000000000000000000000000000000000000000";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const tokenAddress = url.searchParams.get("token");

    if (!tokenAddress) {
      return { error: "Token address is required" };
    }

    if (!isValidAddress(tokenAddress)) {
      return { error: "Invalid token address" };
    }

    const contractAbiUrl = `${ETHERSCAN_API_URL}?module=contract&action=getabi&address=${tokenAddress}&apikey=${ETHERSCAN_API_KEY}`;
    const abiResponse = await axios.get(contractAbiUrl);
    const abi = JSON.parse(abiResponse.data.result);

    // Check if contract has required methods
    if (!hasRequiredMethods(abi)) {
      return { error: "Contract does not exist or is not a valid BEP-20 contract" };
    }

    const eventsUrl = `${ETHERSCAN_API_URL}?module=account&action=tokentx&contractaddress=${tokenAddress}&to=${BURN_ADDRESS}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
    const eventsResponse = await axios.get(eventsUrl);
    const eventsData = eventsResponse.data.result;

    let totalBurned = 0;
    for (let event of eventsData) {
      totalBurned += parseInt(event.value, 16);
    }

    return {
      token: tokenAddress,
      burnedAmount: formatUnits(totalBurned.toString(), 18),
    };
  } catch (error) {
    console.error("Error fetching burned amount:", error.message);
    return { error: "Failed to fetch data" };
  }
}

function isValidAddress(address) {
  // Check if address is a valid BSC address
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function hasRequiredMethods(abi) {
  // Check if ABI contains required methods for BEP-20 contract
  const requiredMethods = ["name", "symbol", "decimals", "totalSupply"];
  for (let method of requiredMethods) {
    let foundMethod = false;
    for (let item of abi) {
      if (item.name === method && item.type === "function") {
        foundMethod = true;
        break;
      }
    }
    if (!foundMethod) return false;
  }
  return true;
}

function formatUnits(amount, decimals) {
  // Format units based on decimal value
  let formattedAmount;
  try{
     formattedAmount=(BigInt(amount)/BigInt(Math.pow(10,decimals))).toString();
   }catch(e){
     console.log(e.message)
   }  
   formattedAmount.replace(/(\r\n|\n|\r)/gm,"");
   return formattedAmount; 
}