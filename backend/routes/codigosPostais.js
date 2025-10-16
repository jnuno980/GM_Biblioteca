<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// CRUD operations for Códigos Postais
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM codigo_postal ORDER BY cod_postal');
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    console.error('Error fetching codigos postais:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch codigos postais' });
  }
});

router.get('/:codigo', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM codigo_postal WHERE cod_postal = ?',
      [req.params.codigo]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Código postal not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching codigo postal:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch codigo postal' });
  }
});

router.post('/', validate(schemas.codigoPostal), async (req, res) => {
  try {
    const { cod_postal, cod_localidade } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO codigo_postal (cod_postal, cod_localidade) VALUES (?, ?)',
      [cod_postal, cod_localidade]
    );
    
    res.status(201).json({
      success: true,
      data: { cod_postal, cod_localidade },
      message: 'Código postal created successfully'
    });
  } catch (error) {
    console.error('Error creating codigo postal:', error);
    res.status(500).json({ success: false, error: 'Failed to create codigo postal' });
  }
});

router.put('/:codigo', validate(schemas.codigoPostal), async (req, res) => {
  try {
    const { codigo } = req.params;
    const { cod_postal, cod_localidade } = req.body;
    
    const [existing] = await pool.execute(
      'SELECT cod_postal FROM codigo_postal WHERE cod_postal = ?',
      [codigo]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Código postal not found' });
    }
    
    await pool.execute(
      'UPDATE codigo_postal SET cod_postal=?, cod_localidade=? WHERE cod_postal=?',
      [cod_postal, cod_localidade, codigo]
    );
    
    res.json({ success: true, message: 'Código postal updated successfully' });
  } catch (error) {
    console.error('Error updating codigo postal:', error);
    res.status(500).json({ success: false, error: 'Failed to update codigo postal' });
  }
});

router.delete('/:codigo', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM codigo_postal WHERE cod_postal = ?',
      [req.params.codigo]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Código postal not found' });
    }
    
    res.json({ success: true, message: 'Código postal deleted successfully' });
  } catch (error) {
    console.error('Error deleting codigo postal:', error);
    res.status(500).json({ success: false, error: 'Failed to delete codigo postal' });
  }
});

module.exports = router;






=======
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// CRUD operations for Códigos Postais
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM codigo_postal ORDER BY cod_postal');
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    console.error('Error fetching codigos postais:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch codigos postais' });
  }
});

router.get('/:codigo', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM codigo_postal WHERE cod_postal = ?',
      [req.params.codigo]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Código postal not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching codigo postal:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch codigo postal' });
  }
});

router.post('/', validate(schemas.codigoPostal), async (req, res) => {
  try {
    const { cod_postal, cod_localidade } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO codigo_postal (cod_postal, cod_localidade) VALUES (?, ?)',
      [cod_postal, cod_localidade]
    );
    
    res.status(201).json({
      success: true,
      data: { cod_postal, cod_localidade },
      message: 'Código postal created successfully'
    });
  } catch (error) {
    console.error('Error creating codigo postal:', error);
    res.status(500).json({ success: false, error: 'Failed to create codigo postal' });
  }
});

router.put('/:codigo', validate(schemas.codigoPostal), async (req, res) => {
  try {
    const { codigo } = req.params;
    const { cod_postal, cod_localidade } = req.body;
    
    const [existing] = await pool.execute(
      'SELECT cod_postal FROM codigo_postal WHERE cod_postal = ?',
      [codigo]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Código postal not found' });
    }
    
    await pool.execute(
      'UPDATE codigo_postal SET cod_postal=?, cod_localidade=? WHERE cod_postal=?',
      [cod_postal, cod_localidade, codigo]
    );
    
    res.json({ success: true, message: 'Código postal updated successfully' });
  } catch (error) {
    console.error('Error updating codigo postal:', error);
    res.status(500).json({ success: false, error: 'Failed to update codigo postal' });
  }
});

router.delete('/:codigo', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM codigo_postal WHERE cod_postal = ?',
      [req.params.codigo]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Código postal not found' });
    }
    
    res.json({ success: true, message: 'Código postal deleted successfully' });
  } catch (error) {
    console.error('Error deleting codigo postal:', error);
    res.status(500).json({ success: false, error: 'Failed to delete codigo postal' });
  }
});

module.exports = router;






>>>>>>> cdde7e74c145f3a7e1d3f77290ab03c7b8100859

