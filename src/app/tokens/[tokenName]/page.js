'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import DataCard from '@/components/DataCard';
import BurnList from '@/components/BurnList';

const addCommas = (number) => {
    if (isNaN(number)) return number;
    return number.toLocaleString();
};

export default function TokenPage() {
    const router = useRouter();
    const { tokenName } = useParams();
    const [tokenData, setTokenData] = useState(null);
    const [formattedSupply, setFormattedSupply] = useState("Loading...");
    const [formattedBurnt, setFormattedBurnt] = useState("Loading...");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!tokenName) return;

        const fetchData = async (endpoint, setter) => {
            setLoading(true);
            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || `Failed to fetch ${endpoint}`);
                setter(addCommas(data.supply || data.burnt || data.value));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData(`/api/tokenData?tokenName=${tokenName}`, setTokenData);
        fetchData(`/api/tokenSupply?tokenName=${tokenName}`, setFormattedSupply);
        fetchData(`/api/burnt?tokenName=${tokenName}`, setFormattedBurnt);

    }, [tokenName]);

    return (
        <div className="bg-gradient-to-b from-transparent to-orange-500">
            <Header />
            <main className="px-6 md:px-8 py-16">
                <SearchBar />
                {error && <div className="text-red-500">{error}</div>}
                {loading && <div>Loading...</div>}
                {tokenData && (
                    <>
                        <section className="md:px-16">
                            <h1 className="text-xl font-bold">{tokenName.toUpperCase()} Price: {tokenData.price}</h1>
                            <h1>Market Cap: ${tokenData.marketCap}</h1>
                            <h1>Volume (24h): ${tokenData.volume24h}</h1>
                        </section>

                        <section className="mt-8 md:mt-16 flex flex-col md:flex-row md:gap-32 md:mx-16">
                            <DataCard title="Total Supply" value={formattedSupply} bg="bg-white text-black" />
                            <DataCard title="Total Burnt" value={formattedBurnt} bg="bg-red-600" />
                        </section>

                        <BurnList />
                    </>
                )}
            </main>
        </div>
    );
}
