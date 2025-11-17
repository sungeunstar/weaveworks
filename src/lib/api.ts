/**
 * WeaveWorks ERP - API Utilities
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config);
    return response.data;
  }
}

export const api = new ApiClient(API_BASE_URL);

// API Endpoints

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Users
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Companies
export const companiesApi = {
  getAll: (params?: any) => api.get('/companies', { params }),
  getById: (id: string) => api.get(`/companies/${id}`),
  create: (data: any) => api.post('/companies', data),
  update: (id: string, data: any) => api.put(`/companies/${id}`, data),
  delete: (id: string) => api.delete(`/companies/${id}`),
};

// Yarns
export const yarnsApi = {
  getAll: (params?: any) => api.get('/yarns', { params }),
  getById: (id: string) => api.get(`/yarns/${id}`),
  create: (data: any) => api.post('/yarns', data),
  update: (id: string, data: any) => api.put(`/yarns/${id}`, data),
  delete: (id: string) => api.delete(`/yarns/${id}`),
};

// Grey Fabrics
export const greyFabricsApi = {
  getAll: (params?: any) => api.get('/greyFabrics', { params }),
  getById: (id: string) => api.get(`/greyFabrics/${id}`),
  create: (data: any) => api.post('/greyFabrics', data),
  update: (id: string, data: any) => api.put(`/greyFabrics/${id}`, data),
  delete: (id: string) => api.delete(`/greyFabrics/${id}`),
};

// Fabrics
export const fabricsApi = {
  getAll: (params?: any) => api.get('/fabrics', { params }),
  getById: (id: string) => api.get(`/fabrics/${id}`),
  create: (data: any) => api.post('/fabrics', data),
  update: (id: string, data: any) => api.put(`/fabrics/${id}`, data),
  delete: (id: string) => api.delete(`/fabrics/${id}`),
};

// Orders
export const ordersApi = {
  getAll: (params?: any) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: string, data: any) => api.put(`/orders/${id}`, data),
  delete: (id: string) => api.delete(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

// Shipping
export const shippingApi = {
  getAll: (params?: any) => api.get('/shipping', { params }),
  getById: (id: string) => api.get(`/shipping/${id}`),
  create: (data: any) => api.post('/shipping', data),
  update: (id: string, data: any) => api.put(`/shipping/${id}`, data),
  delete: (id: string) => api.delete(`/shipping/${id}`),
};

// Inventory
export const inventoryApi = {
  getTransactions: (params?: any) => api.get('/inventory/transactions', { params }),
  getStocks: (params?: any) => api.get('/inventory/stocks', { params }),
  createTransaction: (data: any) => api.post('/inventory/transactions', data),
  transfer: (data: any) => api.post('/inventory/transfer', data),
};

// Payments
export const paymentsApi = {
  getAll: (params?: any) => api.get('/payments', { params }),
  getById: (id: string) => api.get(`/payments/${id}`),
  create: (data: any) => api.post('/payments', data),
  update: (id: string, data: any) => api.put(`/payments/${id}`, data),
  delete: (id: string) => api.delete(`/payments/${id}`),
};

// Settlement
export const settlementApi = {
  getDaily: (date: string) => api.get(`/settlement/daily/${date}`),
  getMonthly: (month: string) => api.get(`/settlement/monthly/${month}`),
  getReport: (params: any) => api.get('/settlement/report', { params }),
};

export default api;
