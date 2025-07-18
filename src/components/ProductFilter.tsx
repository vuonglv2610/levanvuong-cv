import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { get } from 'services/api';

interface ProductFilterParams {
  name?: string;
  sku?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

interface ProductFilterProps {
  onFilterChange: (params: ProductFilterParams) => void;
  initialParams?: ProductFilterParams;
  className?: string;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  onFilterChange,
  initialParams = {},
  className = ''
}) => {
  const [filterParams, setFilterParams] = useState<ProductFilterParams>(initialParams);
  const [tempFilterParams, setTempFilterParams] = useState<ProductFilterParams>(initialParams);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Lấy danh sách categories
  const { data: categoriesData, isLoading: loadingCategories } = useQuery({
    queryKey: ['/categories'],
    queryFn: () => get('/categories'),
    staleTime: 60000
  });

  // Lấy danh sách brands
  const { data: brandsData, isLoading: loadingBrands } = useQuery({
    queryKey: ['/brands'],
    queryFn: () => get('/brands'),
    staleTime: 60000
  });

  const categories = categoriesData?.data?.result?.data || [];
  const brands = brandsData?.data?.result?.data || [];

  // Cập nhật temp filter params (không gọi onFilterChange ngay)
  const updateTempFilterParam = (key: keyof ProductFilterParams, value: any) => {
    let processedValue = value;
    
    // Xử lý đặc biệt cho categoryId và brandId (UUID strings)
    if (key === 'categoryId' || key === 'brandId') {
      processedValue = value === '' || value === undefined || value === null ? undefined : value;
    }
    // Xử lý cho minPrice và maxPrice
    else if (key === 'minPrice' || key === 'maxPrice') {
      if (value === '' || value === undefined || value === null) {
        processedValue = undefined;
      } else {
        const numValue = Number(value);
        processedValue = isNaN(numValue) ? undefined : numValue;
      }
    }
    // Xử lý cho các trường string
    else if (key === 'name' || key === 'sku' || key === 'sort_by' || key === 'sort_order') {
      processedValue = value === '' || value === undefined ? undefined : value;
    }
    
    setTempFilterParams(prev => ({
      ...prev,
      [key]: processedValue
    }));
  };

  // Apply filters khi submit
  const applyFilters = async () => {
    setIsApplying(true);
    
    try {
      const cleanParams = { ...tempFilterParams };
      
      // Loại bỏ các giá trị undefined
      Object.keys(cleanParams).forEach(key => {
        if (cleanParams[key as keyof ProductFilterParams] === undefined) {
          delete cleanParams[key as keyof ProductFilterParams];
        }
      });
      
      setFilterParams(cleanParams);
      await onFilterChange(cleanParams);
    } finally {
      setIsApplying(false);
    }
  };

  // Reset tất cả filters
  const resetFilters = async () => {
    setIsApplying(true);
    
    try {
      setTempFilterParams({});
      setFilterParams({});
      await onFilterChange({});
    } finally {
      setIsApplying(false);
    }
  };

  // Kiểm tra có filter nào đang active không
  const hasActiveFilters = Object.keys(filterParams).length > 0;

  const sortOptions = [
    { value: 'name', label: 'Tên A-Z' },
    { value: 'price', label: 'Giá' },
    { value: 'createdAt', label: 'Mới nhất' }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <span className="text-lg font-medium text-gray-900">Bộ lọc</span>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {Object.keys(filterParams).length}
              </span>
            )}
            <svg
              className={`w-5 h-5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Filter Content */}
      <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block p-4 space-y-6`}>
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm sản phẩm
          </label>
          <input
            type="text"
            value={tempFilterParams.name || ''}
            onChange={(e) => updateTempFilterParam('name', e.target.value)}
            placeholder="Nhập tên sản phẩm..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục
          </label>
          <select
            value={tempFilterParams.categoryId || ''}
            onChange={(e) => updateTempFilterParam('categoryId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loadingCategories}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thương hiệu
          </label>
          <select
            value={tempFilterParams.brandId || ''}
            onChange={(e) => updateTempFilterParam('brandId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loadingBrands}
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((brand: any) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Khoảng giá
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={tempFilterParams.minPrice || ''}
              onChange={(e) => updateTempFilterParam('minPrice', e.target.value)}
              placeholder="Từ"
              min="0"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              value={tempFilterParams.maxPrice || ''}
              onChange={(e) => updateTempFilterParam('maxPrice', e.target.value)}
              placeholder="Đến"
              min="0"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sắp xếp theo
          </label>
          <div className="grid grid-cols-1 gap-3">
            <select
              value={tempFilterParams.sort_by || ''}
              onChange={(e) => updateTempFilterParam('sort_by', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Mặc định</option>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {tempFilterParams.sort_by && (
              <select
                value={tempFilterParams.sort_order || 'ASC'}
                onChange={(e) => updateTempFilterParam('sort_order', e.target.value as 'ASC' | 'DESC')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ASC">Tăng dần</option>
                <option value="DESC">Giảm dần</option>
              </select>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={applyFilters}
            disabled={isApplying}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center ${
              isApplying
                ? 'bg-blue-400 cursor-not-allowed text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isApplying && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isApplying ? 'Đang áp dụng...' : 'Áp dụng bộ lọc'}
          </button>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              disabled={isApplying}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                isApplying
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Xóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;


