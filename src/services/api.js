import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle common errors
    if (error.response?.status === 404) {
      throw new Error('Recurso não encontrado');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data.error || 'Dados inválidos');
    } else if (error.response?.status === 500) {
      throw new Error('Erro interno do servidor');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout - servidor não respondeu');
    } else if (!error.response) {
      throw new Error('Erro de conexão com o servidor');
    }
    
    throw error;
  }
);

// API endpoints
export const apiEndpoints = {
  // Dashboard
  dashboard: {
    stats: '/dashboard/stats',
    recentActivity: '/dashboard/recent-activity',
    charts: '/dashboard/charts',
  },
  
  // Livros
  livros: {
    list: '/livros',
    get: (id) => `/livros/${id}`,
    create: '/livros',
    update: (id) => `/livros/${id}`,
    delete: (id) => `/livros/${id}`,
  },
  
  // Exemplares
  exemplares: {
    list: '/exemplares',
    create: '/exemplares',
    toggle: (id) => `/exemplares/${id}/toggle`,
    delete: (id) => `/exemplares/${id}`,
  },
  
  // Utentes
  utentes: {
    list: '/utentes',
    get: (id) => `/utentes/${id}`,
    create: '/utentes',
    update: (id) => `/utentes/${id}`,
    delete: (id) => `/utentes/${id}`,
  },
  
  // Requisições
  requisicoes: {
    list: '/requisicoes',
    get: (id) => `/requisicoes/${id}`,
    create: '/requisicoes',
    return: (id) => `/requisicoes/${id}/return`,
    delete: (id) => `/requisicoes/${id}`,
  },
  
  // Editoras
  editoras: {
    list: '/editoras',
    get: (id) => `/editoras/${id}`,
    create: '/editoras',
    update: (id) => `/editoras/${id}`,
    delete: (id) => `/editoras/${id}`,
  },
  
  // Autores
  autores: {
    list: '/autores',
    get: (id) => `/autores/${id}`,
    create: '/autores',
    update: (id) => `/autores/${id}`,
    delete: (id) => `/autores/${id}`,
  },
  
  // Géneros
  generos: {
    list: '/generos',
    create: '/generos',
    delete: (genero) => `/generos/${genero}`,
  },
  
  // Códigos Postais
  codigosPostais: {
    list: '/codigos-postais',
    get: (codigo) => `/codigos-postais/${codigo}`,
    create: '/codigos-postais',
    update: (codigo) => `/codigos-postais/${codigo}`,
    delete: (codigo) => `/codigos-postais/${codigo}`,
  },
};

// Generic API functions
export const apiService = {
  // GET request
  get: async (endpoint) => {
    const response = await api.get(endpoint);
    return response.data;
  },
  
  // POST request
  post: async (endpoint, data) => {
    const response = await api.post(endpoint, data);
    return response.data;
  },
  
  // PUT request
  put: async (endpoint, data) => {
    const response = await api.put(endpoint, data);
    return response.data;
  },
  
  // DELETE request
  delete: async (endpoint) => {
    const response = await api.delete(endpoint);
    return response.data;
  },
};

export default api;


