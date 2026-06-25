/**
 * API Configuration and Base Client
 * Connects to local NestJS server at port 3000
 */
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';

// API Base URL - Use relative path by default to work with both IP and Domain
const API_BASE_URL = '/api';

// Error response structure from NestJS
export interface ApiError {
    message: string | string[];
    error?: string;
    statusCode: number;
}

// Generic paginated response
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

// Create axios instance with default config
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log(`[API] Response ${response.status}:`, response.config.url);
        return response;
    },
    (error: AxiosError<ApiError>) => {
        const status = error.response?.status;
        const data = error.response?.data;

        // Log error details
        console.error('[API] Error:', {
            url: error.config?.url,
            status,
            message: data?.message,
            error: data?.error,
        });

        // Handle 401 - Unauthorized
        if (status === 401) {
            localStorage.removeItem('admin_token');
            window.location.href = '/login';
            return Promise.reject(new Error('Session expired. Please login again.'));
        }

        // Handle 403 - Forbidden
        if (status === 403) {
            return Promise.reject(new Error('You do not have permission to perform this action.'));
        }

        // Handle 404 - Not Found
        if (status === 404) {
            return Promise.reject(new Error('The requested resource was not found.'));
        }

        // Handle 400 - Bad Request (validation errors)
        if (status === 400 && data?.message) {
            const messages = Array.isArray(data.message)
                ? data.message.join(', ')
                : data.message;
            return Promise.reject(new Error(`Validation error: ${messages}`));
        }

        // Handle 500 - Server Error
        if (status && status >= 500) {
            return Promise.reject(new Error('Server error. Please try again later.'));
        }

        // Handle network errors
        if (error.code === 'ERR_NETWORK') {
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }

        // Default error
        return Promise.reject(error);
    }
);

export default api;
export { API_BASE_URL };
