import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchFormProps {
  placeholder?: string;
  onSearch?: (searchTerm: string) => void;
  categories?: { value: string; label: string }[];
  showCategories?: boolean;
  className?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({
  placeholder = 'Search...',
  onSearch,
  categories = [],
  showCategories = false,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      // Default behavior - navigate to search page with query params
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      
      navigate(`/search?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex ${className}`}>
      {showCategories && categories.length > 0 && (
        <select
          className="bg-gray-50 border border-gray-300 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 h-full"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      )}
      
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg 
            className="w-4 h-4 text-gray-500" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 20 20"
          >
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          className={`block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 ${
            showCategories && categories.length > 0 ? 'rounded-r-lg' : 'rounded-lg'
          } bg-gray-50 focus:ring-blue-500 focus:border-blue-500`}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
        <button
          type="submit"
          className="absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-white"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;