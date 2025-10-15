const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// CRUD operations for Géneros
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM genero ORDER BY ge_genero');
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    console.error('Error fetching generos:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch generos' });
  }
});

router.post('/', validate(schemas.genero), async (req, res) => {
  try {
    const { ge_genero } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO genero (ge_genero) VALUES (?)',
      [ge_genero]
    );
    
    res.status(201).json({
      success: true,
      data: { ge_genero },
      message: 'Género created successfully'
    });
  } catch (error) {
    console.error('Error creating genero:', error);
    res.status(500).json({ success: false, error: 'Failed to create genero' });
  }
});

router.delete('/:genero', async (req, res) => {
  try {
    const { genero } = req.params;
    
    const [result] = await pool.execute('DELETE FROM genero WHERE ge_genero = ?', [genero]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Género not found' });
    }
    
    res.json({ success: true, message: 'Género deleted successfully' });
  } catch (error) {
    console.error('Error deleting genero:', error);
    res.status(500).json({ success: false, error: 'Failed to delete genero' });
  }
});

module.exports = router;






