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
