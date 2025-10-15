<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// GET /api/utentes - Listar todos os utentes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        u.ut_cod,
        u.ut_nome,
        u.ut_email,
        u.ut_tlm,
        u.ut_morada,
        u.ut_cod_postal,
        cp.cod_localidade
      FROM utente u
      LEFT JOIN codigo_postal cp ON cp.cod_postal = u.ut_cod_postal
      ORDER BY u.ut_nome
    `);
    
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    console.error('Error fetching utentes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch utentes' });
  }
});

// GET /api/utentes/:id - Buscar utente por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT 
        u.*,
        cp.cod_localidade
      FROM utente u
      LEFT JOIN codigo_postal cp ON cp.cod_postal = u.ut_cod_postal
      WHERE u.ut_cod = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Utente not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching utente:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch utente' });
  }
});

// POST /api/utentes - Criar novo utente
router.post('/', validate(schemas.utente), async (req, res) => {
  try {
    const { ut_nome, ut_nif, ut_email, ut_tlm, ut_morada, ut_cod_postal } = req.body;
    
    // Validate codigo postal if provided
    let codPostalDb = null;
    if (ut_cod_postal) {
      const [codCheck] = await pool.execute(
        'SELECT cod_postal FROM codigo_postal WHERE cod_postal = ?',
        [ut_cod_postal]
      );
      if (codCheck.length > 0) {
        codPostalDb = ut_cod_postal;
      }
    }
    
    const [result] = await pool.execute(
      'INSERT INTO utente (ut_nome, ut_nif, ut_email, ut_tlm, ut_morada, ut_cod_postal) VALUES (?, ?, ?, ?, ?, ?)',
      [ut_nome, ut_nif, ut_email, ut_tlm, ut_morada, codPostalDb]
    );
    
    res.status(201).json({
      success: true,
      data: {
        ut_cod: result.insertId,
        ut_nome, ut_nif, ut_email, ut_tlm, ut_morada,
        ut_cod_postal: codPostalDb
      },
      message: 'Utente created successfully'
    });
  } catch (error) {
    console.error('Error creating utente:', error);
    res.status(500).json({ success: false, error: 'Failed to create utente' });
  }
});

// PUT /api/utentes/:id - Atualizar utente
router.put('/:id', validate(schemas.utente), async (req, res) => {
  try {
    const { id } = req.params;
    const { ut_nome, ut_nif, ut_email, ut_tlm, ut_morada, ut_cod_postal } = req.body;
    
    // Check if utente exists
    const [existing] = await pool.execute('SELECT ut_cod FROM utente WHERE ut_cod = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Utente not found' });
    }
    
    // Validate codigo postal if provided
    let codPostalDb = null;
    if (ut_cod_postal) {
      const [codCheck] = await pool.execute(
        'SELECT cod_postal FROM codigo_postal WHERE cod_postal = ?',
        [ut_cod_postal]
      );
      if (codCheck.length > 0) {
        codPostalDb = ut_cod_postal;
      }
    }
    
    await pool.execute(
      'UPDATE utente SET ut_nome=?, ut_nif=?, ut_email=?, ut_tlm=?, ut_morada=?, ut_cod_postal=? WHERE ut_cod=?',
      [ut_nome, ut_nif, ut_email, ut_tlm, ut_morada, codPostalDb, id]
    );
    
    res.json({ success: true, message: 'Utente updated successfully' });
  } catch (error) {
    console.error('Error updating utente:', error);
    res.status(500).json({ success: false, error: 'Failed to update utente' });
  }
});

// DELETE /api/utentes/:id - Deletar utente
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if utente has active requisicoes
    const [requisicoes] = await pool.execute(
      'SELECT COUNT(*) as count FROM requisicao WHERE re_ut_cod = ? AND (re_data_devolucao IS NULL OR re_data_devolucao = "")',
      [id]
    );
    
    if (requisicoes[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete utente with active requisicoes'
      });
    }
    
    const [result] = await pool.execute('DELETE FROM utente WHERE ut_cod = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Utente not found' });
    }
    
    res.json({ success: true, message: 'Utente deleted successfully' });
  } catch (error) {
    console.error('Error deleting utente:', error);
    res.status(500).json({ success: false, error: 'Failed to delete utente' });
  }
});

module.exports = router;






=======
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// GET /api/utentes - Listar todos os utentes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        u.ut_cod,
        u.ut_nome,
        u.ut_email,
        u.ut_tlm,
        u.ut_morada,
        u.ut_cod_postal,
        cp.cod_localidade
      FROM utente u
      LEFT JOIN codigo_postal cp ON cp.cod_postal = u.ut_cod_postal
      ORDER BY u.ut_nome
    `);
    
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    console.error('Error fetching utentes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch utentes' });
  }
});

