import { useQuery } from '@tanstack/react-query';
import { useAuthProvider } from "contexts/AuthContext";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { get, put } from "services/api";
import FormComponent from '../../components/Form';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuthProvider();
  
  const { data: userData, isLoading } = useQuery({ 
    queryKey: [`/users/${userInfo?.id}`], 
    queryFn: () => get(`/users/${userInfo?.id}`),
    staleTime: 60000,
    enabled: !!userInfo?.id
  });
  
  const user = userData?.data?.result?.data || userInfo || {};
  
  const formFields = [
    {
      name: "name",
      label: "Tên người dùng",
      type: "text" as const,
      required: false,
      placeholder: "Nhập tên người dùng",
      validation: {
        required: "Vui lòng nhập tên người dùng"
      }
    },
    {
      name: "email",
      label: "Email",
      type: "text" as const,
      required: false,
      placeholder: "Nhập email",
      validation: {
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Email không hợp lệ"
        }
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
  ];
  
  const handleSubmit = async (data: any) => {
    const dataUpdate: any = {
      name: data.name,
      email: data.email,
      avatar: data.avatar || user.avatar,
      address: data.address
    };
    
    return await put(`/profile`, dataUpdate);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <FormComponent
      title="Thông tin cá nhân"
      fields={formFields}
      initialValues={{
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        address: user.address || ""
      }}
      onSubmit={handleSubmit}
      backUrl="/admin"
      submitButtonText="Cập nhật thông tin"
      invalidateQueryKey={`/users/${user.id}`}
      redirectAfterSubmit="/admin"
    />
  );
};

export default ProfilePage;

