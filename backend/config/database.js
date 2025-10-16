const mysql = require('mysql2/promise');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../config.env' });

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gm_biblioteca',
  charset: 'utf8mb4',
  timezone: '+00:00',
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Supabase configuration
const supabaseConfig = {
  url: process.env.SUPABASE_URL,
  anonKey: process.env.SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
};

// Database type (mysql or supabase)
const databaseType = process.env.DATABASE_TYPE || 'mysql';

// MySQL connection pool
let mysqlPool = null;
if (databaseType === 'mysql') {
  mysqlPool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

// Supabase client
let supabaseClient = null;
if (databaseType === 'supabase') {
  if (!supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
    throw new Error('Supabase configuration missing: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }
  
  supabaseClient = createClient(
    supabaseConfig.url,
    supabaseConfig.serviceRoleKey
  );
}

// Database interface
class Database {
  constructor() {
    this.type = databaseType;
  }

  // Test connection
  async testConnection() {
    try {
      if (this.type === 'mysql') {
        if (!mysqlPool) {
          throw new Error('MySQL pool not initialized');
        }
        const connection = await mysqlPool.getConnection();
        console.log('✅ MySQL Database connected successfully');
        connection.release();
        return true;
      } else if (this.type === 'supabase') {
        if (!supabaseClient) {
          throw new Error('Supabase client not initialized');
        }
        const { data, error } = await supabaseClient
          .from('livros')
          .select('count')
          .limit(1);
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist yet
          throw error;
        }
        console.log('✅ Supabase Database connected successfully');
        return true;
      }
    } catch (error) {
      console.error(`❌ ${this.type.toUpperCase()} Database connection failed:`, error.message);
      return false;
    }
  }

  // Get the appropriate client/pool
  getClient() {
    if (this.type === 'mysql') {
      return mysqlPool;
    } else if (this.type === 'supabase') {
      return supabaseClient;
    }
    throw new Error(`Unsupported database type: ${this.type}`);
  }

  // Get database type
  getType() {
    return this.type;
  }

  // Execute query (MySQL specific)
  async query(sql, params = []) {
    if (this.type !== 'mysql') {
      throw new Error('Query method only available for MySQL');
    }
    if (!mysqlPool) {
      throw new Error('MySQL pool not initialized');
    }
    return await mysqlPool.execute(sql, params);
  }

  // Supabase specific methods
  async supabaseQuery(table, operation, options = {}) {
    if (this.type !== 'supabase') {
      throw new Error('Supabase methods only available for Supabase');
    }
    if (!supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { select = '*', filters = {}, order = {}, limit, offset } = options;
    let query = supabaseClient.from(table);

    // Apply select
    if (select !== '*') {
      query = query.select(select);
    }

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

    // Apply pagination
    if (limit) {
      query = query.limit(limit);
      if (offset) {
        query = query.range(offset, offset + limit - 1);
      }
    }

    return await query;
  }

  async supabaseInsert(table, data) {
    if (this.type !== 'supabase') {
      throw new Error('Supabase methods only available for Supabase');
    }
    const { data: result, error } = await supabaseClient
      .from(table)
      .insert(data)
      .select();
    
    if (error) throw error;
    return result;
  }

  async supabaseUpdate(table, data, filters) {
    if (this.type !== 'supabase') {
      throw new Error('Supabase methods only available for Supabase');
    }
    let query = supabaseClient.from(table).update(data);
    
    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      query = query.eq(column, value);
    });
    
    const { data: result, error } = await query.select();
    if (error) throw error;
    return result;
  }

  async supabaseDelete(table, filters) {
    if (this.type !== 'supabase') {
      throw new Error('Supabase methods only available for Supabase');
    }
    let query = supabaseClient.from(table);
    
    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      query = query.eq(column, value);
    });
    
    const { data: result, error } = await query.delete().select();
    if (error) throw error;
    return result;
  }
}

// Create database instance
const db = new Database();

module.exports = {
  db,
  dbConfig,
  supabaseConfig,
  databaseType,
  // Legacy exports for backward compatibility
  pool: mysqlPool,
  testConnection: () => db.testConnection()
};