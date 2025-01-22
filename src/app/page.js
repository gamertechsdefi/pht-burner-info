'use client';

import BurnsDisplay from "@/components/BurnList";
import BurnList from "@/components/BurnList";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";



export default function Home() {

  const [tokenData, setTokenData] = useState(null);
  const [supply, setSupply] = useState(null);
  const [circulatorySupply, setCSupply] = useState(null);
  const [burnt, setBurnt] = useState(null);
  const [locked, setLocked] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/tokenPrice');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch token data');
        }

        setTokenData(data);
      } catch (error) {
        setError(error.message);
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Update every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    async function fetchSupply() {
      try {
        const response = await fetch('/api/tokenSupply');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch token supply');
        }

        setSupply(data.totalSupply);
      } catch (error) {
        setError(error.message);
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSupply();
  }, []);

  useEffect(() => {
    async function fetchCSupply() {
      try {
        const response = await fetch('/api/circulatorySupply');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch token circulatory supply');
        }

        setCSupply(data.circulatorySupply);
      } catch (error) {
        setError(error.message);
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCSupply();
  }, []);

  useEffect(() => {
    async function fetchBurnt() {
      try {
        const response = await fetch('/api/burnt');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch burnt supply');
        }

        setBurnt(data.burnt);
      } catch (error) {
        setError(error.message);
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBurnt();
  }, []);

  useEffect(() => {
    async function fetchLocked() {
      try {
        const response = await fetch('/api/lock');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch locked supply');
        }

        setLocked(data.lock);
      } catch (error) {
        setError(error.message);
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLocked();
  }, []);

  if (loading) {
    return (<div>Loading...</div>);
  }


  return (
    <div className="bg-gradient-to-b from-transparent to-orange-500">

      <Header />
      <main className="px-6 md:px-8 py-16">
        <section className="md:px-16">
          <div className="flex flex-col md:flex-row gap-2 md:gap-0 md:justify-between">
            <h1 className="flex flex-row gap-4 items-center">
              <span>PHT Price:</span>
              <span className="font-bold text-orange-400">${tokenData?.price.toFixed(6)}</span>
              <span className="bg-neutral-900 px-2 py-1 rounded-lg text-sm">{tokenData?.priceChange24h.toFixed(2)}%</span>
            </h1>

            <h1 className="flex flex-row gap-4">
              <span>MarketCap:</span>
              <span className="font-bold text-orange-400">${tokenData?.marketCap.toLocaleString()}</span>
            </h1>

            <h1 className="flex flex-row gap-4">
              <span>Volume:</span>
              <span className="font-bold text-orange-400"> ${tokenData?.volume24h.toLocaleString()}</span>
            </h1>


          </div>
        </section>

        <section className="mt-8 md:mt-16 flex flex-col md:flex-row md:gap-32 md:mx-16">
          <div>
            <div className="bg-gradient-to-b from-neutral-100 to-neutral-300 my-4 text-neutral-900 pl-8 pr-16 py-8 rounded-md flex flex-col gap-4 items-start">
              <h1 className="flex flex-col">
                <span className="font-bold text-xl text-[#FF0000]">{burnt}</span>
                <span>Total burnt from initial supply</span>
              </h1>

              <h1 className="flex flex-col">
                <span className="font-bold text-xl">10,000,000</span>
                <span>Max total supply</span>
              </h1>

              <h1 className="flex flex-col">
                <span className="font-bold text-xl">{supply}</span>
                <span>Total Supply</span>
              </h1>

              <h1 className="flex flex-col">
                <span className="font-bold text-xl">{circulatorySupply}</span>
                <span>Circulatory supply</span>
              </h1>

              <h1 className="flex flex-col">
                <span className="font-bold text-xl">{locked}</span>
                <span>Locked supply</span>
              </h1>
            </div>

            {/* <div className="bg-gradient-to-b from-neutral-100 to-neutral-300 text-neutral-900 pl-8 pr-16 py-8 rounded-md flex flex-col gap-2 items-start">
              <h1 className="flex flex-col">
                <span>1,500,000</span>
                <span>Total burnt from initial supply</span>
              </h1>

              <h1 className="flex flex-col">
                <span>1,500,000</span>
                <span>Max total supply</span>
              </h1>

              <h1 className="fflex flex-col">
                <span>1,500,000</span>
                <span>Total Supply</span>
              </h1>

              <h1 className="flex flex-col">
                <span>1,500,000</span>
                <span>Circulatory supply</span>
              </h1>

              <h1 className="flex flex-col">
                <span>1,500,000</span>
                <span>Locked supply</span>
              </h1>
            </div> */}

          </div>
          {/* <BurnList /> */}
          <BurnsDisplay />
        </section>

      </main>

    </div>
  );
}

function Header() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-4 z-50 mx-4 px-4 py-4 rounded-md bg-white text-neutral-900">
      <nav className="flex flex-row justify-between items-center">
        <h1 className="font-bold">PHT BURN</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-row gap-8">
          <Link href="#" className="hover:text-neutral-700 transition-colors duration-200">Home</Link>
          <Link href="#" className="hover:text-neutral-700 transition-colors duration-200">Burns</Link>
          <Link href="https://www.phoenixtoken.community" className="hover:text-neutral-700 transition-colors duration-200">Token</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center px-3 py-2 border border-neutral-300 rounded text-neutral-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-white border-t border-neutral-200 mt-2`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            href="#" 
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 hover:text-neutral-700 hover:bg-neutral-100" 
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link 
            href="#" 
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 hover:text-neutral-700 hover:bg-neutral-100" 
            onClick={toggleMenu}
          >
            Burns
          </Link>
          <Link 
            href="https://www.phoenixtoken.community" 
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 hover:text-neutral-700 hover:bg-neutral-100" 
            onClick={toggleMenu}
          >
            Phoenix Token
          </Link>
        </div>
      </div>
    </header>
  );
}