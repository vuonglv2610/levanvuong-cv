import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductList from '../layouts/ProductList';

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kết quả tìm kiếm
          </h1>
          {searchParams.get('name') && (
            <p className="text-gray-600">
              Tìm kiếm cho: "<span className="font-medium">{searchParams.get('name')}</span>"
            </p>
          )}
        </div>
        
        {/* Sử dụng ProductList với initial params từ URL */}
        <ProductList />
      </div>
    </div>
  );
};

export default SearchPage;
