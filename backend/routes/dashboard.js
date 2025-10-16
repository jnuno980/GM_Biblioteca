<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/dashboard/stats - Obter estatísticas do dashboard
router.get('/stats', async (req, res) => {
  try {
    // Execute all queries in parallel for better performance
    const [
      livrosResult,
      exemplaresResult,
      exemplaresDisponiveisResult,
      utentesResult,
      emprestimosAtivosResult,
      requisicoesResult
    ] = await Promise.all([
      pool.execute('SELECT COUNT(*) as count FROM livro'),
      pool.execute('SELECT COUNT(*) as count FROM livro_exemplar'),
      pool.execute('SELECT COUNT(*) as count FROM livro_exemplar WHERE lex_disponivel = 1'),
      pool.execute('SELECT COUNT(*) as count FROM utente'),
      pool.execute('SELECT COUNT(*) as count FROM requisicao WHERE re_data_devolucao IS NULL OR re_data_devolucao = ""'),
      pool.execute('SELECT COUNT(*) as count FROM requisicao')
    ]);

    const stats = {
      livros: livrosResult[0][0].count,
      exemplares: exemplaresResult[0][0].count,
      exemplaresDisponiveis: exemplaresDisponiveisResult[0][0].count,
      utentes: utentesResult[0][0].count,
      emprestimosAtivos: emprestimosAtivosResult[0][0].count,
      requisicoes: requisicoesResult[0][0].count
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
});

// GET /api/dashboard/recent-activity - Atividade recente
router.get('/recent-activity', async (req, res) => {
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
      LIMIT 10
    `);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent activity'
    });
  }
});

// GET /api/dashboard/charts - Dados para gráficos
router.get('/charts', async (req, res) => {
  try {
    // Livros por género
    const [generosResult] = await pool.execute(`
      SELECT 
        COALESCE(l.li_genero, 'Sem género') as genero,
        COUNT(*) as count
      FROM livro l
      GROUP BY l.li_genero
      ORDER BY count DESC
    `);

    // Empréstimos por mês (últimos 12 meses)
    const [emprestimosResult] = await pool.execute(`
      SELECT 
        DATE_FORMAT(re_data_requisicao, '%Y-%m') as mes,
        COUNT(*) as count
      FROM requisicao
      WHERE re_data_requisicao >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(re_data_requisicao, '%Y-%m')
      ORDER BY mes
    `);

    // Top 10 livros mais emprestados
    const [topLivrosResult] = await pool.execute(`
      SELECT 
        l.li_titulo,
        COUNT(r.re_cod) as emprestimos
      FROM livro l
      JOIN livro_exemplar x ON x.lex_li_cod = l.li_cod
      JOIN requisicao r ON r.re_lex_cod = x.lex_cod
      GROUP BY l.li_cod, l.li_titulo
      ORDER BY emprestimos DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        livrosPorGenero: generosResult,
        emprestimosPorMes: emprestimosResult,
        topLivros: topLivrosResult
      }
    });
  } catch (error) {
    console.error('Error fetching charts data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch charts data'
    });
  }
});

module.exports = router;






=======
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/dashboard/stats - Obter estatísticas do dashboard
router.get('/stats', async (req, res) => {
  try {
    // Execute all queries in parallel for better performance
    const [
      livrosResult,
      exemplaresResult,
      exemplaresDisponiveisResult,
      utentesResult,
      emprestimosAtivosResult,
      requisicoesResult
    ] = await Promise.all([
      pool.execute('SELECT COUNT(*) as count FROM livro'),
      pool.execute('SELECT COUNT(*) as count FROM livro_exemplar'),
      pool.execute('SELECT COUNT(*) as count FROM livro_exemplar WHERE lex_disponivel = 1'),
      pool.execute('SELECT COUNT(*) as count FROM utente'),
      pool.execute('SELECT COUNT(*) as count FROM requisicao WHERE re_data_devolucao IS NULL OR re_data_devolucao = ""'),
      pool.execute('SELECT COUNT(*) as count FROM requisicao')
    ]);

    const stats = {
      livros: livrosResult[0][0].count,
      exemplares: exemplaresResult[0][0].count,
      exemplaresDisponiveis: exemplaresDisponiveisResult[0][0].count,
      utentes: utentesResult[0][0].count,
      emprestimosAtivos: emprestimosAtivosResult[0][0].count,
      requisicoes: requisicoesResult[0][0].count
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
});

// GET /api/dashboard/recent-activity - Atividade recente
router.get('/recent-activity', async (req, res) => {
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
      LIMIT 10
    `);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent activity'
    });
  }
});

// GET /api/dashboard/charts - Dados para gráficos
router.get('/charts', async (req, res) => {
  try {
    // Livros por género
    const [generosResult] = await pool.execute(`
      SELECT 
        COALESCE(l.li_genero, 'Sem género') as genero,
        COUNT(*) as count
      FROM livro l
      GROUP BY l.li_genero
      ORDER BY count DESC
    `);

    // Empréstimos por mês (últimos 12 meses)
    const [emprestimosResult] = await pool.execute(`
      SELECT 
        DATE_FORMAT(re_data_requisicao, '%Y-%m') as mes,
        COUNT(*) as count
      FROM requisicao
      WHERE re_data_requisicao >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(re_data_requisicao, '%Y-%m')
      ORDER BY mes
    `);

    // Top 10 livros mais emprestados
    const [topLivrosResult] = await pool.execute(`
      SELECT 
        l.li_titulo,
        COUNT(r.re_cod) as emprestimos
      FROM livro l
      JOIN livro_exemplar x ON x.lex_li_cod = l.li_cod
      JOIN requisicao r ON r.re_lex_cod = x.lex_cod
      GROUP BY l.li_cod, l.li_titulo
      ORDER BY emprestimos DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        livrosPorGenero: generosResult,
        emprestimosPorMes: emprestimosResult,
        topLivros: topLivrosResult
      }
    });
  } catch (error) {
    console.error('Error fetching charts data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch charts data'
    });
  }
});

module.exports = router;






>>>>>>> cdde7e74c145f3a7e1d3f77290ab03c7b8100859

