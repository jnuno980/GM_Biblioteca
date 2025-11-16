const express = require('express');
const router = express.Router();
const { supabaseAPI } = require('../config/database');
const { validate, schemas } = require('../middleware/validation');

// GET /api/livros - Listar todos os livros
router.get('/', async (req, res) => {
  try {
    const data = await supabaseAPI.select('livro', {
      order: { column: 'li_titulo', ascending: true }
    });
    
    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0
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
    
    const data = await supabaseAPI.select('livro', {
      filters: { li_cod: id }
    });
    
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
      const existing = await supabaseAPI.select('livro', {
        select: 'li_cod',
        filters: { li_isbn: li_isbn }
      });
      
      if (existing && existing.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'ISBN already exists'
        });
      }
    }
    
    const data = await supabaseAPI.insert('livro', {
      li_titulo,
      li_ano,
      li_edicao,
      li_isbn,
      li_editora,
      li_autor,
      li_genero
    });
    
    res.status(201).json({
      success: true,
      data: data[0],
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
    
    // Check if ISBN already exists (excluding current livro)
    if (li_isbn) {
      const existing = await supabaseAPI.select('livro', {
        select: 'li_cod',
        filters: { li_isbn: li_isbn }
      });
      
      if (existing && existing.length > 0 && existing[0].li_cod != id) {
        return res.status(400).json({
          success: false,
          error: 'ISBN already exists'
        });
      }
    }
    
    const data = await supabaseAPI.update('livro', {
      li_titulo,
      li_ano,
      li_edicao,
      li_isbn,
      li_editora,
      li_autor,
      li_genero
    }, { li_cod: id });
    
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Livro not found'
      });
    }
    
    res.json({
      success: true,
      data: data[0],
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
    const exemplares = await supabaseAPI.select('livro_exemplar', {
      select: 'lex_cod',
      filters: { lex_li_cod: id }
    });
    
    if (exemplares && exemplares.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete livro with existing exemplares'
      });
    }
    
    const data = await supabaseAPI.delete('livro', { li_cod: id });
    
    if (!data || data.length === 0) {
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