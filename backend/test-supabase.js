require('dotenv').config({ path: './config.env' });
const { db } = require('./config/database');

async function testSupabaseConnection() {
  console.log('🔄 Testing Supabase connection...');
  
  try {
    // Test connection
    const connected = await db.testConnection();
    
    if (connected) {
      console.log('✅ Supabase connection successful!');
      
      // Test a simple query
      console.log('🔄 Testing basic query...');
      
      try {
        const result = await db.getAll('livro', {
          select: 'li_cod, li_titulo',
          limit: 5
        });
        
        console.log('✅ Basic query test successful!');
        console.log('Sample data:', result);
      } catch (queryError) {
        if (queryError.code === 'PGRST116') {
          console.log('ℹ️  Table "livro" doesn\'t exist yet. This is normal for a new setup.');
          console.log('💡 You can create the table structure in your Supabase dashboard.');
        } else {
          throw queryError;
        }
      }
      
      console.log('\n🎉 Supabase is ready to use!');
    } else {
      console.log('❌ Supabase connection failed!');
    }
  } catch (error) {
    console.error('❌ Error testing Supabase:', error.message);
    
    if (error.message.includes('Invalid API key')) {
      console.log('💡 Tip: Check your SUPABASE_SERVICE_ROLE_KEY in config.env');
    } else if (error.message.includes('Invalid URL')) {
      console.log('💡 Tip: Check your SUPABASE_URL in config.env');
    } else if (error.message.includes('Failed to fetch')) {
      console.log('💡 Tip: Check your internet connection and Supabase URL');
    }
  }
}

// Run the test
testSupabaseConnection().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});