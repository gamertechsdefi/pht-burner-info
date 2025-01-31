'use client';

import { useState, useEffect } from 'react';

function BurnsDisplay({ tokenName }) {
    const [burns, setBurns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBurns = async () => {
            try {
                const response = await fetch(`/api/burns?tokenName=${tokenName}`);
                const data = await response.json();
                setBurns(data.burns);
            } catch (error) {
                console.error('Failed to fetch burns:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (tokenName) {
            fetchBurns();
        }
    }, [tokenName]); // Dependency on tokenName to refetch burns when it changes

    const truncateAddress = (address) => {
        return `${address.slice(0, 15)}...${address.slice(-8)}`;
    };

    if (isLoading) return <div>Loading burns...</div>;

    return (
        <div className="md:py-0 py-8">
            <h2 className="text-2xl font-bold mb-2">Recent Burns</h2>
            <div className="hidden md:block h-96 overflow-y-auto rounded">
                <ul>
                    <li className="flex justify-between py-2 font-semibold">
                        <span className="text-sm">Time</span>
                        <span className="text-sm">Address</span>
                        <span className="text-sm text-right pr-2">Amount</span>
                    </li>

                    {burns.map((burn, index) => (
                        <li key={index} className="flex justify-between gap-24 py-2">
                            <span className="text-sm">{burn.time}</span>
                            <span className="text-sm">{truncateAddress(burn.from)}</span>
                            <span className="text-sm pr-2 text-right">{burn.value.toFixed(2)} {tokenName}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="md:hidden burns-list-container h-96 overflow-y-auto rounded w-full md:w-[200%]">
                <ul>
                    {burns.map((burn, index) => (
                        <li key={index} className="flex flex-col py-2">
                            <div className="flex justify-between">
                                <span className="text-sm">Time:</span>
                                <span className="text-sm">{burn.time}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Address:</span>
                                <span className="text-sm">{truncateAddress(burn.from)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Amount:</span>
                                <span className="text-sm text-right">{burn.value.toFixed(2)} {tokenName}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default BurnsDisplay;
