import axios from 'axios';
import supabase, { getDatabaseType, supabaseQueries } from '../config/supabase';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const databaseType = getDatabaseType();

// Force Supabase for Vercel deployment
const finalDatabaseType = 'supabase';

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
    if (finalDatabaseType === 'supabase') {
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
    if (finalDatabaseType === 'supabase') {
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
    if (finalDatabaseType === 'supabase') {
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
    if (finalDatabaseType === 'supabase') {
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
    if (finalDatabaseType === 'supabase') {
      try {
        
        // Get all livros with basic data
        const livrosResult = await supabaseQueries.getAll('livro', {
          select: 'li_cod, li_titulo, li_ano, li_edicao, li_isbn, li_genero, li_editora, li_autor',
          order: { column: 'li_titulo', ascending: true }
        });
        
        // Then get editoras and autores separately
        const [editorasResult, autoresResult] = await Promise.all([
          supabase.from('editora').select('ed_cod, ed_nome'),
          supabase.from('autor').select('au_cod, au_nome')
        ]);
        
        // Create lookup maps
        const editorasMap = {};
        const autoresMap = {};
        
        editorasResult.data?.forEach(editora => {
          editorasMap[editora.ed_cod] = editora.ed_nome;
        });
        
        autoresResult.data?.forEach(autor => {
          autoresMap[autor.au_cod] = autor.au_nome;
        });
        
        // Merge data
        
        const livrosWithNames = livrosResult?.map(livro => {
          
          return {
            ...livro,
            editora_nome: editorasMap[livro.li_editora] || '—',
            autor_nome: autoresMap[livro.li_autor] || '—'
          };
        }) || [];
        
        return livrosWithNames;
      } catch (error) {
        console.error('Error in livrosService.getAll():', error);
        throw error;
      }
    } else {
      const response = await api.get(apiEndpoints.livros.list);
      return response.data.data || response.data;
    }
  },

  // Get livro by ID
  getById: async (id) => {
    if (finalDatabaseType === 'supabase') {
      return await supabaseQueries.getById('livro', id, { idColumn: 'li_cod' });
    } else {
      const response = await api.get(apiEndpoints.livros.get(id));
      return response.data.data || response.data;
    }
  },

  // Create new livro
  create: async (data) => {
    if (finalDatabaseType === 'supabase') {
      return await supabaseQueries.insert('livro', data);
    } else {
      const response = await api.post(apiEndpoints.livros.create, data);
      return response.data.data || response.data;
    }
  },

  // Update livro
  update: async (id, data) => {
    if (finalDatabaseType === 'supabase') {
      return await supabaseQueries.update('livro', data, { li_cod: id });
    } else {
      const response = await api.put(apiEndpoints.livros.update(id), data);
      return response.data.data || response.data;
    }
  },

  // Delete livro
  delete: async (id) => {
    if (finalDatabaseType === 'supabase') {
      try {
        // First, get all exemplares associated with this livro
        const { data: exemplares, error: getExemplaresError } = await supabase
          .from('livro_exemplar')
          .select('lex_cod')
          .eq('lex_li_cod', id);

        if (getExemplaresError) {
          throw getExemplaresError;
        }

        // Delete all requisições associated with these exemplares
        if (exemplares && exemplares.length > 0) {
          const exemplarIds = exemplares.map(ex => ex.lex_cod);
          
          const { error: requisicoesError } = await supabase
            .from('requisicao')
            .delete()
            .in('re_lex_cod', exemplarIds);

          if (requisicoesError) {
            console.warn('Warning deleting requisicoes:', requisicoesError);
            // Continue even if requisicoes deletion fails
          }
        }

        // Delete all exemplares associated with this livro
        const { error: exemplaresError } = await supabase
          .from('livro_exemplar')
          .delete()
          .eq('lex_li_cod', id);

        if (exemplaresError) {
          throw exemplaresError;
        }

        // Finally delete the livro
        const result = await supabaseQueries.delete('livro', { li_cod: id });
        
        return result;
      } catch (error) {
        console.error('Error deleting livro:', error);
        throw error;
      }
    } else {
      const response = await api.delete(apiEndpoints.livros.delete(id));
      return response.data.data || response.data;
    }
  }
};

// Editoras service with Supabase support
export const editorasService = {
  getAll: async () => {
    if (finalDatabaseType === 'supabase') {
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
    if (finalDatabaseType === 'supabase') {
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
    if (finalDatabaseType === 'supabase') {
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

// Dashboard service with Supabase support
export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    if (finalDatabaseType === 'supabase') {
      try {
        // Get all data and count manually
        const [livrosResult, exemplaresResult, utentesResult, requisicoesResult] = await Promise.all([
          supabase.from('livro').select('*', { count: 'exact', head: true }),
          supabase.from('livro_exemplar').select('*', { count: 'exact', head: true }),
          supabase.from('utente').select('*', { count: 'exact', head: true }),
          supabase.from('requisicao').select('*', { count: 'exact', head: true })
        ]);



        // Get exemplares disponíveis e emprestados
        const exemplaresDisponiveisResult = await supabase
          .from('livro_exemplar')
          .select('*', { count: 'exact', head: true })
          .eq('lex_disponivel', true);

        const exemplaresEmprestadosResult = await supabase
          .from('requisicao')
          .select('*', { count: 'exact', head: true })
          .is('re_data_devolucao', null);

        return {
          totalLivros: livrosResult.count || 0,
          totalExemplares: exemplaresResult.count || 0,
          totalUtentes: utentesResult.count || 0,
          totalRequisicoes: requisicoesResult.count || 0,
          exemplaresDisponiveis: exemplaresDisponiveisResult.count || 0,
          exemplaresEmprestados: exemplaresEmprestadosResult.count || 0
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }
    } else {
      const response = await api.get(apiEndpoints.dashboard.stats);
      return response.data.data || response.data;
    }
  },

  // Get recent activity
  getRecentActivity: async () => {
    if (finalDatabaseType === 'supabase') {
      try {
        // Get recent requisicoes with related data
        const { data, error } = await supabase
          .from('requisicao')
          .select(`
            re_cod,
            re_data_requisicao,
            re_data_devolucao,
            utente:re_ut_cod(ut_nome),
            exemplar:re_lex_cod(
              lex_cod,
              livro:lex_li_cod(li_titulo)
            )
          `)
          .order('re_data_requisicao', { ascending: false })
          .limit(10);

        if (error) throw error;
        
        // Transform data to match expected format
        const transformedData = data?.map(item => ({
          re_cod: item.re_cod,
          re_data_requisicao: item.re_data_requisicao,
          re_data_devolucao: item.re_data_devolucao,
          utente_nome: item.utente?.ut_nome || 'Utente não encontrado',
          livro_titulo: item.exemplar?.livro?.li_titulo || 'Livro não encontrado',
          status: item.re_data_devolucao ? 'devolvido' : 'emprestado'
        })) || [];
        
        return transformedData;
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        throw error;
      }
    } else {
      const response = await api.get(apiEndpoints.dashboard.recentActivity);
      return response.data.data || response.data;
    }
  }
};

// Exemplares service with Supabase support
export const exemplaresService = {
  getAll: async () => {
    if (finalDatabaseType === 'supabase') {
      try {
        console.log('🔍 Fetching exemplares with supabaseQueries...');
        const result = await supabaseQueries.getAll('livro_exemplar', {
          select: `
            lex_cod,
            lex_estado,
            lex_disponivel,
            livro:lex_li_cod(li_titulo)
          `,
          order: { column: 'lex_cod', ascending: true }
        });
        console.log('🔍 Exemplares result from supabaseQueries:', result);
        return result || [];
      } catch (error) {
        console.error('Error fetching exemplares:', error);
        throw error;
      }
    } else {
      const response = await api.get(apiEndpoints.exemplares.list);
      return response.data.data || response.data;
    }
  },

  create: async (data) => {
    if (finalDatabaseType === 'supabase') {
      try {
        const result = await supabaseQueries.insert('livro_exemplar', data);
        return result || [];
      } catch (error) {
        console.error('Error creating exemplar:', error);
        throw error;
      }
    } else {
      const response = await api.post(apiEndpoints.exemplares.create, data);
      return response.data.data || response.data;
    }
  },

  toggle: async (id) => {
    if (finalDatabaseType === 'supabase') {
      // Get current state and toggle
      const { data: current } = await supabase
        .from('livro_exemplar')
        .select('lex_disponivel')
        .eq('lex_cod', id)
        .single();
      
      const result = await supabaseQueries.update('livro_exemplar', 
        { lex_disponivel: !current.lex_disponivel }, 
        { lex_cod: id }
      );
      return result || [];
    } else {
      const response = await api.put(apiEndpoints.exemplares.toggle(id));
      return response.data.data || response.data;
    }
  },

  delete: async (id) => {
    if (finalDatabaseType === 'supabase') {
      try {
        // First delete all requisicoes associated with this exemplar
        const { error: requisicoesError } = await supabase
          .from('requisicao')
          .delete()
          .eq('re_lex_cod', id);

        if (requisicoesError) {
          console.warn('Warning deleting requisicoes for exemplar:', requisicoesError);
          // Continue even if requisicoes deletion fails
        }

        // Then delete the exemplar
        const result = await supabaseQueries.delete('livro_exemplar', { lex_cod: id });
        return result || [];
      } catch (error) {
        console.error('Error deleting exemplar:', error);
        throw error;
      }
    } else {
      const response = await api.delete(apiEndpoints.exemplares.delete(id));
      return response.data.data || response.data;
    }
  }
};

// Utentes service with Supabase support
export const utentesService = {
  getAll: async () => {
    if (finalDatabaseType === 'supabase') {
      const result = await supabaseQueries.getAll('utente', {
        order: { column: 'ut_nome', ascending: true }
      });
      return result.data || result;
    } else {
      const response = await api.get(apiEndpoints.utentes.list);
      return response.data.data || response.data;
    }
  },

  create: async (data) => {
    if (finalDatabaseType === 'supabase') {
      const result = await supabaseQueries.insert('utente', data);
      return result.data || result;
    } else {
      const response = await api.post(apiEndpoints.utentes.create, data);
      return response.data.data || response.data;
    }
  },

  update: async (id, data) => {
    if (finalDatabaseType === 'supabase') {
      const result = await supabaseQueries.update('utente', data, { ut_cod: id });
      return result.data || result;
    } else {
      const response = await api.put(apiEndpoints.utentes.update(id), data);
      return response.data.data || response.data;
    }
  },

  delete: async (id) => {
    if (finalDatabaseType === 'supabase') {
      try {
        // First delete all requisicoes associated with this utente
        const { error: requisicoesError } = await supabase
          .from('requisicao')
          .delete()
          .eq('re_ut_cod', id);

        if (requisicoesError) {
          console.warn('Warning deleting requisicoes for utente:', requisicoesError);
          // Continue even if requisicoes deletion fails
        }

        // Then delete the utente
        const result = await supabaseQueries.delete('utente', { ut_cod: id });
        return result || [];
      } catch (error) {
        console.error('Error deleting utente:', error);
        throw error;
      }
    } else {
      const response = await api.delete(apiEndpoints.utentes.delete(id));
      return response.data.data || response.data;
    }
  }
};

// Requisições service with Supabase support
export const requisicoesService = {
  getAll: async () => {
    if (finalDatabaseType === 'supabase') {
      try {
        const result = await supabaseQueries.getAll('requisicao', {
          select: `
            re_cod,
            re_data_requisicao,
            re_data_devolucao,
            utente:re_ut_cod(ut_nome),
            exemplar:re_lex_cod(lex_cod, livro:lex_li_cod(li_titulo))
          `,
          order: { column: 're_data_requisicao', ascending: false }
        });
        
        // Transform the data to match frontend expectations
        const transformedData = result?.map(item => ({
          re_cod: item.re_cod,
          re_data_requisicao: item.re_data_requisicao,
          re_data_devolucao: item.re_data_devolucao,
          utente_nome: item.utente?.ut_nome || 'Utente não encontrado',
          livro_titulo: item.exemplar?.livro?.li_titulo || 'Livro não encontrado',
          status: item.re_data_devolucao ? 'devolvido' : 'emprestado'
        })) || [];
        
        return transformedData;
      } catch (error) {
        console.error('Error fetching requisicoes:', error);
        throw error;
      }
    } else {
      const response = await api.get(apiEndpoints.requisicoes.list);
      return response.data.data || response.data;
    }
  },

  create: async (data) => {
    if (finalDatabaseType === 'supabase') {
      const result = await supabaseQueries.insert('requisicao', data);
      return result.data || result;
    } else {
      const response = await api.post(apiEndpoints.requisicoes.create, data);
      return response.data.data || response.data;
    }
  },

  return: async (id, data) => {
    if (finalDatabaseType === 'supabase') {
      const result = await supabaseQueries.update('requisicao', data, { re_cod: id });
      return result.data || result;
    } else {
      const response = await api.put(apiEndpoints.requisicoes.return(id), data);
      return response.data.data || response.data;
    }
  },

  delete: async (id) => {
    if (finalDatabaseType === 'supabase') {
      try {
        const result = await supabaseQueries.delete('requisicao', { re_cod: id });
        return result || [];
      } catch (error) {
        console.error('Error deleting requisicao:', error);
        throw error;
      }
    } else {
      const response = await api.delete(apiEndpoints.requisicoes.delete(id));
      return response.data.data || response.data;
    }
  }
};

// Códigos Postais service with Supabase support
export const codigosPostaisService = {
  getAll: async () => {
    if (finalDatabaseType === 'supabase') {
      const result = await supabaseQueries.getAll('codigo_postal', {
        order: { column: 'cod_postal', ascending: true }
      });
      return result.data || result;
    } else {
      const response = await api.get(apiEndpoints.codigosPostais.list);
      return response.data.data || response.data;
    }
  }
};

export default api;