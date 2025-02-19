'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import DataCard from '@/components/DataCard';
import BurnList from '@/components/BurnList';

import burnImage from "/public/assets/burn-im2.jpg";

const DEFAULT_TOKEN = "PHT";

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

    // Special handling for very small numbers (like token prices)
    if (Math.abs(num) < 0.000001) {
      return num.toExponential(2);
    }

    // For small numbers (less than 1) use more decimal places
    if (Math.abs(num) < 1) {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 8,
        maximumFractionDigits: 11,
        useGrouping: true
      });
    }

    // For regular numbers use standard formatting
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      notation: num > 1000000 ? 'compact' : 'standard'
    }).format(num);
  } catch (error) {
    console.error('Error in formatDisplayValue:', error);
    return defaultValue;
  }
};

const formatLargeNumber = (number) => {
  try {
    if (number === null || number === undefined || number === '') {
      return '0.00';
    }

    // Convert string to number if needed
    const num = typeof number === 'string' ? parseFloat(number) : number;
    
    if (isNaN(num)) return '0.00';
    if (num === 0) return '0.00';

    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const suffixNum = Math.floor(Math.log10(Math.abs(num)) / 3);
    const shortValue = num / Math.pow(1000, suffixNum);

    if (suffixNum >= suffixes.length) {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    const formattedNumber = shortValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `${formattedNumber}${suffixes[suffixNum]}`;
  } catch (error) {
    console.error('Error formatting large number:', error);
    return '0.00';
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to fetch data with retries
async function fetchWithRetry(url, options = {}, retries = 3, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed: ${error.message}`);
      if (i < retries - 1) {
        await delay(delayMs);
      } else {
        throw error;
      }
    }
  }
}

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
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  useEffect(() => {
    const fetchTokenData = async () => {
      setLoading(true);
      setError(null);
      
      // Reset all states to loading state
      setTokenData(null);
      setFormattedSupply("Loading...");
      setFormattedHolders("Loading...");
      setFormattedBurnt("Loading...");
      setFormattedCSupply("Loading...");
      setFormattedLocked("Loading...");
      setBurned24h("Loading...");

      try {
        // Use the internal API route with a relative path and retry logic
        const data = await fetchWithRetry(`/api/batchData?tokenName=${tokenName}`);

        // Destructure the response data
        const {
          tokenData,
          supply,
          holders,
          burnt,
          circulatory,
          locked,
          burned24h
        } = data;

        setTokenData(tokenData);
        setFormattedSupply(addCommas(supply.totalSupply || 0));
        setFormattedHolders(addCommas(holders.holdersCount || 0));
        setFormattedBurnt(addCommas(burnt.burnt || 0));
        setFormattedCSupply(addCommas(circulatory.totalCSupply || 0));
        setFormattedLocked(addCommas(locked.lockAmount || 0));
        setBurned24h(burned24h.totalBurnedToday || "0.00");
        setLastRefresh(Date.now());

      } catch (error) {
        console.error("Fetch Error:", error);
        setError("Failed to load data. Please try again.");
        // Reset all states to error state
        setTokenData(null);
        setBurned24h("0.00");
        setFormattedSupply("0");
        setFormattedHolders("0");
        setFormattedBurnt("0");
        setFormattedCSupply("0");
        setFormattedLocked("0");
      }

      setLoading(false);
    };

    fetchTokenData();
  }, [tokenName]); 


  return (
    <div className="bg-gradient-to-b from-transparent to-orange-500 min-h-screen">
      <Header />
      <main className="px-6 md:px-8 py-16">
        <SearchBar onSearch={setTokenName} />

        {error && (
          <div className="text-red-500 text-center mt-4 p-4 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 animate-pulse">
            <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-8">
              <div className="h-12 bg-gray-300 rounded w-full md:w-1/4"></div>
              <div className="h-12 bg-gray-300 rounded w-full md:w-1/4"></div>
              <div className="h-12 bg-gray-300 rounded w-full md:w-1/4"></div>
              <div className="h-12 bg-gray-300 rounded w-full md:w-1/4"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <div className="h-24 bg-gray-300 rounded mb-4"></div>
                <div className="h-96 bg-gray-300 rounded"></div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="h-[32rem] bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          tokenData && (
            <>
              <section className="mt-4 flex flex-col md:items-center md:flex-row md:justify-between">
                <div className='flex flex-row items-center gap-2'>
                  <h1>{tokenName?.toUpperCase()} Price:</h1>
                  <h1 className='flex flex-row items-center gap-2'>
                    <span className='font-medium'>
                      ${tokenData?.price.toFixed(11) || "0.00"}
                    </span>
                    <span className='bg-neutral-700 text-white px-4 py-2 rounded-md'>
                      {tokenData?.priceChange24h || "0.00"}%
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
                      {burned24h === "Loading..." ? (
                        <span className="inline-block animate-pulse">Loading...</span>
                      ) : burned24h === "0.00" ? (
                        "No burns today"
                      ) : (
                        burned24h
                      )}
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                      Last updated: {new Date(lastRefresh).toLocaleTimeString()}
                    </p>
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
          )
        )}
      </main>
    </div>
  );
}