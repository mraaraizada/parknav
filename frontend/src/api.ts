import axios from 'axios';
import { MovieInput, PredictionResponse, Options } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictRevenue = async (movieData: MovieInput): Promise<PredictionResponse> => {
  const response = await api.post<PredictionResponse>('/api/predict', movieData);
  return response.data;
};

export const getOptions = async (): Promise<Options> => {
  const response = await api.get<Options>('/api/options');
  return response.data;
};

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

