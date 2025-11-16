-- Script para inserir dados de exemplo no Supabase

-- Inserir Géneros
INSERT INTO public.genero (ge_genero) VALUES
('Ficção'),
('Romance'),
('Fantasia'),
('Ciência'),
('História'),
('Biografia'),
('Poesia'),
('Thriller')
ON CONFLICT (ge_genero) DO NOTHING;

-- Inserir Autores
INSERT INTO public.autor (au_nome, au_pais) VALUES
('José Saramago', 'Portugal'),
('Fernando Pessoa', 'Portugal'),
('Eça de Queirós', 'Portugal'),
('Agatha Christie', 'Reino Unido'),
('Gabriel Garcia Marquez', 'Colômbia')
ON CONFLICT (au_cod) DO NOTHING;

-- Inserir Editoras
INSERT INTO public.editora (ed_nome, ed_pais, ed_morada, ed_email) VALUES
('Porto Editora', 'Portugal', 'Rua da Restauração, 365', 'info@portoeditora.pt'),
('Leya', 'Portugal', 'Rua Cidade de Córdova, 2', 'geral@leya.com'),
('Penguin Random House', 'Reino Unido', '20 Vauxhall Bridge Rd', 'contact@penguinrandomhouse.co.uk')
ON CONFLICT (ed_cod) DO NOTHING;

-- Inserir Livros (usando subqueries para obter IDs corretos)
INSERT INTO public.livro (li_titulo, li_ano, li_edicao, li_isbn, li_editora, li_autor, li_genero) VALUES
('Ensaio Sobre a Cegueira', 1995, '1ª Edição', '978-972-0-04400-1', 
 (SELECT ed_cod FROM public.editora WHERE ed_nome = 'Porto Editora' LIMIT 1),
 (SELECT au_cod FROM public.autor WHERE au_nome = 'José Saramago' LIMIT 1),
 'Ficção'),
('O Ano da Morte de Ricardo Reis', 1984, '2ª Edição', '978-972-0-04401-8',
 (SELECT ed_cod FROM public.editora WHERE ed_nome = 'Porto Editora' LIMIT 1),
 (SELECT au_cod FROM public.autor WHERE au_nome = 'José Saramago' LIMIT 1),
 'Romance'),
('Mensagem', 1934, 'Edição Clássica', '978-972-0-04402-5',
 (SELECT ed_cod FROM public.editora WHERE ed_nome = 'Leya' LIMIT 1),
 (SELECT au_cod FROM public.autor WHERE au_nome = 'Fernando Pessoa' LIMIT 1),
 'Poesia'),
('Os Maias', 1888, 'Edição de Bolso', '978-972-0-04403-2',
 (SELECT ed_cod FROM public.editora WHERE ed_nome = 'Leya' LIMIT 1),
 (SELECT au_cod FROM public.autor WHERE au_nome = 'Eça de Queirós' LIMIT 1),
 'Romance'),
('Crime no Expresso do Oriente', 1934, 'Edição Especial', '978-972-0-04404-9',
 (SELECT ed_cod FROM public.editora WHERE ed_nome = 'Penguin Random House' LIMIT 1),
 (SELECT au_cod FROM public.autor WHERE au_nome = 'Agatha Christie' LIMIT 1),
 'Thriller')
ON CONFLICT (li_cod) DO NOTHING;

-- Inserir Utentes
INSERT INTO public.utente (ut_nome, ut_nif, ut_email, ut_tlm) VALUES
('Ana Silva', '123456789', 'ana.silva@email.com', '912345678'),
('Bruno Costa', '987654321', 'bruno.costa@email.com', '931234567'),
('Carla Dias', '111222333', 'carla.dias@email.com', '961234567')
ON CONFLICT (ut_cod) DO NOTHING;

-- Inserir Exemplares (usando subqueries para obter IDs corretos)
INSERT INTO public.livro_exemplar (lex_li_cod, lex_estado, lex_disponivel) VALUES
((SELECT li_cod FROM public.livro WHERE li_titulo = 'Ensaio Sobre a Cegueira' LIMIT 1), 'Bom', true),
((SELECT li_cod FROM public.livro WHERE li_titulo = 'Ensaio Sobre a Cegueira' LIMIT 1), 'Usado', true),
((SELECT li_cod FROM public.livro WHERE li_titulo = 'O Ano da Morte de Ricardo Reis' LIMIT 1), 'Novo', true),
((SELECT li_cod FROM public.livro WHERE li_titulo = 'Mensagem' LIMIT 1), 'Bom', true),
((SELECT li_cod FROM public.livro WHERE li_titulo = 'Os Maias' LIMIT 1), 'Usado', true),
((SELECT li_cod FROM public.livro WHERE li_titulo = 'Crime no Expresso do Oriente' LIMIT 1), 'Novo', true)
ON CONFLICT (lex_cod) DO NOTHING;

-- Inserir Requisições (usando subqueries para obter IDs corretos)
INSERT INTO public.requisicao (re_ut_cod, re_lex_cod, re_data_requisicao, re_data_devolucao) VALUES
((SELECT ut_cod FROM public.utente WHERE ut_nome = 'Ana Silva' LIMIT 1), 
 (SELECT lex_cod FROM public.livro_exemplar WHERE lex_li_cod = (SELECT li_cod FROM public.livro WHERE li_titulo = 'Ensaio Sobre a Cegueira' LIMIT 1) AND lex_estado = 'Bom' LIMIT 1), 
 '2023-01-10', '2023-01-20'),
((SELECT ut_cod FROM public.utente WHERE ut_nome = 'Bruno Costa' LIMIT 1), 
 (SELECT lex_cod FROM public.livro_exemplar WHERE lex_li_cod = (SELECT li_cod FROM public.livro WHERE li_titulo = 'O Ano da Morte de Ricardo Reis' LIMIT 1) LIMIT 1), 
 '2023-02-01', NULL),
((SELECT ut_cod FROM public.utente WHERE ut_nome = 'Carla Dias' LIMIT 1), 
 (SELECT lex_cod FROM public.livro_exemplar WHERE lex_li_cod = (SELECT li_cod FROM public.livro WHERE li_titulo = 'Mensagem' LIMIT 1) LIMIT 1), 
 '2023-03-05', '2023-03-15')
ON CONFLICT (re_cod) DO NOTHING;
