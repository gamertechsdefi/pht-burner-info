import axios from "axios";

export async function getHoldersCount(tokenName) {
    try {
        const tokenData = {
            PHT: "0x885c99a787BE6b41cbf964174C771A9f7ec48e04",
            WKC: "0x6Ec90334d89dBdc89E08A133271be3d104128Edb",
            DTG: "0xb1957BDbA889686EbdE631DF970ecE6A7571A1B6",
            WAR: "0x57bfe2af99aeb7a3de3bc0c42c22353742bfd20d",
            YUKAN: "0xd086B849a71867731D74D6bB5Df4f640de900171",
            BTCDRAGON: "0x1ee8a2f28586e542af677eb15fd00430f98d8fd8",
            NENE: "0x551877C1A3378c3A4b697bE7f5f7111E88Ab4Af3",
        };

        const tokenAddress = tokenData[tokenName];
        if (!tokenAddress) {
            throw new Error("Token not found");
        }

        const url = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/holders?chain=bsc`;
        const response = await axios.get(url, {
            headers: { "X-API-Key": process.env.MORALIS_API_KEY },
        });

        if (response.data && response.data.total) {
            return response.data.total.toLocaleString(); // Format as human-readable
        } else {
            throw new Error("Holders count not found");
        }
    } catch (error) {
        console.error("Error fetching holders count:", error.message);
        throw error;
    }
}
