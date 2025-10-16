import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!');
  console.error('Missing variables:', {
    REACT_APP_SUPABASE_URL: !supabaseUrl,
    REACT_APP_SUPABASE_ANON_KEY: !supabaseAnonKey,
    REACT_APP_SUPABASE_SERVICE_ROLE_KEY: !supabaseServiceKey
  });
  console.error('Please check your environment variables in Vercel dashboard.');
}

// Create Supabase client with fallback
const supabase = createClient(
  supabaseUrl || 'https://mnvlywpbifenjlegkzom.supabase.co', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udmx5d3BiaWZlbmpsZWdrem9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODIwMTEsImV4cCI6MjA3NDk1ODAxMX0.Jw6pcscLRGIavfT_4g1XRMFG_uAopK9CJBtbIwPjcRY',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  }
);

// Create admin client for service role operations
const supabaseAdmin = createClient(
  supabaseUrl || 'https://mnvlywpbifenjlegkzom.supabase.co',
  supabaseServiceKey || supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udmx5d3BiaWZlbmpsZWdrem9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODIwMTEsImV4cCI6MjA3NDk1ODAxMX0.Jw6pcscLRGIavfT_4g1XRMFG_uAopK9CJBtbIwPjcRY',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default supabase;
export { supabaseAdmin };

// Database type helper
export const getDatabaseType = () => {
  return process.env.REACT_APP_DATABASE_TYPE || 'api';
};

// Supabase-specific query helpers
export const supabaseQueries = {
  // Get all records from a table
  getAll: async (table, options = {}) => {
    const { select = '*', order = {}, filters = {} } = options;
    
    let query = supabase.from(table).select(select);
    
    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      if (Array.isArray(value)) {
        query = query.in(column, value);
      } else if (typeof value === 'object' && value.operator) {
        query = query[value.operator](column, value.value);
      } else {
        query = query.eq(column, value);
      }
    });
    
    // Apply ordering
    if (order.column) {
      query = query.order(order.column, { ascending: order.ascending !== false });
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get single record by ID
  getById: async (table, id, options = {}) => {
    const { select = '*' } = options;
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Insert new record
  insert: async (table, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    
    if (error) throw error;
    return result;
  },

  // Update record
  update: async (table, data, filters) => {
    let query = supabase.from(table).update(data);
    
    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      query = query.eq(column, value);
    });
    
    const { data: result, error } = await query.select();
    if (error) throw error;
    return result;
  },

  // Delete record
  delete: async (table, filters) => {
    let query = supabase.from(table);
    
    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      query = query.eq(column, value);
    });
    
    const { data: result, error } = await query.delete().select();
    if (error) throw error;
    return result;
  }
};
