-- Desativar Row Level Security (RLS) para permitir acesso público
-- Execute este script no Supabase SQL Editor

-- Desativar RLS em todas as tabelas
ALTER TABLE codigo_postal DISABLE ROW LEVEL SECURITY;
ALTER TABLE editora DISABLE ROW LEVEL SECURITY;
ALTER TABLE autor DISABLE ROW LEVEL SECURITY;
ALTER TABLE genero DISABLE ROW LEVEL SECURITY;
ALTER TABLE livro DISABLE ROW LEVEL SECURITY;
ALTER TABLE livro_exemplar DISABLE ROW LEVEL SECURITY;
ALTER TABLE utente DISABLE ROW LEVEL SECURITY;
ALTER TABLE requisicao DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Enable read access for all users" ON codigo_postal;
DROP POLICY IF EXISTS "Enable read access for all users" ON editora;
DROP POLICY IF EXISTS "Enable read access for all users" ON autor;
DROP POLICY IF EXISTS "Enable read access for all users" ON genero;
DROP POLICY IF EXISTS "Enable read access for all users" ON livro;
DROP POLICY IF EXISTS "Enable read access for all users" ON livro_exemplar;
DROP POLICY IF EXISTS "Enable read access for all users" ON utente;
DROP POLICY IF EXISTS "Enable read access for all users" ON requisicao;

DROP POLICY IF EXISTS "Enable insert for all users" ON codigo_postal;
DROP POLICY IF EXISTS "Enable insert for all users" ON editora;
DROP POLICY IF EXISTS "Enable insert for all users" ON autor;
DROP POLICY IF EXISTS "Enable insert for all users" ON genero;
DROP POLICY IF EXISTS "Enable insert for all users" ON livro;
DROP POLICY IF EXISTS "Enable insert for all users" ON livro_exemplar;
DROP POLICY IF EXISTS "Enable insert for all users" ON utente;
DROP POLICY IF EXISTS "Enable insert for all users" ON requisicao;

DROP POLICY IF EXISTS "Enable update for all users" ON codigo_postal;
DROP POLICY IF EXISTS "Enable update for all users" ON editora;
DROP POLICY IF EXISTS "Enable update for all users" ON autor;
DROP POLICY IF EXISTS "Enable update for all users" ON genero;
DROP POLICY IF EXISTS "Enable update for all users" ON livro;
DROP POLICY IF EXISTS "Enable update for all users" ON livro_exemplar;
DROP POLICY IF EXISTS "Enable update for all users" ON utente;
DROP POLICY IF EXISTS "Enable update for all users" ON requisicao;

DROP POLICY IF EXISTS "Enable delete for all users" ON codigo_postal;
DROP POLICY IF EXISTS "Enable delete for all users" ON editora;
DROP POLICY IF EXISTS "Enable delete for all users" ON autor;
DROP POLICY IF EXISTS "Enable delete for all users" ON genero;
DROP POLICY IF EXISTS "Enable delete for all users" ON livro;
DROP POLICY IF EXISTS "Enable delete for all users" ON livro_exemplar;
DROP POLICY IF EXISTS "Enable delete for all users" ON utente;
DROP POLICY IF EXISTS "Enable delete for all users" ON requisicao;