// GET /api/utentes/:id - Buscar utente por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT 
        u.*,
        cp.cod_localidade
      FROM utente u
      LEFT JOIN codigo_postal cp ON cp.cod_postal = u.ut_cod_postal
      WHERE u.ut_cod = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Utente not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching utente:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch utente' });
  }
});

// POST /api/utentes - Criar novo utente
router.post('/', validate(schemas.utente), async (req, res) => {
  try {
    const { ut_nome, ut_nif, ut_email, ut_tlm, ut_morada, ut_cod_postal } = req.body;
    
    // Validate codigo postal if provided
    let codPostalDb = null;
    if (ut_cod_postal) {
      const [codCheck] = await pool.execute(
        'SELECT cod_postal FROM codigo_postal WHERE cod_postal = ?',
        [ut_cod_postal]
      );
      if (codCheck.length > 0) {
        codPostalDb = ut_cod_postal;
      }
    }
    
    const [result] = await pool.execute(
      'INSERT INTO utente (ut_nome, ut_nif, ut_email, ut_tlm, ut_morada, ut_cod_postal) VALUES (?, ?, ?, ?, ?, ?)',
      [ut_nome, ut_nif, ut_email, ut_tlm, ut_morada, codPostalDb]
    );
    
    res.status(201).json({
      success: true,
      data: {
        ut_cod: result.insertId,
        ut_nome, ut_nif, ut_email, ut_tlm, ut_morada,
        ut_cod_postal: codPostalDb
      },
      message: 'Utente created successfully'
    });
  } catch (error) {
    console.error('Error creating utente:', error);
    res.status(500).json({ success: false, error: 'Failed to create utente' });
  }
});

// PUT /api/utentes/:id - Atualizar utente
router.put('/:id', validate(schemas.utente), async (req, res) => {
  try {
    const { id } = req.params;
    const { ut_nome, ut_nif, ut_email, ut_tlm, ut_morada, ut_cod_postal } = req.body;
    
    // Check if utente exists
    const [existing] = await pool.execute('SELECT ut_cod FROM utente WHERE ut_cod = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Utente not found' });
    }
    
    // Validate codigo postal if provided
    let codPostalDb = null;
    if (ut_cod_postal) {
      const [codCheck] = await pool.execute(
        'SELECT cod_postal FROM codigo_postal WHERE cod_postal = ?',
        [ut_cod_postal]
      );
      if (codCheck.length > 0) {
        codPostalDb = ut_cod_postal;
      }
    }
    
    await pool.execute(
      'UPDATE utente SET ut_nome=?, ut_nif=?, ut_email=?, ut_tlm=?, ut_morada=?, ut_cod_postal=? WHERE ut_cod=?',
      [ut_nome, ut_nif, ut_email, ut_tlm, ut_morada, codPostalDb, id]
    );
    
    res.json({ success: true, message: 'Utente updated successfully' });
  } catch (error) {
    console.error('Error updating utente:', error);
    res.status(500).json({ success: false, error: 'Failed to update utente' });
  }
});

// DELETE /api/utentes/:id - Deletar utente
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if utente has active requisicoes
    const [requisicoes] = await pool.execute(
      'SELECT COUNT(*) as count FROM requisicao WHERE re_ut_cod = ? AND (re_data_devolucao IS NULL OR re_data_devolucao = "")',
      [id]
    );
    
    if (requisicoes[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete utente with active requisicoes'
      });
    }
    
    const [result] = await pool.execute('DELETE FROM utente WHERE ut_cod = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Utente not found' });
    }
    
    res.json({ success: true, message: 'Utente deleted successfully' });
  } catch (error) {
    console.error('Error deleting utente:', error);
    res.status(500).json({ success: false, error: 'Failed to delete utente' });
  }
});

module.exports = router;






>>>>>>> cdde7e74c145f3a7e1d3f77290ab03c7b8100859
