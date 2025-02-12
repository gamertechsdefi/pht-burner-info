import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const tokenName = searchParams.get("tokenName");

        if (!tokenName) {
            return NextResponse.json({ error: "Token name is required" }, { status: 400 });
        }

        // Define token contract addresses
        const tokenData = {
            PHT: "0x885c99a787BE6b41cbf964174C771A9f7ec48e04",
            WKC: "0x6Ec90334d89dBdc89E08A133271be3d104128Edb",
            DTG: "0xb1957BDbA889686EbdE631DF970ecE6A7571A1B6",
            WAR: "0x57bfe2af99aeb7a3de3bc0c42c22353742bfd20d",
            YUKAN: "0xd086B849a71867731D74D6bB5Df4f640de900171",
            BTCDRAGON: "0x1ee8a2f28586e542af677eb15fd00430f98d8fd8",
            NENE: "0x551877C1A3378c3A4b697bE7f5f7111E88Ab4Af3"
        };

        const contractAddress = tokenData[tokenName.toUpperCase()];
        if (!contractAddress) {
            return NextResponse.json({ error: "Token not found" }, { status: 404 });
        }

        // Call Moralis API
        const response = await fetch(`https://deep-index.moralis.io/api/v2.2/erc20/${contractAddress}/holders?chain=bsc`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "X-API-Key": process.env.MORALIS_API_KEY, // Ensure you set this in .env.local
            },
        });

        console.log(response);
        if (!response.ok) {
            throw new Error(`Failed to fetch holders data: ${response.statusText}`);
        }

        const data = await response.json();
        const holdersCount = data?.totalHolders || 0; // Get total holders count
        // const change30D = data?.holderChange?.30

        return NextResponse.json({ holdersCount }, { status: 200 });

    } catch (error) {
        console.error("Error fetching token holders count:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
