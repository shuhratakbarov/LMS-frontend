import axios from "axios";
import {host, port} from "./const";
import {getToken} from "../util/TokenUtil";

const axiosInstance = axios.create({
    baseURL: `${host}:${port}/api`,
    // baseURL: `https://9402-95-214-211-53.ngrok-free.app/api`,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request Interceptor:', config);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response Interceptor:', response);

        if (response && response.result) {
            response = response.result;
        } else if (response && response.payload) {
            response = response.payload;
        } else if (response && response.data) {
            response = response.data;
        }

        if (response && response.result) {
            response = response.result;
        } else if (response && response.payload) {
            response = response.payload;
        } else if (response && response.data) {
            response = response.data;
        }

        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;