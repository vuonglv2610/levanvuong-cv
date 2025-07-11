import { useQuery } from '@tanstack/react-query';
import { useAuthProvider } from "contexts/AuthContext";
import React from 'react';
import { get, put } from "services/api";
import FormComponent from '../components/Form';

const ChangePasswordPage = () => {
  const { userInfo } = useAuthProvider();
  
  // Lấy thông tin user từ API response structure
  const profileData = userInfo?.result?.data;
  
  const { data: userData, isLoading } = useQuery({ 
    queryKey: [`/customers/${profileData?.id}`], 
    queryFn: () => get(`/customers/${profileData?.id}`),
    staleTime: 60000,
    enabled: !!profileData?.id && profileData?.accountType === 'customer'
  });
  
  const user = userData?.data?.result?.data || profileData || {};
  
  const formFields = [
    {
      name: "currentPassword",
      label: "Mật khẩu hiện tại",
      type: "password" as const,
      required: true,
      placeholder: "Nhập mật khẩu hiện tại",
      validation: {
        required: "Vui lòng nhập mật khẩu hiện tại"
      }
    },
    {
      name: "newPassword",
      label: "Mật khẩu mới",
      type: "password" as const,
      required: true,
      placeholder: "Nhập mật khẩu mới",
      validation: {
        required: "Vui lòng nhập mật khẩu mới",
        minLength: {
          value: 6,
          message: "Mật khẩu phải có ít nhất 6 ký tự"
        },
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          message: "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
        }
      }
    },
    {
      name: "confirmNewPassword",
      label: "Xác nhận mật khẩu mới",
      type: "password" as const,
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
    
    // Sử dụng API endpoint phù hợp cho customer
    if (profileData?.accountType === 'customer') {
      return await put(`/customers/change-password`, dataUpdate);
    } else {
      return await put(`/profile/change-password`, dataUpdate);
    }
  };
  
  // Kiểm tra nếu là tài khoản Google thì không cho đổi mật khẩu
  const hasGoogleId = profileData?.google_id || profileData?.googleId;

  if (hasGoogleId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Không thể đổi mật khẩu</h1>
              <p className="text-gray-600">
                Tài khoản của bạn được đăng nhập qua Google. Vui lòng sử dụng Google để quản lý mật khẩu.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="/profile"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại trang cá nhân
              </a>

              <div className="text-sm text-gray-500">
                <p>Để thay đổi mật khẩu Google, vui lòng truy cập:</p>
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Google Account Security
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đổi mật khẩu</h1>
          <p className="text-gray-600">Cập nhật mật khẩu để bảo mật tài khoản của bạn</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <FormComponent
              title=""
              fields={formFields}
              initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: ""
              }}
              onSubmit={handleSubmit}
              backUrl="/profile"
              submitButtonText="Cập nhật mật khẩu"
              invalidateQueryKey={`/customers/${user.id}`}
              redirectAfterSubmit="/profile"
            />
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Mẹo bảo mật</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Sử dụng mật khẩu mạnh với ít nhất 8 ký tự
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Không sử dụng thông tin cá nhân dễ đoán
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Thay đổi mật khẩu định kỳ để tăng cường bảo mật
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
