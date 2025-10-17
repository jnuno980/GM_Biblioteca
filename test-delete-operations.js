// Test delete operations
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnvlywpbifenjlegkzom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udmx5d3BiaWZlbmpsZWdrem9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODIwMTEsImV4cCI6MjA3NDk1ODAxMX0.Jw6pcscLRGIavfT_4g1XRMFG_uAopK9CJBtbIwPjcRY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDeleteOperations() {
  console.log('🔍 Testing delete operations...');
  
  try {
    // Test delete operation on livro table
    const { data: livros } = await supabase.from('livro').select('li_cod, li_titulo').limit(1);
    
    if (livros && livros.length > 0) {
      const livroToDelete = livros[0];
      console.log(`📊 Testing delete on livro: ${livroToDelete.li_titulo} (ID: ${livroToDelete.li_cod})`);
      
      // Test the delete query step by step
      let query = supabase.from('livro');
      console.log('📊 Step 1 - Created query:', typeof query);
      
      query = query.eq('li_cod', livroToDelete.li_cod);
      console.log('📊 Step 2 - Added eq filter:', typeof query);
      
      const { data: result, error } = await query.delete();
      console.log('📊 Step 3 - Called delete');
      
      if (error) {
        console.error('❌ Delete error:', error);
      } else {
        console.log('✅ Delete operation successful');
        console.log('📊 Deleted records:', result);
      }
    } else {
      console.log('⚠️ No livros found to test delete');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testDeleteOperations();
