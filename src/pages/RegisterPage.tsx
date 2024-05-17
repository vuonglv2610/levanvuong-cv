import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { register as registerUser } from "../services/api";
import { toast } from "react-toastify";
import { IMG_DEFAULT } from "configs/common";
import { REGEX_EMAIL } from "configs/regexConfig";

const RegisterPage = () => {
  const [base64, setBase64] = useState<any>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const { navigate } = useRouter();

  const handleShowToast = async (response :any) => {
    try {
      if (response) {
        const signup = await registerUser(response);
        if (signup) {
          toast.success(response.statusText);
          // navigate("/login");
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(response.message);
    }
  };

  const onSubmit = (data :any) => {
    if (base64) {
      const response: any = { ...data, avt: base64 };
      handleShowToast(response);
    } else {
      const response: any = data;
      handleShowToast(response);
    }
  };

  const convertToBase64 = (value :any) => {
    const file = value.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        setBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <h2>Register Form</h2>
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 text-left">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your Name
          </label>
          <input
            type="name"
            id="name"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="peter"
            {...register("fullname", { required: true })}
          />
          {errors.fullname?.type === "required" && (
            <div className="text-red-600 mt-2">Fullname is required</div>
          )}
        </div>
        <div className="mb-5 text-left">
          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="user_avatar"
            >
              Upload file
            </label>
            <input
              className="mb-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="user_avatar_help"
              id="user_avatar"
              type="file"
              onChange={(e) => convertToBase64(e)}
            />
            <img
              src={base64 || IMG_DEFAULT}
              width={200}
              height={200}
              alt="img"
            />
          </div>
        </div>
        <div className="mb-5 text-left">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="name@flowbite.com"
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
        <div className="mb-5 text-left">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", { required: true })}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          />
          {errors.password?.type === "required" && (
            <div className="text-red-600 mt-2">Password is required</div>
          )}
        </div>
        <div className="mb-5 text-left">
          <label
            htmlFor="default-radio-2"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Role
          </label>
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <input
                {...register("role")}
                id="default-radio-1"
                type="radio"
                name="role"
                value={"admin"}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-radio-1"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Admin
              </label>
            </div>
            <div className="flex items-center">
              <input
                {...register("role")}
                defaultChecked
                id="default-radio-2"
                type="radio"
                name="role"
                value={"standard"}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-radio-2"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Standard
              </label>
            </div>
          </div>
        </div>
        <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
            />
          </div>
          <label
            htmlFor="terms"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            I agree with the
            <Link
              to="#"
              className="text-blue-600 hover:underline dark:text-blue-500"
            >
              terms and conditions
            </Link>
          </label>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Register new account
        </button>
      </form>
    </>
  );
};

export default RegisterPage;
