const express = require('express');
const router = express.Router();
const { db } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// GET /api/livros - Listar todos os livros
router.get('/', async (req, res) => {
  try {
    let data;
    
    if (db.getType() === 'mysql') {
      const [rows] = await db.query(`
        SELECT 
          l.li_cod, 
          l.li_titulo, 
          l.li_ano, 
          l.li_isbn, 
          l.li_genero,
          e.ed_nome as editora_nome,
          a.au_nome as autor_nome
        FROM livro l 
        LEFT JOIN editora e ON e.ed_cod = l.li_editora 
        LEFT JOIN autor a ON a.au_cod = l.li_autor 
        ORDER BY l.li_titulo ASC
      `);
      data = rows;
    } else if (db.getType() === 'supabase') {
      // Para Supabase, vamos fazer uma query simples primeiro
      // Depois pode ser otimizada com joins se necessário
      const result = await db.supabaseQuery('livro', 'select', {
        select: '*',
        order: { column: 'li_titulo', ascending: true }
      });
      data = result.data || [];
    }
    
    res.json({
      success: true,
      data: data,
      count: data.length
    });
  } catch (error) {
    console.error('Error fetching livros:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch livros'
    });
  }
});

// GET /api/livros/:id - Buscar livro por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let data;
    
    if (db.getType() === 'mysql') {
      const [rows] = await db.query(`
        SELECT 
          l.*,
          e.ed_nome as editora_nome,
          a.au_nome as autor_nome
        FROM livro l 
        LEFT JOIN editora e ON e.ed_cod = l.li_editora 
        LEFT JOIN autor a ON a.au_cod = l.li_autor 
        WHERE l.li_cod = ?
      `, [id]);
      data = rows;
    } else if (db.getType() === 'supabase') {
      const result = await db.supabaseQuery('livro', 'select', {
        filters: { li_cod: id }
      });
      data = result.data || [];
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Livro not found'
      });
    }
    
    res.json({
      success: true,
      data: data[0]
    });
  } catch (error) {
    console.error('Error fetching livro:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch livro'
    });
  }
});

// POST /api/livros - Criar novo livro
router.post('/', validate(schemas.livro), async (req, res) => {
  try {
    const { li_titulo, li_ano, li_edicao, li_isbn, li_editora, li_autor, li_genero } = req.body;
    
    // Check if ISBN already exists
    if (li_isbn) {
      let existing;
      
      if (db.getType() === 'mysql') {
        const [rows] = await db.query(
          'SELECT li_cod FROM livro WHERE li_isbn = ?',
          [li_isbn]
        );
        existing = rows;
      } else if (db.getType() === 'supabase') {
        const result = await db.supabaseQuery('livro', 'select', {
          select: 'li_cod',
          filters: { li_isbn: li_isbn }
        });
        existing = result.data || [];
      }
      
      if (existing && existing.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'ISBN already exists'
        });
      }
    }
    
    let result;
    
    if (db.getType() === 'mysql') {
      const [insertResult] = await db.query(
        'INSERT INTO livro (li_titulo, li_ano, li_edicao, li_isbn, li_editora, li_autor, li_genero) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [li_titulo, li_ano, li_edicao, li_isbn, li_editora, li_autor, li_genero]
      );
      result = { insertId: insertResult.insertId };
    } else if (db.getType() === 'supabase') {
      const insertResult = await db.supabaseInsert('livro', {
        li_titulo,
        li_ano,
        li_edicao,
        li_isbn,
        li_editora,
        li_autor,
        li_genero
      });
      result = { insertId: insertResult[0]?.li_cod };
    }
    
    res.status(201).json({
      success: true,
      data: {
        li_cod: result.insertId,
        li_titulo,
        li_ano,
        li_edicao,
        li_isbn,
        li_editora,
        li_autor,
        li_genero
      },
      message: 'Livro created successfully'
    });
  } catch (error) {
    console.error('Error creating livro:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create livro'
    });
  }
});

// PUT /api/livros/:id - Atualizar livro
router.put('/:id', validate(schemas.livro), async (req, res) => {
  try {
    const { id } = req.params;
    const { li_titulo, li_ano, li_edicao, li_isbn, li_editora, li_autor, li_genero } = req.body;
    
    // Check if livro exists
    let existing;
    
    if (db.getType() === 'mysql') {
      const [rows] = await db.query(
        'SELECT li_cod FROM livro WHERE li_cod = ?',
        [id]
      );
      existing = rows;
    } else if (db.getType() === 'supabase') {
      const result = await db.supabaseQuery('livro', 'select', {
        select: 'li_cod',
        filters: { li_cod: id }
      });
      existing = result.data || [];
    }
    
    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Livro not found'
      });
    }
    
    // Check if ISBN already exists (excluding current livro)
    if (li_isbn) {
      let isbnCheck;
      
      if (db.getType() === 'mysql') {
        const [rows] = await db.query(
          'SELECT li_cod FROM livro WHERE li_isbn = ? AND li_cod != ?',
          [li_isbn, id]
        );
        isbnCheck = rows;
      } else if (db.getType() === 'supabase') {
        const result = await db.supabaseQuery('livro', 'select', {
          select: 'li_cod',
          filters: { 
            li_isbn: li_isbn,
            li_cod: { operator: 'neq', value: id }
          }
        });
        isbnCheck = result.data || [];
      }
      
      if (isbnCheck && isbnCheck.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'ISBN already exists'
        });
      }
    }
    
    // Update livro
    if (db.getType() === 'mysql') {
      await db.query(
        'UPDATE livro SET li_titulo=?, li_ano=?, li_edicao=?, li_isbn=?, li_editora=?, li_autor=?, li_genero=? WHERE li_cod=?',
        [li_titulo, li_ano, li_edicao, li_isbn, li_editora, li_autor, li_genero, id]
      );
    } else if (db.getType() === 'supabase') {
      await db.supabaseUpdate('livro', {
        li_titulo,
        li_ano,
        li_edicao,
        li_isbn,
        li_editora,
        li_autor,
        li_genero
      }, { li_cod: id });
    }
    
    res.json({
      success: true,
      message: 'Livro updated successfully'
    });
  } catch (error) {
    console.error('Error updating livro:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update livro'
    });
  }
});

// DELETE /api/livros/:id - Deletar livro
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if livro has exemplares
    let exemplares;
    
    if (db.getType() === 'mysql') {
      const [rows] = await db.query(
        'SELECT COUNT(*) as count FROM livro_exemplar WHERE lex_li_cod = ?',
        [id]
      );
      exemplares = rows;
    } else if (db.getType() === 'supabase') {
      const result = await db.supabaseQuery('livro_exemplar', 'select', {
        select: 'count',
        filters: { lex_li_cod: id }
      });
      exemplares = [{ count: result.data?.length || 0 }];
    }
    
    if (exemplares && exemplares[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete livro with existing exemplares'
      });
    }
    
    // Delete livro
    let result;
    
    if (db.getType() === 'mysql') {
      const [deleteResult] = await db.query(
        'DELETE FROM livro WHERE li_cod = ?',
        [id]
      );
      result = { affectedRows: deleteResult.affectedRows };
    } else if (db.getType() === 'supabase') {
      const deleteResult = await db.supabaseDelete('livro', { li_cod: id });
      result = { affectedRows: deleteResult.length };
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Livro not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Livro deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting livro:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete livro'
    });
  }
});

module.exports = router;