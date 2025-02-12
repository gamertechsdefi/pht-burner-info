'use client';

import { useState } from "react";

const tokenList = [
    "Phoenix Token (PHT)",
    "WikiCat Coin (WKC)",
    "Defi Tiger Token (DTG)",
    "Water Rabbit Token (WAR)",
    "Yukan Token (YUKAN)",
    "BTC Dragon Token (BTCDRAGON)",
    "Nene (NENE)",
    "OciCat Token (OciCat)",
    // Add more tokens as needed
];

export default function SearchBar({ onSearch }) {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Extract the symbol from the input value
        const matchedToken = tokenList.find(token => {
            const bracketTextMatch = token.match(/\((.*?)\)/);
            return bracketTextMatch && bracketTextMatch[1].toUpperCase() === inputValue.trim().toUpperCase();
        });

        if (matchedToken) {
            const symbol = matchedToken.match(/\((.*?)\)/)[1]; // Get only the symbol
            onSearch(symbol); // Call onSearch with the symbol only
        }

        // Clear input and suggestions after search
        setInputValue(""); 
        setSuggestions([]); 
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // Filter suggestions based only on the bracketed text
        if (value.trim()) {
            const filteredSuggestions = tokenList.filter(token => {
                const bracketTextMatch = token.match(/\((.*?)\)/);
                return bracketTextMatch && bracketTextMatch[1].toUpperCase().includes(value.toUpperCase());
            });
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        // Extract the symbol from the clicked suggestion
        const symbolMatch = suggestion.match(/\((.*?)\)/);
        if (symbolMatch) {
            const symbol = symbolMatch[1]; // Get only the symbol
            setInputValue(symbol); // Set input value to the selected symbol
            onSearch(symbol); // Call onSearch with the selected symbol
        }
        
        setSuggestions([]); // Clear suggestions after selection
    };

    return (
        <div className="relative">
            <form onSubmit={handleSearch} className="flex gap-2 justify-center">
                <input
                    type="text"
                    placeholder="Enter token symbol"
                    value={inputValue}
                    onChange={handleChange}
                    className="w-[70%] text-neutral-700 p-2 border border-gray-300 rounded-md"
                />
                <button type="submit" className="w-[30%] bg-orange-500 p-2 text-white rounded-md">
                    Search
                </button>
            </form>
            {suggestions.length > 0 && (
                <ul className="absolute z-10 w-[70%] bg-white text-neutral-900 border border-gray-300 rounded-md mt-1">
                    {suggestions.map((suggestion, index) => (
                        <li 
                            key={index} 
                            onClick={() => handleSuggestionClick(suggestion)} 
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
