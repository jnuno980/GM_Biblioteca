
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// CRUD operations for Editoras
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        e.*,
        cp.cod_localidade
      FROM editora e
      LEFT JOIN codigo_postal cp ON cp.cod_postal = e.ed_cod_postal
      ORDER BY e.ed_nome
    `);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    console.error('Error fetching editoras:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch editoras' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        e.*,
        cp.cod_localidade
      FROM editora e
      LEFT JOIN codigo_postal cp ON cp.cod_postal = e.ed_cod_postal
      WHERE e.ed_cod = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Editora not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching editora:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch editora' });
  }
});

router.post('/', validate(schemas.editora), async (req, res) => {
  try {
    const { ed_nome, ed_pais, ed_morada, ed_cod_postal, ed_email, ed_tlm } = req.body;
    
    // Validate codigo postal if provided
    let codPostalDb = null;
    if (ed_cod_postal) {
      const [codCheck] = await pool.execute(
        'SELECT cod_postal FROM codigo_postal WHERE cod_postal = ?',
        [ed_cod_postal]
      );
      if (codCheck.length > 0) {
        codPostalDb = ed_cod_postal;
      }
    }
    
    const [result] = await pool.execute(
      'INSERT INTO editora (ed_nome, ed_pais, ed_morada, ed_cod_postal, ed_email, ed_tlm) VALUES (?, ?, ?, ?, ?, ?)',
      [ed_nome, ed_pais, ed_morada, codPostalDb, ed_email, ed_tlm]
    );
    
    res.status(201).json({
      success: true,
      data: { ed_cod: result.insertId, ed_nome, ed_pais, ed_morada, ed_cod_postal: codPostalDb, ed_email, ed_tlm },
      message: 'Editora created successfully'
    });
  } catch (error) {
    console.error('Error creating editora:', error);
    res.status(500).json({ success: false, error: 'Failed to create editora' });
  }
});

router.put('/:id', validate(schemas.editora), async (req, res) => {
  try {
    const { id } = req.params;
    const { ed_nome, ed_pais, ed_morada, ed_cod_postal, ed_email, ed_tlm } = req.body;
    
    const [existing] = await pool.execute('SELECT ed_cod FROM editora WHERE ed_cod = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Editora not found' });
    }
    
    let codPostalDb = null;
    if (ed_cod_postal) {
      const [codCheck] = await pool.execute(
        'SELECT cod_postal FROM codigo_postal WHERE cod_postal = ?',
        [ed_cod_postal]
      );
      if (codCheck.length > 0) {
        codPostalDb = ed_cod_postal;
      }
    }
    
    await pool.execute(
      'UPDATE editora SET ed_nome=?, ed_pais=?, ed_morada=?, ed_cod_postal=?, ed_email=?, ed_tlm=? WHERE ed_cod=?',
      [ed_nome, ed_pais, ed_morada, codPostalDb, ed_email, ed_tlm, id]
    );
    
    res.json({ success: true, message: 'Editora updated successfully' });
  } catch (error) {
    console.error('Error updating editora:', error);
    res.status(500).json({ success: false, error: 'Failed to update editora' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM editora WHERE ed_cod = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Editora not found' });
    }
    
    res.json({ success: true, message: 'Editora deleted successfully' });
  } catch (error) {
    console.error('Error deleting editora:', error);
    res.status(500).json({ success: false, error: 'Failed to delete editora' });
  }
});

module.exports = router;





const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// CRUD operations for Editoras
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        e.*,
        cp.cod_localidade
      FROM editora e
      LEFT JOIN codigo_postal cp ON cp.cod_postal = e.ed_cod_postal
      ORDER BY e.ed_nome
    `);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    console.error('Error fetching editoras:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch editoras' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        e.*,
        cp.cod_localidade
      FROM editora e
      LEFT JOIN codigo_postal cp ON cp.cod_postal = e.ed_cod_postal
      WHERE e.ed_cod = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Editora not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching editora:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch editora' });
  }
});

router.post('/', validate(schemas.editora), async (req, res) => {
  try {
    const { ed_nome, ed_pais, ed_morada, ed_cod_postal, ed_email, ed_tlm } = req.body;
    
    // Validate codigo postal if provided
    let codPostalDb = null;
    if (ed_cod_postal) {
      const [codCheck] = await pool.execute(
        'SELECT cod_postal FROM codigo_postal WHERE cod_postal = ?',
        [ed_cod_postal]
      );
      if (codCheck.length > 0) {
        codPostalDb = ed_cod_postal;
      }
    }
    
    const [result] = await pool.execute(
      'INSERT INTO editora (ed_nome, ed_pais, ed_morada, ed_cod_postal, ed_email, ed_tlm) VALUES (?, ?, ?, ?, ?, ?)',
      [ed_nome, ed_pais, ed_morada, codPostalDb, ed_email, ed_tlm]
    );
    
    res.status(201).json({
      success: true,
      data: { ed_cod: result.insertId, ed_nome, ed_pais, ed_morada, ed_cod_postal: codPostalDb, ed_email, ed_tlm },
      message: 'Editora created successfully'
    });
  } catch (error) {
    console.error('Error creating editora:', error);
    res.status(500).json({ success: false, error: 'Failed to create editora' });
  }
});

router.put('/:id', validate(schemas.editora), async (req, res) => {
  try {
    const { id } = req.params;
    const { ed_nome, ed_pais, ed_morada, ed_cod_postal, ed_email, ed_tlm } = req.body;
    
    const [existing] = await pool.execute('SELECT ed_cod FROM editora WHERE ed_cod = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Editora not found' });
    }
    
    let codPostalDb = null;
    if (ed_cod_postal) {
      const [codCheck] = await pool.execute(
        'SELECT cod_postal FROM codigo_postal WHERE cod_postal = ?',
        [ed_cod_postal]
      );
      if (codCheck.length > 0) {
        codPostalDb = ed_cod_postal;
      }
    }
    
    await pool.execute(
      'UPDATE editora SET ed_nome=?, ed_pais=?, ed_morada=?, ed_cod_postal=?, ed_email=?, ed_tlm=? WHERE ed_cod=?',
      [ed_nome, ed_pais, ed_morada, codPostalDb, ed_email, ed_tlm, id]
    );
    
    res.json({ success: true, message: 'Editora updated successfully' });
  } catch (error) {
    console.error('Error updating editora:', error);
    res.status(500).json({ success: false, error: 'Failed to update editora' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM editora WHERE ed_cod = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Editora not found' });
    }
    
    res.json({ success: true, message: 'Editora deleted successfully' });
  } catch (error) {
    console.error('Error deleting editora:', error);
    res.status(500).json({ success: false, error: 'Failed to delete editora' });
  }
});

module.exports = router;





