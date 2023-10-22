// api.js

import axios from 'axios';

const baseURL = '/api'; // 你的API基础URL

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    // 如果需要授权，可以在这里添加授权头
    // 'Authorization': `Bearer ${token}`
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 在请求发送之前可以进行一些操作，例如添加Loading状态
    return config;
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 对响应数据进行处理，例如解析数据
    return response.data;
  },
  (error) => {
    // 响应错误处理
    return Promise.reject(error);
  }
);

// 封装GET请求
export const get = async (url, params = {}) => {
  try {
    const response = await axiosInstance.get(url, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// 封装POST请求
export const post = async (url, data = {}) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response;
  } catch (error) {
    throw error;
  }
};

// 更多请求方法，例如PUT、DELETE等，可以按需进行封装

export default axiosInstance;
