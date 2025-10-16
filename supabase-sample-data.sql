-- Dados de exemplo para GM Biblioteca
-- Execute este script no Supabase SQL Editor após criar as tabelas

-- ========================= 
-- Inserir Códigos Postais
-- ========================= 
INSERT INTO codigo_postal (cod_postal, cod_localidade) VALUES
('2000-123', 'Santarém'),
('2000-456', 'Santarém'),
('1000-001', 'Lisboa'),
('1000-002', 'Lisboa'),
('4000-001', 'Porto'),
('4000-002', 'Porto'),
('3000-001', 'Coimbra'),
('3000-002', 'Coimbra');

-- ========================= 
-- Inserir Géneros
-- ========================= 
INSERT INTO genero (ge_genero) VALUES
('Ficção'),
('Romance'),
('Mistério'),
('Aventura'),
('História'),
('Ciência'),
('Matemática'),
('Literatura'),
('Poesia'),
('Biografia');

-- ========================= 
-- Inserir Autores
-- ========================= 
INSERT INTO autor (au_nome, au_pais) VALUES
('José Saramago', 'Portugal'),
('Fernando Pessoa', 'Portugal'),
('Eça de Queirós', 'Portugal'),
('Sophia de Mello Breyner', 'Portugal'),
('António Lobo Antunes', 'Portugal'),
('Agatha Christie', 'Reino Unido'),
('J.K. Rowling', 'Reino Unido'),
('George Orwell', 'Reino Unido'),
('Isaac Asimov', 'Estados Unidos'),
('Carl Sagan', 'Estados Unidos');

-- ========================= 
-- Inserir Editoras
-- ========================= 
INSERT INTO editora (ed_nome, ed_pais, ed_morada, ed_cod_postal, ed_email, ed_tlm) VALUES
('Porto Editora', 'Portugal', 'Rua do Campo Alegre, 416', '4150-180', 'info@portoeditora.pt', '+351 22 608 83 00'),
('Leya', 'Portugal', 'Rua Cidade de Córdova, 2', '2610-038', 'info@leya.com', '+351 21 413 70 00'),
('Bertrand', 'Portugal', 'Rua Anchieta, 1', '1200-023', 'info@bertrand.pt', '+351 21 321 00 00'),
('Dom Quixote', 'Portugal', 'Rua da Escola Politécnica, 147', '1250-096', 'info@domquixote.pt', '+351 21 321 00 00'),
('Penguin Random House', 'Reino Unido', '80 Strand, London', 'WC2R 0RL', 'info@penguinrandomhouse.co.uk', '+44 20 7840 8400');

-- ========================= 
-- Inserir Livros
-- ========================= 
INSERT INTO livro (li_titulo, li_ano, li_edicao, li_isbn, li_editora, li_autor, li_genero) VALUES
('Memorial do Convento', 1982, '1ª Edição', '978-972-0-04126-5', 1, 1, 'Ficção'),
('O Livro do Desassossego', 1982, '1ª Edição', '978-972-0-04127-2', 1, 2, 'Literatura'),
('Os Maias', 1888, '1ª Edição', '978-972-0-04128-9', 2, 3, 'Romance'),
('A Fada Oriana', 1958, '1ª Edição', '978-972-0-04129-6', 2, 4, 'Ficção'),
('Memória de Elefante', 1979, '1ª Edição', '978-972-0-04130-2', 3, 5, 'Ficção'),
('Assassinato no Expresso do Oriente', 1934, '1ª Edição', '978-972-0-04131-9', 4, 6, 'Mistério'),
('Harry Potter e a Pedra Filosofal', 1997, '1ª Edição', '978-972-0-04132-6', 4, 7, 'Ficção'),
('1984', 1949, '1ª Edição', '978-972-0-04133-3', 5, 8, 'Ficção'),
('Fundação', 1951, '1ª Edição', '978-972-0-04134-0', 5, 9, 'Ciência'),
('Cosmos', 1980, '1ª Edição', '978-972-0-04135-7', 5, 10, 'Ciência');

-- ========================= 
-- Inserir Exemplares
-- ========================= 
INSERT INTO livro_exemplar (lex_li_cod, lex_estado, lex_disponivel) VALUES
(1, 'Bom', true),
(1, 'Usado', true),
(1, 'Novo', true),
(2, 'Bom', true),
(2, 'Usado', false),
(3, 'Bom', true),
(3, 'Novo', true),
(4, 'Bom', true),
(4, 'Usado', true),
(5, 'Bom', true),
(6, 'Bom', true),
(6, 'Usado', true),
(7, 'Novo', true),
(7, 'Bom', true),
(8, 'Bom', true),
(9, 'Bom', true),
(9, 'Usado', true),
(10, 'Bom', true);

-- ========================= 
-- Inserir Utentes
-- ========================= 
INSERT INTO utente (ut_nome, ut_nif, ut_email, ut_tlm, ut_morada, ut_cod_postal) VALUES
('João Silva', '123456789', 'joao.silva@email.com', '912345678', 'Rua das Flores, 123', '2000-123'),
('Maria Santos', '987654321', 'maria.santos@email.com', '923456789', 'Avenida da Liberdade, 456', '1000-001'),
('Pedro Costa', '456789123', 'pedro.costa@email.com', '934567890', 'Rua do Comércio, 789', '4000-001'),
('Ana Oliveira', '789123456', 'ana.oliveira@email.com', '945678901', 'Praça da República, 321', '3000-001'),
('Carlos Ferreira', '321654987', 'carlos.ferreira@email.com', '956789012', 'Rua da Escola, 654', '2000-456'),
('Sofia Martins', '654987321', 'sofia.martins@email.com', '967890123', 'Avenida Central, 987', '1000-002'),
('Miguel Rodrigues', '147258369', 'miguel.rodrigues@email.com', '978901234', 'Rua Nova, 147', '4000-002'),
('Inês Pereira', '369258147', 'ines.pereira@email.com', '989012345', 'Largo da Igreja, 258', '3000-002');

-- ========================= 
-- Inserir Requisições (algumas já devolvidas, outras em curso)
-- ========================= 
INSERT INTO requisicao (re_ut_cod, re_lex_cod, re_data_requisicao, re_data_devolucao) VALUES
(1, 1, '2024-01-15', '2024-01-30'),
(1, 4, '2024-02-01', '2024-02-15'),
(2, 2, '2024-02-10', NULL),
(2, 6, '2024-02-12', '2024-02-28'),
(3, 3, '2024-02-15', NULL),
(4, 7, '2024-02-20', NULL),
(5, 8, '2024-02-25', '2024-03-10'),
(6, 9, '2024-03-01', NULL),
(7, 10, '2024-03-05', NULL),
(8, 11, '2024-03-10', '2024-03-25');
