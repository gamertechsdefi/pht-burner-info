'use client';

import { useState, useEffect } from 'react';

function BurnsDisplay() {
    const [burns, setBurns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBurns = async () => {
            try {
                const response = await fetch('/api/burns');
                const data = await response.json();
                setBurns(data.burns);
            } catch (error) {
                console.error('Failed to fetch burns:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBurns();
    }, []);

    // Helper function to truncate wallet address
    const truncateAddress = (address) => {
        return `${address.slice(0, 15)}...${address.slice(-8)}`;
    };

    if (isLoading) return <div>Loading burns...</div>;

    return (
        <div className='py-8 md:py-0'>
            <h2 className="text-lg font-bold mb-2">Recent Burns</h2>
            <div className="burns-list-container h-96 overflow-y-auto border border-gray-300 rounded w-full md:w-[200%]">
                <ul className="divide-y divide-gray-200">
                    {burns.map((burn, index) => (
                        <li key={index} className="flex justify-between py-2 px-4">
                            <span className="text-sm">
                                {truncateAddress(burn.from)}
                            </span>
                            <span className="text-sm">
                                {burn.value.toFixed(2)} PHT
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default BurnsDisplay;