const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// GET /api/requisicoes - Listar todas as requisições
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        r.re_cod,
        r.re_data_requisicao,
        r.re_data_devolucao,
        u.ut_nome as utente_nome,
        l.li_titulo as livro_titulo,
        CASE 
          WHEN r.re_data_devolucao IS NULL OR r.re_data_devolucao = '' THEN 'emprestado'
          ELSE 'devolvido'
        END as status
      FROM requisicao r
      JOIN utente u ON u.ut_cod = r.re_ut_cod
      JOIN livro_exemplar x ON x.lex_cod = r.re_lex_cod
      JOIN livro l ON l.li_cod = x.lex_li_cod
      ORDER BY r.re_cod DESC
    `);
    
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error fetching requisicoes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch requisicoes'
    });
  }
});

// GET /api/requisicoes/:id - Buscar requisição por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT 
        r.*,
        u.ut_nome as utente_nome,
        l.li_titulo as livro_titulo,
        x.lex_cod as exemplar_cod
      FROM requisicao r
      JOIN utente u ON u.ut_cod = r.re_ut_cod
      JOIN livro_exemplar x ON x.lex_cod = r.re_lex_cod
      JOIN livro l ON l.li_cod = x.lex_li_cod
      WHERE r.re_cod = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Requisição not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching requisicao:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch requisicao'
    });
  }
});

// POST /api/requisicoes - Criar nova requisição
router.post('/', validate(schemas.requisicao), async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { re_ut_cod, re_lex_cod, re_data_requisicao, re_data_devolucao } = req.body;
    
    // Verificar se a requisição já existe
    const exists = await connection.execute('SELECT COUNT(*) as count FROM requisicao');
    if (exists[0][0].count === 0) {
      await connection.execute('ALTER TABLE requisicao AUTO_INCREMENT = 1');
    }
    
    // Verificar disponibilidade do exemplar
    const [exemplarCheck] = await connection.execute(
      'SELECT lex_disponivel FROM livro_exemplar WHERE lex_cod = ? FOR UPDATE',
      [re_lex_cod]
    );
    
    if (exemplarCheck.length === 0) {
      throw new Error('Exemplar not found');
    }
    
    if (exemplarCheck[0].lex_disponivel !== 1) {
      throw new Error('Exemplar not available');
    }
    
    // Criar requisição
    const [result] = await connection.execute(
      'INSERT INTO requisicao (re_ut_cod, re_lex_cod, re_data_requisicao, re_data_devolucao) VALUES (?, ?, ?, ?)',
      [re_ut_cod, re_lex_cod, re_data_requisicao, re_data_devolucao || null]
    );
    
    // Marcar exemplar como indisponível
    await connection.execute(
      'UPDATE livro_exemplar SET lex_disponivel = 0 WHERE lex_cod = ?',
      [re_lex_cod]
    );
    
    await connection.commit();
    
    res.status(201).json({
      success: true,
      data: {
        re_cod: result.insertId,
        re_ut_cod,
        re_lex_cod,
        re_data_requisicao,
        re_data_devolucao
      },
      message: 'Requisição created successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating requisicao:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create requisicao'
    });
  } finally {
    connection.release();
  }
});

// PUT /api/requisicoes/:id/return - Registrar devolução
router.put('/:id/return', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const { re_data_devolucao } = req.body;
    
    // Buscar requisição
    const [requisicao] = await connection.execute(
      'SELECT re_lex_cod FROM requisicao WHERE re_cod = ? AND (re_data_devolucao IS NULL OR re_data_devolucao = "")',
      [id]
    );
    
    if (requisicao.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Requisição not found or already returned'
      });
    }
    
    const lex_cod = requisicao[0].re_lex_cod;
    
    // Atualizar requisição com data de devolução
    await connection.execute(
      'UPDATE requisicao SET re_data_devolucao = ? WHERE re_cod = ?',
      [re_data_devolucao || new Date().toISOString().split('T')[0], id]
    );
    
    // Marcar exemplar como disponível
    await connection.execute(
      'UPDATE livro_exemplar SET lex_disponivel = 1 WHERE lex_cod = ?',
      [lex_cod]
    );
    
    await connection.commit();
    
    // Buscar novos totais para retornar
    const [
      totalRequisicoes,
      exemplaresDisponiveis,
      exemplaresTotal
    ] = await Promise.all([
      connection.execute('SELECT COUNT(*) as count FROM requisicao'),
      connection.execute('SELECT COUNT(*) as count FROM livro_exemplar WHERE lex_disponivel = 1'),
      connection.execute('SELECT COUNT(*) as count FROM livro_exemplar')
    ]);
    
    res.json({
      success: true,
      message: 'Devolução registrada com sucesso',
      data: {
        totalRequisicoes: totalRequisicoes[0][0].count,
        exemplaresDisponiveis: exemplaresDisponiveis[0][0].count,
        exemplaresTotal: exemplaresTotal[0][0].count
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error processing return:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process return'
    });
  } finally {
    connection.release();
  }
});

// DELETE /api/requisicoes/:id - Deletar requisição
router.delete('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    
    // Buscar requisição
    const [requisicao] = await connection.execute(
      'SELECT re_lex_cod FROM requisicao WHERE re_cod = ?',
      [id]
    );
    
    if (requisicao.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Requisição not found'
      });
    }
    
    const lex_cod = requisicao[0].re_lex_cod;
    
    // Deletar requisição
    await connection.execute('DELETE FROM requisicao WHERE re_cod = ?', [id]);
    
    // Marcar exemplar como disponível
    await connection.execute(
      'UPDATE livro_exemplar SET lex_disponivel = 1 WHERE lex_cod = ?',
      [lex_cod]
    );
    
    await connection.commit();
    
    res.json({
      success: true,
      message: 'Requisição deleted successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting requisicao:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete requisicao'
    });
  } finally {
    connection.release();
  }
});

module.exports = router;






