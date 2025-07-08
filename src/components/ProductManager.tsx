import React, { useMemo, useState } from 'react';
import ProductQueryFilter from './ProductQueryFilter';
import TableManage from './TableManage';

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

const ProductManager = () => {
  const [queryParams, setQueryParams] = useState<ProductQueryParams>({});

  // Tạo URL với query parameters
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const finalUrl = queryString ? `/products?${queryString}` : '/products';
    console.log('API URL:', finalUrl);
    return finalUrl;
  }, [queryParams]);

  const handleQueryChange = (newParams: ProductQueryParams) => {
    console.log('Query params changed:', newParams);
    setQueryParams(newParams);
  };

  return (
    <div>
      <ProductQueryFilter
        onQueryChange={handleQueryChange}
        initialParams={queryParams}
      />
      <TableManage
        url={apiUrl}
        isShowFooter={true}
        title="Quản lý sản phẩm"
        addButtonText="Thêm sản phẩm mới"
        addPath="/admin/product/add"
        editPath="/admin/product/edit"
        permissions={{
          create: "product:create",
          update: "product:update",
          delete: "product:delete"
        }}
      columns={[
        { 
          key: "name", 
          header: "Tên sản phẩm", 
          render: (item: any) => (
            <span className="font-medium text-gray-900">{item?.name || "Không có tên"}</span>
          )
        },
        { 
          key: "img", 
          header: "Hình ảnh", 
          render: (item: any) => (
            <div className="w-16 h-16 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
              <img
                src={item?.img || "https://via.placeholder.com/64x64?text=No+Image"}
                alt={item?.name || "Product image"}
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=No+Image';
                }}
              />
            </div>
          )
        },
        { 
          key: "sku", 
          header: "Mã sản phẩm", 
          render: (item: any) => (
            <span className="text-sm text-gray-600">{item?.sku || "N/A"}</span>
          )
        },
        { 
          key: "price", 
          header: "Giá", 
          render: (item: any) => (
            <span className="font-medium text-green-600">
              {item?.price ? `${Number(item.price).toLocaleString('vi-VN')}₫` : "0₫"}
            </span>
          )
        },
        { 
          key: "categoryName", 
          header: "Danh mục", 
          render: (item: any) => (
            <span className="text-sm text-gray-600">{item?.categoryName || "Chưa phân loại"}</span>
          )
        },
        { 
          key: "brandName", 
          header: "Thương hiệu", 
          render: (item: any) => (
            <span className="text-sm text-gray-600">{item?.brandName || "Chưa có thương hiệu"}</span>
          )
        },
        {
          key: "quantity",
          header: "Số lượng tồn kho",
          render: (item: any) => {
            const quantity = item?.quantity || 0;
            return (
              <span className={`text-sm font-medium ${
                quantity === 0 ? 'text-red-500' :
                quantity < 10 ? 'text-orange-500' :
                'text-green-600'
              }`}>
                {quantity === 0 ? 'Hết hàng' : quantity}
              </span>
            );
          }
        }
      ]}
      filterOptions={{ showCategoryFilter: false, showSearch: false }}
    />
    </div>
  );
};

export default ProductManager;
