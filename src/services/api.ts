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
  const response = await instance.post("/login", data, options);
  return response;
};

export const loginSuccess = async (id: any, options = {}) => {
  const response = await instance.post("/login-success", id, options);
  return response;
};

export const register = async (data: any, options = {}) => {
  const response = await instance.post("/register", data, options);
  return response;
};
