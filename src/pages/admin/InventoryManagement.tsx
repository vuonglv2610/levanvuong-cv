import React from 'react';
import { useNavigate } from 'react-router-dom';
import TableManage from '../../components/TableManage';

const InventoryManagement = () => {
  const navigate = useNavigate();

  return (
    <TableManage 
      url="" 
      // url="/inventory-receipts" 
      isShowFooter={true}
      title="Quản lý phiếu nhập kho"
      addButtonText="Tạo phiếu nhập kho mới"
      addPath="/admin/inventory/add"
      editPath="/admin/inventory/edit"
      columns={[
        { 
          key: "receiptCode", 
          header: "Mã phiếu nhập", 
          render: (item) => (
            <span className="font-medium text-gray-900">{item?.receiptCode || "Không có mã"}</span>
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
        },
        { 
          key: "supplier", 
          header: "Nhà cung cấp", 
          render: (item) => (
            <span className="text-gray-600">{item?.supplier || "Không có thông tin"}</span>
          )
        },
        { 
          key: "totalItems", 
          header: "Tổng số mặt hàng", 
          render: (item) => (
            <span className="text-gray-600">{item?.totalItems || 0}</span>
          )
        },
        { 
          key: "totalQuantity", 
          header: "Tổng số lượng", 
          render: (item) => (
            <span className="text-gray-600">{item?.totalQuantity || 0}</span>
          )
        },
        { 
          key: "status", 
          header: "Trạng thái", 
          render: (item) => (
            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
              item?.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : item?.status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {item?.status === 'completed' 
                ? 'Hoàn thành' 
                : item?.status === 'pending' 
                ? 'Đang xử lý' 
                : 'Nháp'}
            </span>
          )
        }
      ]}
      filterOptions={{ 
        customFilters: [
          {
            name: "dateRange",
            label: "Khoảng thời gian",
            type: "date",
            options: []
          },
          {
            name: "status",
            label: "Trạng thái",
            type: "select",
            options: [
              { value: "draft", label: "Nháp" },
              { value: "pending", label: "Đang xử lý" },
              { value: "completed", label: "Hoàn thành" }
            ]
          }
        ]
      }}
    />
  );
};

export default InventoryManagement;

