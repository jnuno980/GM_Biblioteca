<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// CRUD operations for Autores
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM autor ORDER BY au_nome');
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    console.error('Error fetching autores:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch autores' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM autor WHERE au_cod = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Autor not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching autor:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch autor' });
  }
});

router.post('/', validate(schemas.autor), async (req, res) => {
  try {
    const { au_nome, au_pais } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO autor (au_nome, au_pais) VALUES (?, ?)',
      [au_nome, au_pais]
    );
    
    res.status(201).json({
      success: true,
      data: { au_cod: result.insertId, au_nome, au_pais },
      message: 'Autor created successfully'
    });
  } catch (error) {
    console.error('Error creating autor:', error);
    res.status(500).json({ success: false, error: 'Failed to create autor' });
  }
});

router.put('/:id', validate(schemas.autor), async (req, res) => {
  try {
    const { id } = req.params;
    const { au_nome, au_pais } = req.body;
    
    const [existing] = await pool.execute('SELECT au_cod FROM autor WHERE au_cod = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Autor not found' });
    }
    
    await pool.execute(
      'UPDATE autor SET au_nome=?, au_pais=? WHERE au_cod=?',
      [au_nome, au_pais, id]
    );
    
    res.json({ success: true, message: 'Autor updated successfully' });
  } catch (error) {
    console.error('Error updating autor:', error);
    res.status(500).json({ success: false, error: 'Failed to update autor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM autor WHERE au_cod = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Autor not found' });
    }
    
    res.json({ success: true, message: 'Autor deleted successfully' });
  } catch (error) {
    console.error('Error deleting autor:', error);
    res.status(500).json({ success: false, error: 'Failed to delete autor' });
  }
});

module.exports = router;






=======
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// CRUD operations for Autores
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM autor ORDER BY au_nome');
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    console.error('Error fetching autores:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch autores' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM autor WHERE au_cod = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Autor not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching autor:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch autor' });
  }
});

router.post('/', validate(schemas.autor), async (req, res) => {
  try {
    const { au_nome, au_pais } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO autor (au_nome, au_pais) VALUES (?, ?)',
      [au_nome, au_pais]
    );
    
    res.status(201).json({
      success: true,
      data: { au_cod: result.insertId, au_nome, au_pais },
      message: 'Autor created successfully'
    });
  } catch (error) {
    console.error('Error creating autor:', error);
    res.status(500).json({ success: false, error: 'Failed to create autor' });
  }
});

router.put('/:id', validate(schemas.autor), async (req, res) => {
  try {
    const { id } = req.params;
    const { au_nome, au_pais } = req.body;
    
    const [existing] = await pool.execute('SELECT au_cod FROM autor WHERE au_cod = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Autor not found' });
    }
    
    await pool.execute(
      'UPDATE autor SET au_nome=?, au_pais=? WHERE au_cod=?',
      [au_nome, au_pais, id]
    );
    
    res.json({ success: true, message: 'Autor updated successfully' });
  } catch (error) {
    console.error('Error updating autor:', error);
    res.status(500).json({ success: false, error: 'Failed to update autor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM autor WHERE au_cod = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Autor not found' });
    }
    
    res.json({ success: true, message: 'Autor deleted successfully' });
  } catch (error) {
    console.error('Error deleting autor:', error);
    res.status(500).json({ success: false, error: 'Failed to delete autor' });
  }
});

module.exports = router;






>>>>>>> cdde7e74c145f3a7e1d3f77290ab03c7b8100859

