import { getCookie } from "../libs/getCookie";
import instance from "./instance";

export const get = async (url: string, options = {}) => {
  const response = await instance.get(url, options);
  return response;
};

export const post = async (url: string, data: any, options = {}) => {
  const response = await instance.post(url, data, options);
  return response;
};

export const put = async (url: string, data: any, options = {}) => {
  const response = await instance.put(url, data, options);
  return response;
};

export const remove = async (url: string, options = {}) => {
  const response = await instance.delete(url, options);
  return response;
};

export const login = async (data: any, options = {}) => {
  try {
    console.log("Sending login request with data:", data);
    
    const response = await instance.post("/login", data, options);
    
    // Log chi tiết response
    console.log("Login API response status:", response.status);
    console.log("Login API full response:", response);
    console.log("Login API response data:", JSON.stringify(response.data, null, 2));
    
    // Kiểm tra cấu trúc response
    if (response.data) {
      // Kiểm tra xem response.data có chứa accessToken không
      if (response.data.accessToken) {
        console.log("accessToken found in response.data");
      } else {
        console.warn("accessToken not found in response.data");
      }
      
      // Kiểm tra xem response.data có chứa userId không
      if (response.data.result?.data?.userId) {
        console.log("userId found in response.data.result.data");
      } else {
        console.warn("userId not found in expected location");
        
        // Tìm kiếm userId ở các vị trí khác
        if (response.data.userId) {
          console.log("userId found directly in response.data");
        } else if (response.data.user?.id) {
          console.log("userId found in response.data.user.id");
        }
      }
    }
    
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const loginSuccess = async (id: any) => {
  try {
    const response = await instance.post("/login-success", id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (data: any, options = {}) => {
  const response = await instance.post("/register", data, options);
  return response;
};

export const getProfile = async () => {
  try {
    const response = await instance.get(`/profile`);
    return response;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw error;
  }
};

export const updateProfile = async (data: any) => {
  try {
    const userId = getCookie("userId");
    if (!userId) {
      throw new Error("User ID not found");
    }

    const response = await instance.put(`/users/edit/${userId}`, data);
    return response;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};

// API cho customer profile
export const updateCustomerProfile = async (data: any) => {
  try {
    const userId = getCookie("userId");
    if (!userId) {
      throw new Error("User ID not found");
    }

    const response = await instance.put(`/customers/edit/${userId}`, data);
    return response;
  } catch (error) {
    console.error("Failed to update customer profile:", error);
    throw error;
  }
};

// API cho user profile
export const updateUserProfile = async (data: any) => {
  try {
    const userId = getCookie("userId");
    if (!userId) {
      throw new Error("User ID not found");
    }

    const response = await instance.put(`/users/edit/${userId}`, data);
    return response;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
};

// API cho change password
export const changePassword = async (data: any) => {
  try {
    const response = await instance.put(`/profile/change-password`, data);
    return response;
  } catch (error) {
    console.error("Failed to change password:", error);
    throw error;
  }
};

// API cho customer change password
export const changeCustomerPassword = async (data: any) => {
  try {
    const response = await instance.put(`/customers/change-password`, data);
    return response;
  } catch (error) {
    console.error("Failed to change customer password:", error);
    throw error;
  }
};

// API cho customer statistics
export const getCustomerStatisticsOverview = async () => {
  try {
    const response = await instance.get(`/customer-statistics/overview`);
    return response;
  } catch (error) {
    console.error("Failed to get customer statistics overview:", error);
    throw error;
  }
};

export const getCustomerStatisticsPayments = async () => {
  try {
    const response = await instance.get(`/customer-statistics/payments`);
    return response;
  } catch (error) {
    console.error("Failed to get customer statistics payments:", error);
    throw error;
  }
};

export const getCustomerStatisticsSummary = async () => {
  try {
    const response = await instance.get(`/customer-statistics/summary`);
    return response;
  } catch (error) {
    console.error("Failed to get customer statistics summary:", error);
    throw error;
  }
};



