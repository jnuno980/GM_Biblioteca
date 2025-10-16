import axios from 'axios';
import supabase, { getDatabaseType, supabaseQueries } from '../config/supabase';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const databaseType = getDatabaseType();

// Create axios instance for API calls
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
    if (databaseType === 'supabase') {
      // Handle Supabase direct calls
      const table = endpoint.split('/')[1]; // Extract table name from endpoint
      return await supabaseQueries.getAll(table);
    } else {
      // Use traditional API
      const response = await api.get(endpoint);
      return response.data;
    }
  },
  
  // POST request
  post: async (endpoint, data) => {
    if (databaseType === 'supabase') {
      // Handle Supabase direct calls
      const table = endpoint.split('/')[1]; // Extract table name from endpoint
      return await supabaseQueries.insert(table, data);
    } else {
      // Use traditional API
      const response = await api.post(endpoint, data);
      return response.data;
    }
  },
  
  // PUT request
  put: async (endpoint, data) => {
    if (databaseType === 'supabase') {
      // Handle Supabase direct calls
      const parts = endpoint.split('/');
      const table = parts[1];
      const id = parts[2];
      return await supabaseQueries.update(table, data, { id });
    } else {
      // Use traditional API
      const response = await api.put(endpoint, data);
      return response.data;
    }
  },
  
  // DELETE request
  delete: async (endpoint) => {
    if (databaseType === 'supabase') {
      // Handle Supabase direct calls
      const parts = endpoint.split('/');
      const table = parts[1];
      const id = parts[2];
      return await supabaseQueries.delete(table, { id });
    } else {
      // Use traditional API
      const response = await api.delete(endpoint);
      return response.data;
    }
  },
};

// Livros service with Supabase support
export const livrosService = {
  // Get all livros
  getAll: async () => {
    if (databaseType === 'supabase') {
      const result = await supabaseQueries.getAll('livro', {
        order: { column: 'li_titulo', ascending: true }
      });
      return result.data || result; // Return just the data array
    } else {
      const response = await api.get(apiEndpoints.livros.list);
      return response.data.data || response.data;
    }
  },

  // Get livro by ID
  getById: async (id) => {
    if (databaseType === 'supabase') {
      return await supabaseQueries.getById('livro', id);
    } else {
      const response = await api.get(apiEndpoints.livros.get(id));
      return response.data.data || response.data;
    }
  },

  // Create new livro
  create: async (data) => {
    if (databaseType === 'supabase') {
      return await supabaseQueries.insert('livro', data);
    } else {
      const response = await api.post(apiEndpoints.livros.create, data);
      return response.data.data || response.data;
    }
  },

  // Update livro
  update: async (id, data) => {
    if (databaseType === 'supabase') {
      return await supabaseQueries.update('livro', data, { li_cod: id });
    } else {
      const response = await api.put(apiEndpoints.livros.update(id), data);
      return response.data.data || response.data;
    }
  },

  // Delete livro
  delete: async (id) => {
    if (databaseType === 'supabase') {
      return await supabaseQueries.delete('livro', { li_cod: id });
    } else {
      const response = await api.delete(apiEndpoints.livros.delete(id));
      return response.data.data || response.data;
    }
  }
};

// Editoras service with Supabase support
export const editorasService = {
  getAll: async () => {
    if (databaseType === 'supabase') {
      const result = await supabaseQueries.getAll('editora', {
        order: { column: 'ed_nome', ascending: true }
      });
      return result.data || result; // Return just the data array
    } else {
      const response = await api.get(apiEndpoints.editoras.list);
      return response.data.data || response.data;
    }
  }
};

// Autores service with Supabase support
export const autoresService = {
  getAll: async () => {
    if (databaseType === 'supabase') {
      const result = await supabaseQueries.getAll('autor', {
        order: { column: 'au_nome', ascending: true }
      });
      return result.data || result; // Return just the data array
    } else {
      const response = await api.get(apiEndpoints.autores.list);
      return response.data.data || response.data;
    }
  }
};

// Géneros service with Supabase support
export const generosService = {
  getAll: async () => {
    if (databaseType === 'supabase') {
      const result = await supabaseQueries.getAll('genero', {
        order: { column: 'ge_genero', ascending: true }
      });
      return result.data || result; // Return just the data array
    } else {
      const response = await api.get(apiEndpoints.generos.list);
      return response.data.data || response.data;
    }
  }
};

export default api;