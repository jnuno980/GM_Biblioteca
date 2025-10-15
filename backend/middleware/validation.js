<<<<<<< HEAD
const Joi = require('joi');

// Validation schemas
const livroSchema = Joi.object({
  li_titulo: Joi.string().max(200).required(),
  li_ano: Joi.number().integer().min(1000).max(2100).allow(null),
  li_edicao: Joi.string().max(20).allow(null, ''),
  li_isbn: Joi.string().max(20).allow(null, ''),
  li_editora: Joi.number().integer().positive().allow(null),
  li_autor: Joi.number().integer().positive().allow(null),
  li_genero: Joi.string().max(20).allow(null, '')
});

const exemplarSchema = Joi.object({
  lex_li_cod: Joi.number().integer().positive().required(),
  lex_estado: Joi.string().valid('Novo', 'Bom', 'Usado', 'Danificado').default('Bom'),
  lex_disponivel: Joi.boolean().default(true)
});

const utenteSchema = Joi.object({
  ut_nome: Joi.string().max(120).required(),
  ut_nif: Joi.string().max(15).allow(null, ''),
  ut_email: Joi.string().email().max(120).allow(null, ''),
  ut_tlm: Joi.string().max(20).allow(null, ''),
  ut_morada: Joi.string().max(150).allow(null, ''),
  ut_cod_postal: Joi.string().max(10).allow(null, '')
});

const requisicaoSchema = Joi.object({
  re_ut_cod: Joi.number().integer().positive().required(),
  re_lex_cod: Joi.number().integer().positive().required(),
  re_data_requisicao: Joi.date().required(),
  re_data_devolucao: Joi.date().allow(null)
});

const editoraSchema = Joi.object({
  ed_nome: Joi.string().max(120).required(),
  ed_pais: Joi.string().max(60).required(),
  ed_morada: Joi.string().max(150).allow(null, ''),
  ed_cod_postal: Joi.string().max(10).allow(null, ''),
  ed_email: Joi.string().email().max(120).allow(null, ''),
  ed_tlm: Joi.string().max(20).allow(null, '')
});

const autorSchema = Joi.object({
  au_nome: Joi.string().max(120).required(),
  au_pais: Joi.string().max(60).allow(null, '')
});

const generoSchema = Joi.object({
  ge_genero: Joi.string().max(20).required()
});

const codigoPostalSchema = Joi.object({
  cod_postal: Joi.string().max(10).required(),
  cod_localidade: Joi.string().max(80).required()
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    req.body = value;
    next();
  };
};

module.exports = {
  validate,
  schemas: {
    livro: livroSchema,
    exemplar: exemplarSchema,
    utente: utenteSchema,
    requisicao: requisicaoSchema,
    editora: editoraSchema,
    autor: autorSchema,
    genero: generoSchema,
    codigoPostal: codigoPostalSchema
  }
};






=======
const Joi = require('joi');

// Validation schemas
const livroSchema = Joi.object({
  li_titulo: Joi.string().max(200).required(),
  li_ano: Joi.number().integer().min(1000).max(2100).allow(null),
  li_edicao: Joi.string().max(20).allow(null, ''),
  li_isbn: Joi.string().max(20).allow(null, ''),
  li_editora: Joi.number().integer().positive().allow(null),
  li_autor: Joi.number().integer().positive().allow(null),
  li_genero: Joi.string().max(20).allow(null, '')
});

const exemplarSchema = Joi.object({
  lex_li_cod: Joi.number().integer().positive().required(),
  lex_estado: Joi.string().valid('Novo', 'Bom', 'Usado', 'Danificado').default('Bom'),
  lex_disponivel: Joi.boolean().default(true)
});

const utenteSchema = Joi.object({
  ut_nome: Joi.string().max(120).required(),
  ut_nif: Joi.string().max(15).allow(null, ''),
  ut_email: Joi.string().email().max(120).allow(null, ''),
  ut_tlm: Joi.string().max(20).allow(null, ''),
  ut_morada: Joi.string().max(150).allow(null, ''),
  ut_cod_postal: Joi.string().max(10).allow(null, '')
});

const requisicaoSchema = Joi.object({
  re_ut_cod: Joi.number().integer().positive().required(),
  re_lex_cod: Joi.number().integer().positive().required(),
  re_data_requisicao: Joi.date().required(),
  re_data_devolucao: Joi.date().allow(null)
});

const editoraSchema = Joi.object({
  ed_nome: Joi.string().max(120).required(),
  ed_pais: Joi.string().max(60).required(),
  ed_morada: Joi.string().max(150).allow(null, ''),
  ed_cod_postal: Joi.string().max(10).allow(null, ''),
  ed_email: Joi.string().email().max(120).allow(null, ''),
  ed_tlm: Joi.string().max(20).allow(null, '')
});

const autorSchema = Joi.object({
  au_nome: Joi.string().max(120).required(),
  au_pais: Joi.string().max(60).allow(null, '')
});

const generoSchema = Joi.object({
  ge_genero: Joi.string().max(20).required()
});

const codigoPostalSchema = Joi.object({
  cod_postal: Joi.string().max(10).required(),
  cod_localidade: Joi.string().max(80).required()
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    req.body = value;
    next();
  };
};

module.exports = {
  validate,
  schemas: {
    livro: livroSchema,
    exemplar: exemplarSchema,
    utente: utenteSchema,
    requisicao: requisicaoSchema,
    editora: editoraSchema,
    autor: autorSchema,
    genero: generoSchema,
    codigoPostal: codigoPostalSchema
  }
};






>>>>>>> cdde7e74c145f3a7e1d3f77290ab03c7b8100859
