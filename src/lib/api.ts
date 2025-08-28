import axios from 'axios';
import { SpyCat, SpyCatCreate, SpyCatUpdate } from '@/types/spyCat';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {    
    if (error.response) {

      console.error('Error Response:', error.response.data);
      
      if (error.response.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
    } 
  }
);

interface SpyCatApi {
  getAll: () => Promise<SpyCat[]>;
  getById: (id: number) => Promise<SpyCat>;
  create: (data: SpyCatCreate) => Promise<SpyCat>;
  update: (id: number, data: SpyCatUpdate) => Promise<SpyCat>;
  delete: (id: number) => Promise<void>;
}

export const spyCatApi: SpyCatApi = {
  // Get all spy cats
  getAll: async (): Promise<SpyCat[]> => {
    const response = await api.get('/spy-cats/');
    return response.data;
  },

  // Get single spy cat
  getById: async (id: number): Promise<SpyCat> => {
    const response = await api.get(`/spy-cats/${id}`);
    return response.data;
  },

  // Create new spy cat
  create: async (data: SpyCatCreate): Promise<SpyCat> => {
    const response = await api.post('/spy-cats/', data);
    return response.data;
  },

  // Update spy cat salary
  update: async (id: number, data: SpyCatUpdate): Promise<SpyCat> => {
    const response = await api.put(`/spy-cats/${id}`, data);
    return response.data;
  },

  // Delete spy cat
  delete: async (id: number): Promise<void> => {
    await api.delete(`/spy-cats/${id}`);
  },
};