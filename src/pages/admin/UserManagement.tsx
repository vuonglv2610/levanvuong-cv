import React from "react";
import TableManage from "../../components/TableManage";

const UserManagement = () => {
  // Fetch roles for filter dropdown
  // const { data: rolesData } = useQuery({
  //   queryKey: ['/roles'],
  //   queryFn: () => get('/roles'),
  //   staleTime: 60000
  // });

  // const roles = rolesData?.data?.result?.data || [];
  // const roleOptions = roles.map((role: any) => ({
  //   value: role.role_key,
  //   label: role.role
  // }));

  return (
    <TableManage 
      url="/users" 
      isShowFooter={true}
      title="Quản lý người dùng"
      addButtonText="Thêm người dùng mới"
      addPath="/admin/user/add"
      editPath="/admin/user/edit"
      columns={[
        { 
          key: "name", 
          header: "Tên người dùng", 
          render: (item) => (
            <div className="flex items-center">
              <div className="h-10 w-10 flex-shrink-0">
                <img 
                  className="h-10 w-10 rounded-full object-cover" 
                  src={item?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                  alt={item?.name || "User"} 
                />
              </div>
              <div className="ml-4">
                <div className="font-medium text-gray-900">{item?.name || "Không có tên"}</div>
                <div className="text-gray-500 text-sm">{item?.email || "Không có email"}</div>
              </div>
            </div>
          )
        },
        { 
          key: "role", 
          header: "Vai trò", 
          render: (item) => {
            const roleColor = item?.roleKey === "admin" 
              ? "bg-purple-100 text-purple-800" 
              : "bg-green-100 text-green-800";
            
            return (
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColor}`}>
                {item?.roleName || "user"}
              </span>
            );
          }
        },
        { 
          key: "address", 
          header: "Địa chỉ", 
          render: (item) => (
            <span className="text-gray-600 truncate max-w-xs block">
              {item?.address || "Không có địa chỉ"}
            </span>
          )
        },
        { 
          key: "createdAt", 
          header: "Ngày tạo", 
          render: (item) => (
            <span className="text-gray-600">
              {item?.createdAt 
                ? new Date(item.createdAt).toLocaleDateString('vi-VN') 
                : "Không có dữ liệu"}
            </span>
          )
        },
        { 
          key: "status", 
          header: "Trạng thái", 
          render: (item) => {
            const statusColor = item?.status === "active" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800";
            
            return (
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                {item?.status === "active" ? "Hoạt động" : "Đã khóa"}
              </span>
            );
          }
        }
      ]}
      filterOptions={{ 
        showCategoryFilter: false
      }}
    />
  );
};

export default UserManagement;


