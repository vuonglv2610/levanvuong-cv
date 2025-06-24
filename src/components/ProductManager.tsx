import React from 'react';
import TableManage from './TableManage';

const ProductManager = () => {
  return (
    <TableManage 
      url="/products" 
      isShowFooter={true}
      title="Quản lý sản phẩm"
      addButtonText="Thêm sản phẩm mới"
      addPath="/admin/product/add"
      editPath="/admin/product/edit"
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
        }
      ]}
      filterOptions={{ showCategoryFilter: true }}
    />
  );
};

export default ProductManager;
