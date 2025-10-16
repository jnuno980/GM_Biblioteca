-- Supabase Schema for GM Biblioteca
-- Execute this in Supabase SQL Editor

-- ========================= 
-- Tabela: codigo_postal 
-- ========================= 
CREATE TABLE codigo_postal ( 
  cod_postal     VARCHAR(10)  NOT NULL,  -- ex: '2000-123' 
  cod_localidade VARCHAR(80)  NOT NULL, 
  PRIMARY KEY (cod_postal) 
);

-- ========================= 
-- Tabela: editora 
-- ========================= 
CREATE TABLE editora ( 
  ed_cod        SERIAL PRIMARY KEY, 
  ed_nome       VARCHAR(120)  NOT NULL, 
  ed_pais       VARCHAR(60)   NOT NULL, 
  ed_morada     VARCHAR(150), 
  ed_cod_postal VARCHAR(10), 
  ed_email      VARCHAR(120), 
  ed_tlm        VARCHAR(20), 
  CONSTRAINT fk_editora_cod_postal 
    FOREIGN KEY (ed_cod_postal) REFERENCES codigo_postal (cod_postal) 
      ON UPDATE CASCADE ON DELETE SET NULL 
);

-- ========================= 
-- Tabela: autor 
-- ========================= 
CREATE TABLE autor ( 
  au_cod   SERIAL PRIMARY KEY, 
  au_nome  VARCHAR(120)  NOT NULL, 
  au_pais  VARCHAR(60)   
);

-- ========================= 
-- Tabela: genero 
-- ========================= 
CREATE TABLE genero ( 
  ge_genero VARCHAR(20) NOT NULL PRIMARY KEY
);

-- ========================= 
-- Tabela: livro 
-- ========================= 
CREATE TABLE livro ( 
  li_cod      SERIAL PRIMARY KEY, 
  li_titulo   VARCHAR(200)  NOT NULL, 
  li_ano      INTEGER, 
  li_edicao   VARCHAR(20), 
  li_isbn     VARCHAR(20) UNIQUE, 
  li_editora  INTEGER, 
  li_autor    INTEGER, 
  li_genero   VARCHAR(20), 
  CONSTRAINT fk_livro_editora 
    FOREIGN KEY (li_editora) REFERENCES editora (ed_cod) 
      ON UPDATE CASCADE ON DELETE SET NULL, 
  CONSTRAINT fk_livro_autor 
    FOREIGN KEY (li_autor) REFERENCES autor (au_cod) 
      ON UPDATE CASCADE ON DELETE SET NULL, 
  CONSTRAINT fk_livro_genero 
    FOREIGN KEY (li_genero) REFERENCES genero (ge_genero) 
      ON UPDATE CASCADE ON DELETE SET NULL 
);

-- ========================= 
-- Tabela: livro_exemplar 
-- ========================= 
CREATE TABLE livro_exemplar ( 
  lex_cod        SERIAL PRIMARY KEY, 
  lex_li_cod     INTEGER NOT NULL, 
  lex_estado     VARCHAR(20) NOT NULL DEFAULT 'Bom' CHECK (lex_estado IN ('Novo','Bom','Usado','Danificado')), 
  lex_disponivel BOOLEAN NOT NULL DEFAULT true, 
  CONSTRAINT fk_lex_livro 
    FOREIGN KEY (lex_li_cod) REFERENCES livro (li_cod) 
      ON UPDATE CASCADE ON DELETE RESTRICT 
);

-- ========================= 
-- Tabela: utente 
-- ========================= 
CREATE TABLE utente ( 
  ut_cod        SERIAL PRIMARY KEY, 
  ut_nome       VARCHAR(120)  NOT NULL, 
  ut_nif        VARCHAR(15), 
  ut_email      VARCHAR(120) UNIQUE, 
  ut_tlm        VARCHAR(20), 
  ut_morada     VARCHAR(150), 
  ut_cod_postal VARCHAR(10), 
  CONSTRAINT fk_utente_cod_postal 
    FOREIGN KEY (ut_cod_postal) REFERENCES codigo_postal (cod_postal) 
      ON UPDATE CASCADE ON DELETE SET NULL 
);

-- ========================= 
-- Tabela: requisicao 
-- ========================= 
CREATE TABLE requisicao ( 
  re_cod             SERIAL PRIMARY KEY, 
  re_ut_cod          INTEGER NOT NULL, 
  re_lex_cod         INTEGER NOT NULL, 
  re_data_requisicao DATE NOT NULL, 
  re_data_devolucao  DATE, 
  CONSTRAINT fk_req_utente 
    FOREIGN KEY (re_ut_cod)  REFERENCES utente (ut_cod) 
      ON UPDATE CASCADE ON DELETE RESTRICT, 
  CONSTRAINT fk_req_exemplar 
    FOREIGN KEY (re_lex_cod) REFERENCES livro_exemplar (lex_cod) 
      ON UPDATE CASCADE ON DELETE RESTRICT 
);

-- Enable Row Level Security (RLS)
ALTER TABLE codigo_postal ENABLE ROW LEVEL SECURITY;
ALTER TABLE editora ENABLE ROW LEVEL SECURITY;
ALTER TABLE autor ENABLE ROW LEVEL SECURITY;
ALTER TABLE genero ENABLE ROW LEVEL SECURITY;
ALTER TABLE livro ENABLE ROW LEVEL SECURITY;
ALTER TABLE livro_exemplar ENABLE ROW LEVEL SECURITY;
ALTER TABLE utente ENABLE ROW LEVEL SECURITY;
ALTER TABLE requisicao ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Enable read access for all users" ON codigo_postal FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON editora FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON autor FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON genero FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON livro FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON livro_exemplar FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON utente FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON requisicao FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON codigo_postal FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON editora FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON autor FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON genero FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON livro FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON livro_exemplar FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON utente FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON requisicao FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON codigo_postal FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON editora FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON autor FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON genero FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON livro FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON livro_exemplar FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON utente FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON requisicao FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON codigo_postal FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON editora FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON autor FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON genero FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON livro FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON livro_exemplar FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON utente FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON requisicao FOR DELETE USING (true);
