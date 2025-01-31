'use client';

import { useState } from "react";

export default function SearchBar({ onSearch }) {
    const [inputValue, setInputValue] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        onSearch(inputValue.trim()); // Calls fetchTokenData with the new token name
    };

    return (
        <form onSubmit={handleSearch} className="flex gap-2 justify-center">
            <input
                type="text"
                placeholder="Enter token name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-[70%] text-neutral-700 p-2 border border-gray-300 rounded-md"
            />
            <button type="submit" className="w-[30%] bg-orange-500 p-2 text-white rounded-md">
                Search
            </button>
        </form>
    );
}
