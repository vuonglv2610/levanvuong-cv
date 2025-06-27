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
      if (searchTerm) params.append('name', searchTerm);
      if (selectedCategory) params.append('categoryId', selectedCategory);

      navigate(`/search?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex shadow-lg rounded-xl overflow-hidden bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 ${className}`}>
      {showCategories && categories.length > 0 && (
        <select
          className="bg-white border-0 text-sm text-gray-700 font-medium px-4 py-3 pr-10 min-w-[140px] focus:outline-none focus:ring-0 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.7rem center',
            backgroundSize: '1em'
          }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      )}
      {showCategories && categories.length > 0 && (
        <div className="w-px bg-gray-200"></div>
      )}
      <div className="relative flex-1">
        <input
          type="text"
          className="w-full px-4 py-3 text-gray-900 text-sm bg-white border-0 focus:outline-none focus:ring-0 placeholder-gray-500"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 group"
        >
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
