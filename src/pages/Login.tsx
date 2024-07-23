import { REGEX_EMAIL } from "configs/regexConfig";
import { setCookie } from "libs/getCookie";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { login, loginSuccess } from "services/api";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const param = new URLSearchParams(useLocation().search).get("code");

  // todo: create type enum for response login
  const checkResponse = (response: any) => {
    if (response.data) {
      setCookie("accessToken", response.data.accessToken);
      setCookie("userId", response.data.result.data.userId);
      toast.success(response.statusText);
      window.location.href = "/";
    } else {
      toast.error(response.message);
    }
  }

  useEffect(() => {
    if (param) {
      const loginGg = async () => {
        const response: any = await loginSuccess({ id: param });
        response && checkResponse(response)
      }
      loginGg();
    }
  }, [param]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      const response: any = await login(data);
      response && checkResponse(response)
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              action="#"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="text-left">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  {...register("email", {
                    required: true,
                    pattern: REGEX_EMAIL,
                  })}
                />
                {errors.email?.type === "required" && (
                  <div className="text-red-600 mt-2">Email is required</div>
                )}
                {errors.email?.type === "pattern" && (
                  <div className="text-red-600 mt-2">
                    Requires entering correct email format
                  </div>
                )}
              </div>
              <div className="text-left">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  autoComplete="off"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register("password", { required: true })}
                />
                {errors.password?.type === "required" && (
                  <div className="text-red-600 mt-2">Password is required</div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <Link
                  to="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-[#f05d23] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
                <div className="my-4">
                  ------------------ or ------------------
                </div>
                <button
                  onClick={() =>
                    window.open(
                      `${process.env.REACT_APP_PORT_BACKEND}/auth/google`,
                      "_self"
                    )
                  }
                  className="group h-12 px-3 border-2 border-gray-300 rounded-full transition duration-300 
 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100 w-full mb-4"
                >
                  <div className="relative flex items-center space-x-6 justify-center">
                    <img
                      src="https://tailus.io/sources/blocks/social/preview/images/google.svg"
                      className="absolute left-0 w-5"
                      alt="google logo"
                    />
                    <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
                      Google
                    </span>
                  </div>
                </button>
                <button
                  className="group h-12 px-3 border-2 border-gray-300 rounded-full transition duration-300 
                               hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100 w-full"
                >
                  <div className="relative flex items-center space-x-6 justify-center">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg"
                      className="absolute left-0 w-5"
                      alt="Facebook logo"
                    />
                    <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
                      Facebook
                    </span>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
