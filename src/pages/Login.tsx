import { REGEX_EMAIL } from "configs/regexConfig";
import { useAuthProvider } from "contexts/AuthContext";
import useToast from "hooks/useToast";
import { setCookie } from "libs/getCookie";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login, loginSuccess } from "services/api";

interface LoginResponse {
  data?: any;
  statusText?: string;
  message?: string;
  status?: number;
  [key: string]: any;
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const param = new URLSearchParams(useLocation().search).get("code");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { refreshProfile } = useAuthProvider();
  const hasShownSuccessToast = useRef(false);

  // Hàm tìm giá trị trong object nested một cách an toàn
  const findValueInObject = useCallback((obj: any, paths: string[]): any => {
    for (const path of paths) {
      try {
        const value = path.split('.').reduce((o, k) => o?.[k], obj);
        if (value !== undefined && value !== null) {
          return value;
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  }, []);

  // Xử lý response đăng nhập
  const checkResponse = useCallback(async (response: LoginResponse) => {
    console.log("🔍 checkResponse called - hasShownSuccessToast:", hasShownSuccessToast.current);
    
    try {
      if (!response) {
        toast.error("Đăng nhập thất bại", "Không nhận được phản hồi từ máy chủ");
        return;
      }

      // Tìm token từ nhiều vị trí có thể
      const tokenPaths = [
        'data.result.token',
        'data.token',
        'data.accessToken',
        'data.access_token',
        'token',
        'accessToken',
        'access_token'
      ];

      const token = findValueInObject(response, tokenPaths);

      if (!token) {
        toast.error("Đăng nhập thất bại", "Không tìm thấy token xác thực");
        return;
      }

      setCookie("accessToken", token);

      // Tìm userId
      let userId = null;

      if (param) {
        // Đăng nhập Google
        userId = param;
      } else {
        // Đăng nhập form - tìm từ nhiều vị trí có thể
        const userIdPaths = [
          'data.result.data.customerId',
          'data.result.data.userId',
          'data.result.data.id',
          'data.result.customerId',
          'data.result.userId',
          'data.result.id',
          'data.customerId',
          'data.userId',
          'data.id',
          'data.user.id',
          'data.user.userId',
          'data.user.customerId',
          'userId',
          'customerId',
          'id'
        ];

        userId = findValueInObject(response, userIdPaths);
      }

      if (!userId) {
        toast.error("Đăng nhập thất bại", "Không tìm thấy thông tin người dùng");
        return;
      }

      setCookie("userId", userId);

      // Set flag để AuthContext biết đây là login mới
      sessionStorage.setItem('justLoggedIn', 'true');
      // Refresh profile
      await refreshProfile();

      // Chỉ hiển thị 1 toast duy nhất
      if (!hasShownSuccessToast.current) {
        toast.success("Thành công", "Đăng nhập thành công!");
        hasShownSuccessToast.current = true;
      } else {
        console.log("⚠️ Toast already shown, skipping");
      }

      navigate("/");

    } catch (error) {
      console.error("Lỗi trong quá trình đăng nhập:", error);
      toast.error("Lỗi", "Có lỗi xảy ra trong quá trình xử lý đăng nhập");
    }
  }, [navigate, refreshProfile, param, findValueInObject, toast]);

  // Xử lý đăng nhập bằng Google
  useEffect(() => {
    if (param) {
      const loginGg = async () => {
        setIsLoading(true);
        try {
          const response: LoginResponse = await loginSuccess({ id: param });

          if (response) {
            await checkResponse(response);
          } else {
            toast.error("Lỗi", "Không nhận được phản hồi từ server");
          }
        } catch (error: any) {
          console.error("Google login error:", error);
          toast.error("Lỗi", error.message || "Đăng nhập bằng Google thất bại");
        } finally {
          setIsLoading(false);
        }
      }
      loginGg();
    }
  }, [param, navigate, checkResponse, toast]);

  // Xử lý đăng nhập bằng form
  const onSubmit: SubmitHandler<any> = async (data) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await login(data);

      if (response) {
        await checkResponse(response);
      } else {
        toast.error("Lỗi", "Không nhận được phản hồi từ server");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Đăng nhập thất bại", error.response?.data?.message || error.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="min-h-screen flex">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="fixed top-0 left-0 w-1/2 h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-20"></div>

            {/* Animated Background Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-32 right-16 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-ping"></div>

            {/* Centered Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative z-10 text-white text-center p-12">
                <div className="max-w-md">
                  <div className="mb-8">
                    <div className="w-24 h-24 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                      </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">
                      Chào mừng trở lại! 👋
                    </h1>
                    <p className="text-xl opacity-90 mb-8">
                      Đăng nhập để khám phá thế giới công nghệ tuyệt vời cùng chúng tôi
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: "🛡️", text: "Bảo mật tuyệt đối" },
                      { icon: "🚚", text: "Giao hàng siêu tốc" },
                      { icon: "💎", text: "Sản phẩm chính hãng" },
                      { icon: "🎯", text: "Gợi ý cá nhân hóa" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-4 bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                        <span className="text-2xl">{feature.icon}</span>
                        <span className="font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        {/* <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 lg:ml-[50%]"> */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Đăng nhập tài khoản
              </h2>
              <p className="mt-2 text-gray-600">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="font-semibold text-blue-600 hover:text-purple-600 transition-colors">
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="p-8">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      📧 Địa chỉ email
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@company.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                        {...register("email", {
                          required: true,
                          pattern: REGEX_EMAIL,
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                    </div>
                    {errors.email?.type === "required" && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Email là bắt buộc
                      </p>
                    )}
                    {errors.email?.type === "pattern" && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Vui lòng nhập đúng định dạng email
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      🔒 Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                        {...register("password", { required: true })}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    {errors.password?.type === "required" && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Mật khẩu là bắt buộc
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:transform-none shadow-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-3">
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Đang đăng nhập...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>🚀 Đăng nhập</span>
                        </div>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">Hoặc đăng nhập với</span>
                    </div>
                  </div>
                </div>

                {/* Google Login */}
                <div className="mt-6">
                  <button
                    type="button"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-300 disabled:opacity-70 group"
                    onClick={() => window.open(`${process.env.REACT_APP_PORT_BACKEND}/auth/google`, "_self")}
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-medium text-gray-700">Tiếp tục với Google</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Bằng việc đăng nhập, bạn đồng ý với{" "}
                <button type="button" className="text-blue-600 hover:text-purple-600 transition-colors underline bg-transparent border-none cursor-pointer">Điều khoản dịch vụ</button>
                {" "}và{" "}
                <button type="button" className="text-blue-600 hover:text-purple-600 transition-colors underline bg-transparent border-none cursor-pointer">Chính sách bảo mật</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
