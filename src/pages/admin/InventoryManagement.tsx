import React from 'react';
import TableManage from '../../components/TableManage';

const InventoryManagement = () => {

  return (
    <TableManage 
      url="/serials" 
      isShowFooter={true}
      title="Quản lý serial sản phẩm"
      addButtonText="Thêm serial mới"
      addPath="/admin/inventory/add"
      editPath="/admin/inventory/edit"
      columns={[
        { 
          key: "productSku", 
          header: "Mã sản phẩm", 
          render: (item) => (
            <span className="font-medium text-gray-900">{item?.productSku || "Không có mã"}</span>
          )
        },
        { 
          key: "productName", 
          header: "Tên sản phẩm", 
          render: (item) => (
            <span className="font-medium text-gray-900">{item?.productName || "Không có tên"}</span>
          )
        },
        { 
          key: "serial", 
          header: "Mã serial", 
          render: (item) => (
            <span className="text-gray-600">{item?.serial || "Không có serial"}</span>
          )
        },
        { 
          key: "status", 
          header: "Trạng thái", 
          render: (item) => (
            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
              item?.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : item?.status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {item?.status === 'active' 
                ? 'Đang sử dụng' 
                : item?.status === 'pending' 
                ? 'Chờ xử lý' 
                : 'Chưa sử dụng'}
            </span>
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
      // filterOptions={{ 
      //   showCategoryFilter: true,
      //   customFilters: [
      //     {
      //       name: "status",
      //       label: "Trạng thái",
      //       type: "select",
      //       options: [
      //         { value: "unused", label: "Chưa sử dụng" },
      //         { value: "pending", label: "Chờ xử lý" },
      //         { value: "active", label: "Đang sử dụng" }
      //       ]
      //     }
      //   ]
      // }}
    />
  );
};

export default InventoryManagement;


