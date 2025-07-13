import { REGEX_EMAIL } from "configs/regexConfig";
import useRouter from "hooks/useRouter";
import useToast from "hooks/useToast";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { register as registerUser } from "../services/api";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { navigate } = useRouter();
  const toast = useToast();

  const onSubmit = async (data: any) => {
    try {
      if (data) {
        const signup = await registerUser(data);
        if (signup) {
          toast.success("Đăng ký thành công!", "Bạn có thể đăng nhập ngay bây giờ");
          navigate("/login");
        }
      } else {
        toast.error("Lỗi đăng ký", "Vui lòng kiểm tra lại thông tin");
      }
    } catch (error) {
      toast.error("Lỗi đăng ký", "Có lỗi xảy ra trong quá trình đăng ký");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="min-h-screen flex">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="fixed top-0 left-0 w-1/2 h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-20"></div>

            {/* Animated Background Elements */}
            <div className="absolute top-16 right-20 w-40 h-40 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 left-16 w-28 h-28 bg-white bg-opacity-10 rounded-full animate-bounce"></div>
            <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-ping"></div>

            {/* Centered Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative z-10 text-white text-center p-12">
                <div className="max-w-md">
                  <div className="mb-8">
                    <div className="w-24 h-24 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                      </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">
                      Tham gia cùng chúng tôi! 🚀
                    </h1>
                    <p className="text-xl opacity-90 mb-8">
                      Tạo tài khoản để trải nghiệm mua sắm tuyệt vời và nhận những ưu đãi độc quyền
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: "🎁", text: "Ưu đãi thành viên độc quyền" },
                      { icon: "🚚", text: "Miễn phí vận chuyển" },
                      { icon: "📱", text: "Theo dõi đơn hàng dễ dàng" },
                      { icon: "🔔", text: "Thông báo sản phẩm mới" }
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

        {/* Right Side - Register Form */}
        {/* <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 lg:ml-[50%]"> */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Tạo tài khoản mới
              </h2>
              <p className="mt-2 text-gray-600">
                Đã có tài khoản?{" "}
                <Link to="/login" className="font-semibold text-green-600 hover:text-blue-600 transition-colors">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="p-8">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  {/* Username Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      👤 Tên người dùng
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Nhập tên người dùng"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                        {...register("name", { required: true })}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    {errors.name?.type === "required" && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Tên người dùng là bắt buộc
                      </p>
                    )}
                  </div>

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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
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
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
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

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      🔐 Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                        {...register("confirmPassword", { required: true })}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    {errors.confirmPassword?.type === "required" && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Xác nhận mật khẩu là bắt buộc
                      </p>
                    )}
                  </div>

                  {/* Address Field */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      🏠 Địa chỉ (tùy chọn)
                    </label>
                    <div className="relative">
                      <textarea
                        id="address"
                        rows={3}
                        placeholder="Nhập địa chỉ của bạn"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 resize-none"
                        {...register("address")}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>🚀 Tạo tài khoản</span>
                      </div>
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
                      <span className="px-4 bg-white text-gray-500 font-medium">Hoặc đăng ký với</span>
                    </div>
                  </div>
                </div>

                {/* Google Register */}
                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-300 group"
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
                Bằng việc đăng ký, bạn đồng ý với{" "}
                <button type="button" className="text-green-600 hover:text-blue-600 transition-colors underline">Điều khoản dịch vụ</button>
                {" "}và{" "}
                <button type="button" className="text-green-600 hover:text-blue-600 transition-colors underline">Chính sách bảo mật</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

