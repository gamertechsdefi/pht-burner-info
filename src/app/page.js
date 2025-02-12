'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import DataCard from '@/components/DataCard';
import BurnList from '@/components/BurnList';

import burnImage from "/public/assets/burn-im2.jpg";

const DEFAULT_TOKEN = "PHT"; // Ensure this token exists in BscScan

const addCommas = (number) => {
  if (isNaN(number)) return number;
  return number.toLocaleString();
};

export default function HomePage() {
  const router = useRouter();
  const [tokenName, setTokenName] = useState(DEFAULT_TOKEN);
  const [tokenData, setTokenData] = useState(null);
  const [formattedSupply, setFormattedSupply] = useState("Loading...");
  const [formattedBurnt, setFormattedBurnt] = useState("Loading...");
  const [formattedCSupply, setFormattedCSupply] = useState("Loading...");
  const [formattedLocked, setFormattedLocked] = useState("Loading...");
  const [formattedHolders, setFormattedHolders] = useState("Loading");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialTokenName = 'PHT'; // Default token

  useEffect(() => {
    fetchTokenData(DEFAULT_TOKEN);
  }, []);

  const fetchTokenData = async (token) => {
    setLoading(true);
    setError(null);
    setTokenName(token);

    console.log("Fetching data for token:", token);

    try {
      // Fetch full token data object
      const response = await fetch(`/api/tokenData?tokenName=${token}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch tokenData");

      console.log("Token Data API Response:", data);

      // Set tokenData correctly as an object
      setTokenData(data);

      // Fetch token supply, burnt supply, circulatory supply, locked supply
      const fetchSupplyData = async () => {
        const supplyResponse = await fetch(`/api/tokenSupply?tokenName=${token}`);
        const supplyData = await supplyResponse.json();
        setFormattedSupply(addCommas(supplyData.totalSupply));

        const holdersResponse = await fetch(`/api/holders?tokenName=${token}`);
        const holdersData = await holdersResponse.json();
        setFormattedHolders(addCommas(holdersData.holdersCount));

        const burntResponse = await fetch(`/api/burnt?tokenName=${token}`);
        const burntData = await burntResponse.json();
        setFormattedBurnt(addCommas(burntData.burnt));

        const circulatoryResponse = await fetch(`/api/circulatorySupply?tokenName=${token}`);
        const circulatoryData = await circulatoryResponse.json();
        setFormattedCSupply(addCommas(circulatoryData.totalCSupply));

        const lockedResponse = await fetch(`/api/lock?tokenName=${token}`);
        const lockedData = await lockedResponse.json();
        setFormattedLocked(addCommas(lockedData.lockAmount));
      };

      await fetchSupplyData();

    } catch (error) {
      console.error("Fetch Error:", error.message);
      setError(error.message);
      setTokenData(null);
    }

    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-b from-transparent to-orange-500 min-h-screen">
      <Header />
      <main className="px-6 md:px-8 py-16">
        <SearchBar onSearch={fetchTokenData} />

        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        {loading && <div className="text-center text-white mt-4">Loading...</div>}


        {tokenData && (
          <>

            <section className="mt-4 flex flex-col md:items-center md:flex-row md:justify-between">
              <div className='flex flex-row items-center gap-2'>
                <h1>{tokenName?.toUpperCase()} Price:</h1>
                <h1 className='flex flex-row items-center gap-2'>
                  <span>${tokenData?.price?.toFixed(11)}</span>
                  <span className='bg-neutral-700 text-white px-4 py-2 rounded-md'>{tokenData?.priceChange24h.toLocaleString()}%</span>
                </h1>
              </div>
              <div className='flex flex-row gap-2'>
                <h1>MarketCap:</h1>
                <h1>
                  <span>${tokenData?.marketCap.toLocaleString() || "N/A"}</span>
                </h1>
              </div>
              <div className='flex flex-row gap-2'>
                <h1>Volume:</h1>
                <h1>
                  <span>${tokenData?.volume24h.toLocaleString() || "N/A"}</span>
                </h1>
              </div>
              <div className='flex flex-row gap-2'>
                <h1>Holders:</h1>
                <h1>
                  <span>{formattedHolders || "N/A"}</span>
                </h1>
              </div>
            </section>

            <section className="mt-8 md:mt-16 flex flex-col md:justify-center md:flex-row md:gap-16">
              <div className='grid grid-cols-1'>
                <div className="relative h-32 p-8 mb-4 rounded-2xl flex flex-col items-center justify-center">
                  <Image
                    src={burnImage}
                    alt="Background"
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 rounded-2xl"
                  />
                  {/* Overlay with opacity */}
                  <div className="absolute top-0 rounded-2xl left-0 w-full h-full bg-[#ff0000] opacity-50 z-1" />
                  <div className="relative z-10 text-center">
                    <h1 className="text-xl text-white">TOTAL BURNT</h1>
                    <h1 className="text-3xl font-bold text-white">{formattedBurnt}</h1>
                  </div>
                </div>
                <DataCard title="Total Supply" value={formattedSupply} bg="bg-white text-black" />
                <DataCard title="Total Locked" value={formattedLocked} bg="bg-blue-600" />
                <DataCard title="Circulatory Supply" value={formattedCSupply} bg="bg-green-600" />
              </div>
              <BurnList tokenName={tokenName} />
            </section>


          </>
        )}
      </main>
    </div>
  );
}
