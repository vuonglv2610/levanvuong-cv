import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post } from "services/api";
import FormComponent from '../../components/Form';

const AddUserPage = () => {
  const navigate = useNavigate();
  
  // Fetch roles for dropdown
  const { data, isLoading: loadingRoles } = useQuery({ 
    queryKey: ['/roles'], 
    queryFn: () => get('/roles'),
    staleTime: 60000
  });
  
  const roles = data?.data?.result?.data || [];
  const roleOptions = roles.length > 0 
    ? roles.map((role: any) => ({
        value: role.id,
        label: role.role
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
      type: "text" as const, // Thay đổi từ email sang text vì FormField chỉ hỗ trợ 'text' | 'number' | 'textarea' | 'select' | 'file' | 'image'
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
      label: "Mật khẩu",
      type: "text" as const, // Thay đổi từ password sang text
      required: true,
      placeholder: "Nhập mật khẩu",
      validation: {
        required: "Vui lòng nhập mật khẩu",
        minLength: {
          value: 6,
          message: "Mật khẩu phải có ít nhất 6 ký tự"
        }
      }
    },
    {
      name: "confirmPassword",
      label: "Xác nhận mật khẩu",
      type: "text" as const,
      required: true,
      placeholder: "Nhập lại mật khẩu",
      validation: {
        required: "Vui lòng xác nhận mật khẩu",
        validate: (value: string, formValues: any) => {
          if (value !== formValues.password) {
            return "Mật khẩu xác nhận không khớp";
          }
          return true;
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
    }
    // {
    //   name: "status",
    //   label: "Trạng thái",
    //   type: "select" as const,
    //   options: [
    //     { value: "active", label: "Hoạt động" },
    //     { value: "inactive", label: "Khóa" }
    //   ],
    //   defaultValue: "active"
    // }
  ];
  
  const handleSubmit = async (data: any) => {
    const dataAddNew = {
      name: data.name,
      email: data.email,
      password: data.password,
      roleId: data.role,
      avatar: data.avatar || null,
      address: data.address || "",
      status: data.status || "active"
    };

    console.log('Data being sent to API:', dataAddNew);
    console.log('Avatar data:', data.avatar);
    return await post('/users', dataAddNew);
  };
  
  if (loadingRoles) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <FormComponent
      title="Thêm người dùng mới"
      fields={formFields}
      onSubmit={handleSubmit}
      backUrl="/admin/user"
      submitButtonText="Thêm người dùng"
      invalidateQueryKey="/users"
      redirectAfterSubmit="/admin/user"
    />
  );
};

export default AddUserPage;
