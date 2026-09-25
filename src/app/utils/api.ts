import axios from 'axios';
import { supabase } from '../lib/supabase';

// Create axios instance pointing at our Express backend
const axiosInstance = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
});

// Attach Supabase session Bearer token to every request automatically
axiosInstance.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  return config;
});

// Unwrap axios response data; surface the backend error message on failure
async function request<T = any>(promise: Promise<any>): Promise<T> {
  try {
    const response = await promise;
    return response.data as T;
  } catch (err: any) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Request failed';
    throw new Error(message);
  }
}

export const api = {
  auth: {
    register: async (name: string, email: string, password: string) => {
      return request(axiosInstance.post('/api/auth/register', { name, email, password }));
    },
  },

  products: {
    getAll: async () => {
      return request(axiosInstance.get('/api/products'));
    },
    getById: async (id: number | string) => {
      return request(axiosInstance.get(`/api/products/${id}`));
    },
    create: async (productData: { name: string; price: number; stock: number; image?: string; description?: string }) => {
      return request(axiosInstance.post('/api/products', productData));
    },
    update: async (id: number | string, productData: { name: string; price: number; stock: number; image?: string; description?: string }) => {
      return request(axiosInstance.put(`/api/products/${id}`, productData));
    },
    delete: async (id: number | string) => {
      return request(axiosInstance.delete(`/api/products/${id}`));
    },
  },

  pets: {
    getByUser: async (userId: string | number) => {
      return request(axiosInstance.get('/api/pets', { params: { userId } }));
    },
    getById: async (id: number | string) => {
      return request(axiosInstance.get(`/api/pets/${id}`));
    },
    create: async (petData: { userId: string | number; name: string; type?: string; breed?: string; age?: number; ageUnit?: string; notes?: string }) => {
      return request(axiosInstance.post('/api/pets', petData));
    },
    update: async (id: number | string, petData: { name: string; type?: string; breed?: string; age?: number; ageUnit?: string; notes?: string }) => {
      return request(axiosInstance.put(`/api/pets/${id}`, petData));
    },
    delete: async (id: number | string) => {
      return request(axiosInstance.delete(`/api/pets/${id}`));
    },
  },

  bookings: {
    getByUser: async (userId?: string | number) => {
      return request(axiosInstance.get('/api/bookings', { params: userId ? { userId } : {} }));
    },
    create: async (bookingData: { userId: string | number; petId: number | string; service: string; date: string; time: string; notes?: string }) => {
      return request(axiosInstance.post('/api/bookings', bookingData));
    },
    delete: async (id: number | string) => {
      return request(axiosInstance.delete(`/api/bookings/${id}`));
    },
  },

  orders: {
    getByUser: async (userId?: string | number) => {
      return request(axiosInstance.get('/api/orders', { params: userId ? { userId } : {} }));
    },
    create: async (orderData: {
      userId: string | number;
      items: Array<{ productId: number | string; productName: string; quantity: number; price: number }>;
      total: number;
      instructions?: string;
    }) => {
      return request(axiosInstance.post('/api/orders', orderData));
    },
  },
};
