<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// GET /api/livros - Listar todos os livros
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
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
    
    res.json({
      success: true,
      data: rows,
      count: rows.length
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
    
    const [rows] = await pool.execute(`
      SELECT 
        l.*,
        e.ed_nome as editora_nome,
        a.au_nome as autor_nome
      FROM livro l 
      LEFT JOIN editora e ON e.ed_cod = l.li_editora 
      LEFT JOIN autor a ON a.au_cod = l.li_autor 
      WHERE l.li_cod = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Livro not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
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
      const [existing] = await pool.execute(
        'SELECT li_cod FROM livro WHERE li_isbn = ?',
        [li_isbn]
      );
      
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'ISBN already exists'
        });
      }
    }
    
    const [result] = await pool.execute(
      'INSERT INTO livro (li_titulo, li_ano, li_edicao, li_isbn, li_editora, li_autor, li_genero) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [li_titulo, li_ano, li_edicao, li_isbn, li_editora, li_autor, li_genero]
    );
    
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
    const [existing] = await pool.execute(
      'SELECT li_cod FROM livro WHERE li_cod = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Livro not found'
      });
    }
    
    // Check if ISBN already exists (excluding current livro)
    if (li_isbn) {
      const [isbnCheck] = await pool.execute(
        'SELECT li_cod FROM livro WHERE li_isbn = ? AND li_cod != ?',
        [li_isbn, id]
      );
      
      if (isbnCheck.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'ISBN already exists'
        });
      }
    }
    
    await pool.execute(
      'UPDATE livro SET li_titulo=?, li_ano=?, li_edicao=?, li_isbn=?, li_editora=?, li_autor=?, li_genero=? WHERE li_cod=?',
      [li_titulo, li_ano, li_edicao, li_isbn, li_editora, li_autor, li_genero, id]
    );
    
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
    const [exemplares] = await pool.execute(
      'SELECT COUNT(*) as count FROM livro_exemplar WHERE lex_li_cod = ?',
      [id]
    );
    
    if (exemplares[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete livro with existing exemplares'
      });
    }
    
    const [result] = await pool.execute(
      'DELETE FROM livro WHERE li_cod = ?',
      [id]
    );
    
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






=======
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// GET /api/livros - Listar todos os livros
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
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
    
    res.json({
      success: true,
      data: rows,
      count: rows.length
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
    
    const [rows] = await pool.execute(`
      SELECT 
        l.*,
        e.ed_nome as editora_nome,
        a.au_nome as autor_nome
      FROM livro l 
      LEFT JOIN editora e ON e.ed_cod = l.li_editora 
      LEFT JOIN autor a ON a.au_cod = l.li_autor 
      WHERE l.li_cod = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Livro not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
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
      const [existing] = await pool.execute(
        'SELECT li_cod FROM livro WHERE li_isbn = ?',
        [li_isbn]
      );
      
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'ISBN already exists'
        });
      }
    }
    
    const [result] = await pool.execute(
      'INSERT INTO livro (li_titulo, li_ano, li_edicao, li_isbn, li_editora, li_autor, li_genero) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [li_titulo, li_ano, li_edicao, li_isbn, li_editora, li_autor, li_genero]
    );
    
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
    const [existing] = await pool.execute(
      'SELECT li_cod FROM livro WHERE li_cod = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Livro not found'
      });
    }
    
    // Check if ISBN already exists (excluding current livro)
    if (li_isbn) {
      const [isbnCheck] = await pool.execute(
        'SELECT li_cod FROM livro WHERE li_isbn = ? AND li_cod != ?',
        [li_isbn, id]
      );
      
      if (isbnCheck.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'ISBN already exists'
        });
      }
    }
    
    await pool.execute(
      'UPDATE livro SET li_titulo=?, li_ano=?, li_edicao=?, li_isbn=?, li_editora=?, li_autor=?, li_genero=? WHERE li_cod=?',
      [li_titulo, li_ano, li_edicao, li_isbn, li_editora, li_autor, li_genero, id]
    );
    
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
    const [exemplares] = await pool.execute(
      'SELECT COUNT(*) as count FROM livro_exemplar WHERE lex_li_cod = ?',
      [id]
    );
    
    if (exemplares[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete livro with existing exemplares'
      });
    }
    
    const [result] = await pool.execute(
      'DELETE FROM livro WHERE li_cod = ?',
      [id]
    );
    
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






>>>>>>> cdde7e74c145f3a7e1d3f77290ab03c7b8100859
