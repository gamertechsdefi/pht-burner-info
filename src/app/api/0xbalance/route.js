import { NextResponse } from "next/server";
const axios = require("axios");

const ETHERSCAN_API_KEY = process.env.BSCSCAN_API_KEY;
const ETHERSCAN_API_URL = "https://api.bscscan.com/api";
const BURN_ADDRESS = "0x000000000000000000000000000000000000";

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const tokenAddress = url.searchParams.get("token");

        if (!tokenAddress) {
            return NextResponse.json({ error: "Token address is required" }, { status: 400 });
        }

        if (!isValidAddress(tokenAddress)) {
            return NextResponse.json({ error: "Invalid token address" }, { status: 400 });
        }

        // Fetch ABI
        const contractAbiUrl = `${ETHERSCAN_API_URL}?module=contract&action=getabi&address=${tokenAddress}&apikey=${ETHERSCAN_API_KEY}`;
        console.log(contractAbiUrl);
        const abiResponse = await axios.get(contractAbiUrl);

        if (abiResponse.status !== 200) {
            console.error('API response status:', abiResponse.status, 'Body:', abiResponse.data);
            throw new Error('Failed to fetch ABI');
        }

        let abiData = abiResponse.data;
        if (abiData.message !== 'OK') {
            console.error('API error:', abiData.message);
            throw new Error('Failed to fetch ABI');
        }

        const abi = JSON.parse(abiData.result);

        // Determine token decimals
        let decimals = 18; // Default for most tokens
        try {
            const decimalsMethod = abi.find(item => item.name === "decimals" && item.type === "function");
            if (decimalsMethod) {
                // Here you would typically call the contract to get the actual decimals, but for simplicity:
                decimals = 18; // or whatever the contract returns
            }
        } catch (e) {
            console.error("Could not fetch decimals, using default:", e);
        }

        // Check if contract has required methods
        if (!hasRequiredMethods(abi)) {
            return NextResponse.json({ error: "Contract does not exist or is not a valid BEP-20 contract" }, { status: 400 });
        }

        // Fetch events
        const eventsUrl = `${ETHERSCAN_API_URL}?module=account&action=tokentx&contractaddress=${tokenAddress}&to=${BURN_ADDRESS}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
        const eventsResponse = await axios.get(eventsUrl);

        if (eventsResponse.status !== 200) {
            console.error('API response status:', eventsResponse.status, 'Body:', eventsResponse.data);
            throw new Error('Failed to fetch events');
        }

        let eventsData = eventsResponse.data;
        if (eventsData.message !== 'OK') {
            console.error('API error:', eventsData.message);
            throw new Error('Failed to fetch events');
        }

        let totalBurned = BigInt(0);
        const seenEvents = new Set();

        for (let event of eventsData.result) {
            console.log(`Event value: ${event.value}`);
            const eventString = JSON.stringify(event);
            if (!seenEvents.has(eventString)) {
                seenEvents.add(eventString);
                totalBurned += BigInt(`0x${event.value}`);
            }
        }

        // Format the number with correct decimal precision
        const formattedAmount = Number(totalBurned / BigInt(10 ** decimals)).toFixed(decimals);

        return NextResponse.json({
            token: tokenAddress,
            burnedAmount: formattedAmount,
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching burned amount:", error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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