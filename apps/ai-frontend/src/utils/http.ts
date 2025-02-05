import { ApiResponse } from "@/types";
import axios, { AxiosRequestConfig } from "axios";

// 创建 Axios 实例
const instance = axios.create({
  baseURL: "http://127.0.0.1:3000", // 设置基础 URL
  timeout: 5000, // 设置超时时间
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理
    console.log("请求拦截器 - 请求发送前", config);

    // 例如：添加请求头（如 token）
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // 处理请求错误
    console.error("请求拦截器 - 请求错误", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做一些处理
    console.log("响应拦截器 - 响应成功", response);

    // 例如：只返回 response.data
    return response;
  },
  (error) => {
    // 处理响应错误
    console.error("响应拦截器 - 响应错误", error);

    // 例如：统一处理 HTTP 错误状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("未授权，请重新登录");
          break;
        case 404:
          console.error("请求的资源不存在");
          break;
        case 500:
          console.error("服务器内部错误");
          break;
        default:
          console.error("其他错误");
      }
    }

    return Promise.reject(error);
  }
);

const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response = await instance.request<ApiResponse<T>>(config);

  return response.data.data;
};

export default request;
