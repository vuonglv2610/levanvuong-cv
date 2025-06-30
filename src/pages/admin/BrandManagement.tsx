import React from 'react';
import TableManage from '../../components/TableManage';

const BrandManagement = () => {
  return (
    <TableManage
      url="/brands"
      isShowFooter={true}
      title="Quản lý thương hiệu"
      addButtonText="Thêm thương hiệu mới"
      addPath="/admin/brand/add"
      editPath="/admin/brand/edit"
      permissions={{
        create: "brand:create",
        update: "brand:update",
        delete: "brand:delete"
      }}
      columns={[
        { 
          key: "name", 
          header: "Tên thương hiệu", 
          render: (item) => (
            <span className="font-medium text-gray-900">{item?.name || "Không có tên"}</span>
          )
        },
        { 
          key: "description", 
          header: "Mô tả", 
          render: (item) => (
            <span>{item?.description || "Không có mô tả"}</span>
          )
        },
        { 
          key: "logo", 
          header: "Logo", 
          render: (item) => (
            item?.logo ? (
              <img 
                src={item.logo} 
                alt={item.name} 
                className="h-10 w-10 object-contain"
              />
            ) : (
              <span className="text-gray-400">Không có logo</span>
            )
          )
        },
        { 
          key: "createdAt", 
          header: "Ngày tạo", 
          render: (item) => (
            <span className="text-gray-600">
              {item?.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : "N/A"}
            </span>
          )
        }
      ]}
      filterOptions={{ 
        showCategoryFilter: false 
      }}
    />
  );
};

export default BrandManagement;