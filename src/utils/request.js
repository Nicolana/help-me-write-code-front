import axios from 'axios';
const baseURL = '/api'; // 你的API基础URL

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
    return config;
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response.status === 401) {
      // 401 清除token信息并跳转到登录页面
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 封装GET请求
export const get = async (url, params = {}) => {
    console.log("params =", params)
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

// 封装PUT、DELETE
export const put = async (url, data = {}) => {
    try {
        const response = await axiosInstance.put(url, data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const del = async (url, data = {}) => {
    try {
        const response = await axiosInstance.delete(url, data);
        return response;
    } catch (error) {
        throw error;
    }
};


export default axiosInstance;
