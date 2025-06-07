// resources/js/Components/LocationSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';

const LocationSearch = ({ onSelect, initialValue = '' }) => {
    const [query, setQuery] = useState(initialValue);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        // Clear timer on unmount
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (query.length > 2) {
            if (timerRef.current) clearTimeout(timerRef.current);
            
            timerRef.current = setTimeout(() => {
                fetchSuggestions();
            }, 300);
        } else {
            setSuggestions([]);
        }
    }, [query]);

    const fetchSuggestions = () => {
        setLoading(true);
        
        router.get('/api/locations/search', { q: query }, {
            preserveState: true,
            preserveScroll: true,
            only: ['suggestions'],
            onSuccess: (page) => {
                setSuggestions(page.props.suggestions || []);
                setLoading(false);
            },
            onError: () => {
                setSuggestions([]);
                setLoading(false);
            }
        });
    };

    const handleSelect = (location) => {
        const displayText = `${location.name}, ${location.country}`;
        setQuery(displayText);
        onSelect(displayText);
        setSuggestions([]);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a city..."
                className="w-full px-4 py-2 border rounded-lg"
            />
            
            {loading && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                    <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}

            {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((location, index) => (
                        <li 
                            key={index}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                            onClick={() => handleSelect(location)}
                        >
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-gray-600">
                                {location.country} {location.state ? `, ${location.state}` : ''}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationSearch;