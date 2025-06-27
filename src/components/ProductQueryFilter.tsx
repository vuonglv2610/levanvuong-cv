import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { get } from 'services/api';

interface ProductQueryParams {
  name?: string;
  sku?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

interface ProductQueryFilterProps {
  onQueryChange: (params: ProductQueryParams) => void;
  initialParams?: ProductQueryParams;
}

const ProductQueryFilter: React.FC<ProductQueryFilterProps> = ({
  onQueryChange,
  initialParams = {}
}) => {
  const [queryParams, setQueryParams] = useState<ProductQueryParams>(initialParams);
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Cập nhật query params
  const updateQueryParam = (key: keyof ProductQueryParams, value: any) => {
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

    const newParams = {
      ...queryParams,
      [key]: processedValue
    };

    // Loại bỏ các giá trị undefined
    Object.keys(newParams).forEach(key => {
      if (newParams[key as keyof ProductQueryParams] === undefined) {
        delete newParams[key as keyof ProductQueryParams];
      }
    });

    setQueryParams(newParams);
    onQueryChange(newParams);
  };

  // Reset tất cả filters
  const resetFilters = () => {
    setQueryParams({});
    onQueryChange({});
  };

  // Kiểm tra có filter nào đang active không
  const hasActiveFilters = Object.keys(queryParams).length > 0;

  const sortOptions = [
    { value: 'name', label: 'Tên sản phẩm' },
    { value: 'price', label: 'Giá' },
    { value: 'sku', label: 'Mã SKU' },
    { value: 'createdAt', label: 'Ngày tạo' },
    { value: 'updatedAt', label: 'Ngày cập nhật' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-medium text-gray-900">Bộ lọc tìm kiếm</h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {Object.keys(queryParams).length} bộ lọc
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Xóa tất cả
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <span>{isExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Row 1: Tìm kiếm cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm
              </label>
              <input
                type="text"
                value={queryParams.name || ''}
                onChange={(e) => updateQueryParam('name', e.target.value)}
                placeholder="Nhập tên sản phẩm..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã SKU
              </label>
              <input
                type="text"
                value={queryParams.sku || ''}
                onChange={(e) => updateQueryParam('sku', e.target.value)}
                placeholder="Nhập mã SKU..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 2: Category và Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                value={queryParams.categoryId || ''}
                onChange={(e) => updateQueryParam('categoryId', e.target.value)}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thương hiệu
              </label>
              <select
                value={queryParams.brandId || ''}
                onChange={(e) => updateQueryParam('brandId', e.target.value)}
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
          </div>

          {/* Row 3: Khoảng giá */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá tối thiểu (₫)
              </label>
              <input
                type="number"
                value={queryParams.minPrice || ''}
                onChange={(e) => updateQueryParam('minPrice', e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá tối đa (₫)
              </label>
              <input
                type="number"
                value={queryParams.maxPrice || ''}
                onChange={(e) => updateQueryParam('maxPrice', e.target.value)}
                placeholder="Không giới hạn"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 4: Sắp xếp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sắp xếp theo
              </label>
              <select
                value={queryParams.sort_by || ''}
                onChange={(e) => updateQueryParam('sort_by', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Mặc định</option>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thứ tự
              </label>
              <select
                value={queryParams.sort_order || 'ASC'}
                onChange={(e) => updateQueryParam('sort_order', e.target.value as 'ASC' | 'DESC')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!queryParams.sort_by}
              >
                <option value="ASC">Tăng dần</option>
                <option value="DESC">Giảm dần</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductQueryFilter;
