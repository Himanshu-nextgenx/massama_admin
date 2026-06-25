/**
 * Auth Utility - Shared API configuration with automatic token refresh
 */
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

const API_URL = '/api';

// Create axios instance
export const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Refresh token function
const refreshToken = async (): Promise<string | null> => {
    const refreshTokenValue = localStorage.getItem('refresh_token');
    if (!refreshTokenValue) {
        console.log('[Auth] No refresh token available');
        return null;
    }

    try {
        console.log('[Auth] Attempting token refresh...');
        const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken: refreshTokenValue,
        });

        const { access_token, refresh_token } = response.data;

        if (access_token) {
            localStorage.setItem('admin_token', access_token);
            console.log('[Auth] Token refreshed successfully');
        }
        if (refresh_token) {
            localStorage.setItem('refresh_token', refresh_token);
        }

        return access_token;
    } catch (error) {
        console.error('[Auth] Token refresh failed:', error);
        // Clear tokens and redirect to login
        localStorage.removeItem('admin_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        window.location.href = '/login';
        return null;
    }
};

// Request interceptor - attach token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle 401 and refresh token
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (token && originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshToken();
                if (newToken) {
                    processQueue(null, newToken);
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    }
                    return api(originalRequest);
                } else {
                    processQueue(new Error('Token refresh failed'), null);
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                processQueue(refreshError as Error, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
