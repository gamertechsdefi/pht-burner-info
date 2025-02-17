'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import DataCard from '@/components/DataCard';
import BurnList from '@/components/BurnList';
import { getBurnAmount } from '@/utils/getBurnAmount';

import burnImage from "/public/assets/burn-im2.jpg";

const DEFAULT_TOKEN = "PHT"; // Ensure this token exists in BscScan

const addCommas = (number) => {
  try {
    // Handle null, undefined, or invalid input
    if (number === null || number === undefined || number === '') {
      return '0';
    }
    
    // Remove any existing commas and non-numeric characters except decimal point
    const cleanNumber = String(number).replace(/[^0-9.-]/g, '');
    
    // Convert to number
    const num = parseFloat(cleanNumber);
    
    // Check if it's a valid number
    if (isNaN(num)) {
      return '0';
    }
    
    // Format with commas and fixed decimal places
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      notation: 'standard'
    }).format(num);
  } catch (error) {
    console.error('Error in addCommas:', error);
    return '0';
  }
};

const formatDisplayValue = (value, defaultValue = "N/A") => {
  try {
    // Handle null, undefined, or empty values
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }

    // Remove any existing commas and non-numeric characters except decimal point
    const cleanValue = String(value).replace(/[^0-9.-]/g, '');
    
    // Convert to number
    const num = parseFloat(cleanValue);

    // Check if it's a valid number
    if (isNaN(num)) {
      return defaultValue;
    }

    // Format based on value size
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: Math.abs(num) < 1 ? 11 : 2,
      notation: num > 1000000 ? 'compact' : 'standard'
    }).format(num);
  } catch (error) {
    console.error('Error in formatDisplayValue:', error);
    return defaultValue;
  }
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
  const [burned24h, setBurned24h] = useState("0.00");

  const initialTokenName = 'PHT'; // Default token

  useEffect(() => {
    fetchTokenData(DEFAULT_TOKEN);
  }, []);

  const fetchTokenData = async (token) => {
    setLoading(true);
    setError(null);
    setTokenName(token);

    try {
      const [
        tokenDataRes,
        supplyData,
        holdersData,
        burntData,
        circulatoryData,
        lockedData,
        burned24hData
      ] = await Promise.all([
        fetch(`/api/tokenData?tokenName=${token}`),
        fetch(`/api/tokenSupply?tokenName=${token}`),
        fetch(`/api/holders?tokenName=${token}`),
        fetch(`/api/burnt?tokenName=${token}`),
        fetch(`/api/circulatorySupply?tokenName=${token}`),
        fetch(`/api/lock?tokenName=${token}`),
        fetch(`/api/0xbalance?tokenName=${token}`)
      ]);

      const [
        tokenData,
        supply,
        holders,
        burnt,
        circulatory,
        locked,
        burned24h
      ] = await Promise.all([
        tokenDataRes.json(),
        supplyData.json(),
        holdersData.json(),
        burntData.json(),
        circulatoryData.json(),
        lockedData.json(),
        burned24hData.json()
      ]);

      if (!tokenDataRes.ok) throw new Error(tokenData.error || "Failed to fetch token data");

      setTokenData(tokenData);
      setFormattedSupply(addCommas(supply.totalSupply || 0));
      setFormattedHolders(addCommas(holders.holdersCount || 0));
      setFormattedBurnt(addCommas(burnt.burnt || 0));
      setFormattedCSupply(addCommas(circulatory.totalCSupply || 0));
      setFormattedLocked(addCommas(locked.lockAmount || 0));
      setBurned24h(burned24h.totalBurnedToday || "0.00");

    } catch (error) {
      console.error("Fetch Error:", error);
      setError(error.message);
      setTokenData(null);
      setBurned24h("0.00");
      // Reset other formatted values to safe defaults
      setFormattedSupply("0");
      setFormattedHolders("0");
      setFormattedBurnt("0");
      setFormattedCSupply("0");
      setFormattedLocked("0");
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
                  <span className='font-medium'>
                    ${tokenData?.price ? formatDisplayValue(tokenData.price, "0.00") : "0.00"}
                  </span>
                  <span className='bg-neutral-700 text-white px-4 py-2 rounded-md'>
                    {tokenData?.priceChange24h ? formatDisplayValue(tokenData.priceChange24h, "0.00") : "0.00"}%
                  </span>
                </h1>
              </div>
              <div className='flex flex-row gap-2'>
                <h1>MarketCap:</h1>
                <h1 className='font-medium'>
                  <span>${formatDisplayValue(tokenData?.marketCap, "N/A")}</span>
                </h1>
              </div>
              <div className='flex flex-row gap-2'>
                <h1>Volume:</h1>
                <h1 className='font-medium'>
                  <span>${formatDisplayValue(tokenData?.volume24h, "N/A")}</span>
                </h1>
              </div>
              <div className='flex flex-row gap-2'>
                <h1>Holders:</h1>
                <h1 className='font-medium'>
                  <span>{formattedHolders || "N/A"}</span>
                </h1>
              </div>
            </section>

            <section className="mt-8 md:mt-16 flex flex-col md:justify-center md:flex-row md:gap-16">
              <div>
              <div className="bg-neutral-800 p-4 rounded-lg shadow-lg">
                <h1 className="text-xl font-bold text-white mb-2">24 Hours Burns</h1>
                <h1 className="text-2xl font-bold text-red-500">
                  {burned24h === "0.00" ? "No burns today" : formatDisplayValue(burned24h, "0.00")}
                </h1>
              </div>

              <div className='grid grid-cols-1 px-2 p-4 bg-neutral-900 rounded-md mt-4 border-2 border-neutral-700'>
                <div className="relative h-32 p-8 mb-4 rounded-2xl flex flex-col items-center justify-center">
                  <Image
                    src={burnImage}
                    alt="Background"
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 rounded-2xl"
                  />
                  {/* Overlay with opacity */}
                  <div className="absolute top-0 rounded-2xl left-0 w-full h-full bg-[#ff0000] opacity-50 z-1" />
                  <div className="relative z-10 text-center">
                  <h1 className="text-2xl font-bold text-white">{formattedBurnt}</h1>
                    <h1 className="text-md text-white">TOTAL BURNT</h1>
                  </div>
                </div>
                <DataCard title="Total Supply" value={formattedSupply} bg="bg-white text-black" />
                <DataCard title="Total Locked" value={formattedLocked} bg="bg-blue-600" />
                <DataCard title="Circulatory Supply" value={formattedCSupply} bg="bg-green-600" />
              </div>
              </div>
              <BurnList tokenName={tokenName} />
            </section>


          </>
        )}
      </main>
    </div>
  );
}
