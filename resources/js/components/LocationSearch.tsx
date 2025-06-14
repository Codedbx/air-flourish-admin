// resources/js/Components/LocationSearch.tsx
import { MapPin } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

interface LocationSuggestion {
  city: string;
  country: string;
  display: string;
}

interface LocationSearchProps {
  onSelect: (value: string) => void;
  value?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ 
  onSelect, 
  value = ''
}) => {
  const [query, setQuery] = useState<string>(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (query.length > 2) {
      if (timerRef.current) clearTimeout(timerRef.current);
      
      timerRef.current = setTimeout(() => {
        fetchSuggestions();
      }, 300);
    } else {
      setSuggestions([]);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const fetchSuggestions = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Location search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (suggestion: LocationSuggestion) => {
    setQuery(suggestion.display);
    onSelect(suggestion.display);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        
        {loading && (
          <div className="absolute inset-y-0 right-8 flex items-center">
            <div className="w-4 h-4 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li 
              key={index}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              onClick={() => handleSelect(suggestion)}
            >
              <div className="font-medium text-gray-900">{suggestion.city}</div>
              <div className="text-sm text-gray-600">{suggestion.country}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;