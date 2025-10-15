const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// GET /api/exemplares - Listar todos os exemplares
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        x.lex_cod,
        x.lex_estado,
        x.lex_disponivel,
        l.li_titulo,
        l.li_cod as livro_cod
      FROM livro_exemplar x
      JOIN livro l ON l.li_cod = x.lex_li_cod
      ORDER BY l.li_titulo, x.lex_cod
    `);
    
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    console.error('Error fetching exemplares:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch exemplares' });
  }
});

// POST /api/exemplares - Criar novo exemplar
router.post('/', validate(schemas.exemplar), async (req, res) => {
  try {
    const { lex_li_cod, lex_estado, lex_disponivel } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO livro_exemplar (lex_li_cod, lex_estado, lex_disponivel) VALUES (?, ?, ?)',
      [lex_li_cod, lex_estado, lex_disponivel]
    );
    
    res.status(201).json({
      success: true,
      data: { lex_cod: result.insertId, lex_li_cod, lex_estado, lex_disponivel },
      message: 'Exemplar created successfully'
    });
  } catch (error) {
    console.error('Error creating exemplar:', error);
    res.status(500).json({ success: false, error: 'Failed to create exemplar' });
  }
});

// PUT /api/exemplares/:id/toggle - Alternar disponibilidade
router.put('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(
      'UPDATE livro_exemplar SET lex_disponivel = NOT lex_disponivel WHERE lex_cod = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Exemplar not found' });
    }
    
    res.json({ success: true, message: 'Exemplar availability toggled' });
  } catch (error) {
    console.error('Error toggling exemplar:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle exemplar' });
  }
});

// DELETE /api/exemplares/:id - Deletar exemplar
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if exemplar has active requisicoes
    const [requisicoes] = await pool.execute(
      'SELECT COUNT(*) as count FROM requisicao WHERE re_lex_cod = ? AND (re_data_devolucao IS NULL OR re_data_devolucao = "")',
      [id]
    );
    
    if (requisicoes[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete exemplar with active requisicoes'
      });
    }
    
    const [result] = await pool.execute('DELETE FROM livro_exemplar WHERE lex_cod = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Exemplar not found' });
    }
    
    res.json({ success: true, message: 'Exemplar deleted successfully' });
  } catch (error) {
    console.error('Error deleting exemplar:', error);
    res.status(500).json({ success: false, error: 'Failed to delete exemplar' });
  }
});

module.exports = router;



