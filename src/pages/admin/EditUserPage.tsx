import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { get, put } from "services/api";
import FormComponent from '../../components/Form';

const EditUserPage = () => {
  const params = useParams();
  // const navigate = useNavigate();
  
  const { data: userData, isLoading: loadingUser } = useQuery({ 
    queryKey: [`/users/${params?.id}`], 
    queryFn: () => get(`/users/${params?.id}`),
    staleTime: 60000
  });
  
  const { data: rolesData, isLoading: loadingRoles } = useQuery({ 
    queryKey: ['/roles'], 
    queryFn: () => get('/roles'),
    staleTime: 60000
  });
  
  const user = userData?.data?.result?.data || {};
  const roles = rolesData?.data?.result?.data || [];
  
  const roleOptions = roles.length > 0 
    ? roles.map((role: any) => ({
        value: role.id,
        label: role.name
      }))
    : [
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" }
      ];
  
  const formFields = [
    {
      name: "name",
      label: "Tên người dùng",
      type: "text" as const,
      required: true,
      placeholder: "Nhập tên người dùng",
      validation: {
        required: "Vui lòng nhập tên người dùng"
      }
    },
    {
      name: "email",
      label: "Email",
      type: "text" as const, // Thay đổi từ email sang text
      required: true,
      placeholder: "Nhập email",
      validation: {
        required: "Vui lòng nhập email",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Email không hợp lệ"
        }
      }
    },
    {
      name: "password",
      label: "Mật khẩu mới (để trống nếu không thay đổi)",
      type: "text" as const, // Thay đổi từ password sang text
      required: false,
      placeholder: "Nhập mật khẩu mới",
      validation: {
        minLength: {
          value: 6,
          message: "Mật khẩu phải có ít nhất 6 ký tự"
        }
      }
    },
    {
      name: "role",
      label: "Vai trò",
      type: "select" as const,
      required: true,
      options: roleOptions,
      validation: {
        required: "Vui lòng chọn vai trò"
      }
    },
    {
      name: "avatar",
      label: "Ảnh đại diện",
      type: "image" as const
    },
    {
      name: "address",
      label: "Địa chỉ",
      type: "textarea" as const,
      rows: 3,
      placeholder: "Nhập địa chỉ"
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "select" as const,
      options: [
        { value: "active", label: "Hoạt động" },
        { value: "inactive", label: "Khóa" }
      ]
    }
  ];
  
  const handleSubmit = async (data: any) => {
    const dataUpdate: any = {
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar || user.avatar,
      address: data.address,
      status: data.status
    };
    
    // Chỉ cập nhật mật khẩu nếu người dùng nhập mật khẩu mới
    if (data.password) {
      dataUpdate.password = data.password;
    }
    
    return await put(`/users/edit/${params?.id}`, dataUpdate);
  };
  
  if (loadingUser || loadingRoles) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <FormComponent
      title="Chỉnh sửa người dùng"
      fields={formFields}
      initialValues={{
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "",
        avatar: user.avatar || "",
        address: user.address || "",
        status: user.status || "active"
      }}
      onSubmit={handleSubmit}
      backUrl="/admin/user"
      submitButtonText="Cập nhật người dùng"
      invalidateQueryKey="/users"
      redirectAfterSubmit="/admin/user"
    />
  );
};

export default EditUserPage;
