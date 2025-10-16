require('dotenv').config({ path: '../config.env' });

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate configuration
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase configuration missing: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

// Supabase API helper functions using fetch
const supabaseAPI = {
  // Make request to Supabase REST API
  async request(endpoint, options = {}) {
    const url = `${supabaseUrl}/rest/v1${endpoint}`;
    
    const defaultHeaders = {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Supabase API Error: ${response.status} - ${error}`);
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return null;
  },

  // Select data from table
  async select(table, options = {}) {
    const { select = '*', filters = {}, order = {}, limit, offset } = options;
    
    let endpoint = `/${table}?select=${select}`;
    
    // Add filters
    Object.entries(filters).forEach(([column, value]) => {
      endpoint += `&${column}=eq.${value}`;
    });
    
    // Add ordering
    if (order.column) {
      endpoint += `&order=${order.column}`;
      if (order.ascending !== false) {
        endpoint += '.asc';
      } else {
        endpoint += '.desc';
      }
    }
    
    // Add pagination
    if (limit) {
      endpoint += `&limit=${limit}`;
      if (offset) {
        endpoint += `&offset=${offset}`;
      }
    }
    
    return await this.request(endpoint);
  },

  // Insert data into table
  async insert(table, data) {
    return await this.request(`/${table}`, {
      method: 'POST',
      body: JSON.stringify(Array.isArray(data) ? data : [data])
    });
  },

  // Update data in table
  async update(table, data, filters) {
    let endpoint = `/${table}`;
    
    // Add filters to endpoint
    Object.entries(filters).forEach(([column, value]) => {
      endpoint += `?${column}=eq.${value}`;
    });
    
    return await this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  // Delete data from table
  async delete(table, filters) {
    let endpoint = `/${table}`;
    
    // Add filters to endpoint
    Object.entries(filters).forEach(([column, value]) => {
      endpoint += `?${column}=eq.${value}`;
    });
    
    return await this.request(endpoint, {
      method: 'DELETE'
    });
  },

  // Count records in table
  async count(table, filters = {}) {
    let endpoint = `/${table}?select=count`;
    
    // Add filters
    Object.entries(filters).forEach(([column, value]) => {
      endpoint += `&${column}=eq.${value}`;
    });
    
    const result = await this.request(endpoint, {
      headers: {
        'Prefer': 'count=exact'
      }
    });
    
    // Extract count from headers
    return result ? result.length : 0;
  }
};

// Test connection
const testConnection = async () => {
  try {
    await supabaseAPI.select('livro', { limit: 1 });
    console.log('✅ Supabase Database connected successfully');
    return true;
  } catch (error) {
    if (error.message.includes('relation "livro" does not exist')) {
      console.log('ℹ️  Table "livro" does not exist yet - this is normal for a new setup');
      console.log('✅ Supabase connection is working');
      return true;
    }
    console.error('❌ Supabase Database connection failed:', error.message);
    return false;
  }
};

module.exports = {
  supabaseAPI,
  testConnection
};