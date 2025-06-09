import { useQuery } from '@tanstack/react-query';
import { useAuthProvider } from "contexts/AuthContext";
import React from 'react';
import { get, put } from "services/api";
import FormComponent from '../../components/Form';

const ChangePasswordPage = () => {
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
      name: "currentPassword",
      label: "Mật khẩu hiện tại",
      type: "password" as const, // Thay đổi từ password sang text
      required: true,
      placeholder: "Nhập mật khẩu hiện tại",
      validation: {
        required: "Vui lòng nhập mật khẩu hiện tại"
      }
    },
    {
      name: "newPassword",
      label: "Mật khẩu mới",
      type: "password" as const, // Thay đổi từ password sang text
      required: true,
      placeholder: "Nhập mật khẩu mới",
      validation: {
        required: "Vui lòng nhập mật khẩu mới",
        minLength: {
          value: 6,
          message: "Mật khẩu phải có ít nhất 6 ký tự"
        }
      }
    },
    {
      name: "confirmNewPassword",
      label: "Xác nhận mật khẩu mới",
      type: "password" as const, // Thay đổi từ password sang text
      required: true,
      placeholder: "Nhập lại mật khẩu mới",
      validation: {
        required: "Vui lòng xác nhận mật khẩu mới",
        validate: (value: string, formValues: any) => 
          value === formValues.newPassword || "Mật khẩu xác nhận không khớp"
      }
    }
  ];
  
  const handleSubmit = async (data: any) => {
    const dataUpdate: any = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmNewPassword
    };
    
    return await put(`/profile/change-password`, dataUpdate);
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
      title="Đổi mật khẩu"
      fields={formFields}
      initialValues={{
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      }}
      onSubmit={handleSubmit}
      backUrl="/admin/profile"
      submitButtonText="Cập nhật mật khẩu"
      invalidateQueryKey={`/users/${user.id}`}
      redirectAfterSubmit="/admin"
    />
  );
};

export default ChangePasswordPage;

