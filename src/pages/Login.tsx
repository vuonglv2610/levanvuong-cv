import { REGEX_EMAIL } from "configs/regexConfig";
import { setCookie } from "libs/getCookie";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, loginSuccess } from "services/api";

interface LoginResponse {
  data?: {
    result: {
      data: {
        userId: string;
      }
      token?: string;
    }
  };
  statusText?: string;
  message?: string;
  status?: number;
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

  // Xử lý response đăng nhập
  const checkResponse = (response: LoginResponse) => {
    console.log("Login response:", response);
    console.log("cccc", response.data?.result);


    // Kiểm tra response có tồn tại không
    if (!response) {
      toast.error("Đăng nhập thất bại: Không nhận được phản hồi từ máy chủ");
      return;
    }

    // Kiểm tra cấu trúc response
    if (response.data) {

      // Lưu token và userId vào cookie
      setCookie("accessToken", response.data.result.token);
      setCookie("userId", param);

      // Hiển thị thông báo thành công
      toast.success("Đăng nhập thành công!");

      // Chuyển hướng đến trang chủ
      navigate("/");
    } else {
      console.error("Invalid response structure:", response);
      toast.error("Đăng nhập thất bại: Cấu trúc phản hồi không hợp lệ");
    }
  };

  // Xử lý đăng nhập bằng Google
  useEffect(() => {
    if (param) {
      const loginGg = async () => {
        setIsLoading(true);
        try {
          const response: LoginResponse = await loginSuccess({ id: param });
          if (response) {
            checkResponse(response);
          }
        } catch (error: any) {
          console.error("Google login error:", error);
          toast.error(error.message || "Đăng nhập bằng Google thất bại");
        } finally {
          setIsLoading(false);
        }
      }
      loginGg();
    }
  }, [param, navigate]);

  // Xử lý đăng nhập bằng form
  const onSubmit: SubmitHandler<any> = async (data) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await login(data);
      if (response) {
        checkResponse(response);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || error.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-r from-[#1435c3] to-[#0a1f6b]">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md">
            <div className="mb-8">
              <svg className="h-12 w-auto" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="white" />
                <path d="M12 16L20 24L28 16" stroke="#1435c3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-4xl font-extrabold mb-6">GoShop</h2>
            <p className="text-xl mb-8">Welcome back! Sign in to access your account and continue shopping.</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Secure login</span>
              </div>
              <div className="flex items-center">
                <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Access your orders</span>
              </div>
              <div className="flex items-center">
                <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Personalized recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account yet?{" "}
              <Link to="/register" className="font-medium text-[#1435c3] hover:text-[#0f2a8e]">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border-t-4 border-[#1435c3]">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1435c3] focus:border-[#1435c3] sm:text-sm"
                    {...register("email", {
                      required: true,
                      pattern: REGEX_EMAIL,
                    })}
                  />
                  {errors.email?.type === "required" && (
                    <p className="mt-2 text-sm text-red-600">Email is required</p>
                  )}
                  {errors.email?.type === "pattern" && (
                    <p className="mt-2 text-sm text-red-600">
                      Requires entering correct email format
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1435c3] focus:border-[#1435c3] sm:text-sm"
                    {...register("password", { required: true })}
                  />
                  {errors.password?.type === "required" && (
                    <p className="mt-2 text-sm text-red-600">Password is required</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1435c3] hover:bg-[#0f2a8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1435c3] disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid-cols-3 gap-3">
                <button
                  type="button"
                  disabled={isLoading}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-70"
                  onClick={() => window.open(`${process.env.REACT_APP_PORT_BACKEND}/auth/google`, "_self")}
                >
                  <svg className="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;







