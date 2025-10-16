require('dotenv').config({ path: './config.env' });
const { db } = require('./config/database');

async function testSupabaseConnection() {
  console.log('🔄 Testing Supabase connection...');
  console.log('Database type:', db.getType());
  
  try {
    // Test connection
    const connected = await db.testConnection();
    
    if (connected) {
      console.log('✅ Supabase connection successful!');
      
      // Test a simple query
      if (db.getType() === 'supabase') {
        console.log('🔄 Testing basic query...');
        
        // Try to query a table (this will work even if table doesn't exist yet)
        const result = await db.supabaseQuery('livro', 'select', {
          select: 'count',
          limit: 1
        });
        
        console.log('✅ Basic query test successful!');
        console.log('Query result:', result);
      }
    } else {
      console.log('❌ Supabase connection failed!');
    }
  } catch (error) {
    console.error('❌ Error testing Supabase:', error.message);
    
    if (error.message.includes('Invalid API key')) {
      console.log('💡 Tip: Check your SUPABASE_SERVICE_ROLE_KEY in config.env');
    } else if (error.message.includes('Invalid URL')) {
      console.log('💡 Tip: Check your SUPABASE_URL in config.env');
    }
  }
}

// Run the test
testSupabaseConnection().then(() => {
  console.log('🏁 Test completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
