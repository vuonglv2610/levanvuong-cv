import axios from "axios";
import { getCookie } from "../libs/getCookie";

//todo: create Interceptors

const instance = axios.create({
  baseURL: process.env.REACT_APP_PORT_BACKEND,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(
  function (config) {
    const accessToken = getCookie("accessToken");
    const headers: any = {};
    if (accessToken) {
      headers.Authorization = "Bearer " + accessToken;
    }
    return { ...config, headers: { ...config.headers, ...headers } };
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
