CREATE DATABASE IF NOT EXISTS gm_biblioteca 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci; 
USE gm_biblioteca; 

-- ========================= 
-- Tabela: CODIGO_POSTAL 
-- ========================= 
CREATE TABLE codigo_postal ( 
  cod_postal     VARCHAR(10)  NOT NULL,  -- ex: '2000-123' 
  cod_localidade VARCHAR(80)  NOT NULL, 
  PRIMARY KEY (cod_postal) 
) ENGINE=InnoDB; 

-- ========================= 
-- Tabela: EDITORA 
-- ========================= 
CREATE TABLE editora ( 
  ed_cod        INT           NOT NULL AUTO_INCREMENT, 
  ed_nome       VARCHAR(120)  NOT NULL, 
  ed_pais       VARCHAR(60)   NOT NULL, 
  ed_morada     VARCHAR(150)  NULL, 
  ed_cod_postal VARCHAR(10)   NULL, 
  ed_email      VARCHAR(120)  NULL, 
  ed_tlm        VARCHAR(20)   NULL, 
  PRIMARY KEY (ed_cod), 
  KEY ix_editora_cod_postal (ed_cod_postal), 
  CONSTRAINT fk_editora_cod_postal 
    FOREIGN KEY (ed_cod_postal) REFERENCES codigo_postal (cod_postal) 
      ON UPDATE CASCADE ON DELETE SET NULL 
) ENGINE=InnoDB; 

-- ========================= 
-- Tabela: AUTOR 
-- ========================= 
CREATE TABLE autor ( 
  au_cod   INT           NOT NULL AUTO_INCREMENT, 
  au_nome  VARCHAR(120)  NOT NULL, 
  au_pais  VARCHAR(60)   NULL, 
  PRIMARY KEY (au_cod) 
) ENGINE=InnoDB; 

-- ========================= 
-- Tabela: GENERO 
-- ========================= 
CREATE TABLE genero ( 
  ge_genero VARCHAR(20) NOT NULL, 
  PRIMARY KEY (ge_genero) 
) ENGINE=InnoDB; 

-- ========================= 
-- Tabela: LIVRO 
-- ========================= 
CREATE TABLE livro ( 
  li_cod      INT           NOT NULL AUTO_INCREMENT, 
  li_titulo   VARCHAR(200)  NOT NULL, 
  li_ano      YEAR          NULL, 
  li_edicao   VARCHAR(20)   NULL, 
  li_isbn     VARCHAR(20)   NULL, 
  li_editora  INT           NULL, 
  li_autor    INT           NULL, 
  li_genero   VARCHAR(20)   NULL, 
  PRIMARY KEY (li_cod), 
  UNIQUE KEY uk_livro_isbn (li_isbn), 
  KEY ix_livro_editora (li_editora), 
  KEY ix_livro_autor (li_autor), 
  KEY ix_livro_genero (li_genero), 
  CONSTRAINT fk_livro_editora 
    FOREIGN KEY (li_editora) REFERENCES editora (ed_cod) 
      ON UPDATE CASCADE ON DELETE SET NULL, 
  CONSTRAINT fk_livro_autor 
    FOREIGN KEY (li_autor) REFERENCES autor (au_cod) 
      ON UPDATE CASCADE ON DELETE SET NULL, 
  CONSTRAINT fk_livro_genero 
    FOREIGN KEY (li_genero) REFERENCES genero (ge_genero) 
      ON UPDATE CASCADE ON DELETE SET NULL 
) ENGINE=InnoDB; 

-- ========================= 
-- Tabela: LIVRO_EXEMPLAR 
-- ========================= 
CREATE TABLE livro_exemplar ( 
  lex_cod        INT           NOT NULL AUTO_INCREMENT, 
  lex_li_cod     INT           NOT NULL, 
  lex_estado     ENUM('Novo','Bom','Usado','Danificado') NOT NULL DEFAULT 'Bom', 
  lex_disponivel TINYINT(1)    NOT NULL DEFAULT 1, 
  PRIMARY KEY (lex_cod), 
  KEY ix_lex_livro (lex_li_cod), 
  CONSTRAINT fk_lex_livro 
    FOREIGN KEY (lex_li_cod) REFERENCES livro (li_cod) 
      ON UPDATE CASCADE ON DELETE RESTRICT 
) ENGINE=InnoDB; 

-- ========================= 
-- Tabela: UTENTE 
-- ========================= 
CREATE TABLE utente ( 
  ut_cod        INT           NOT NULL AUTO_INCREMENT, 
  ut_nome       VARCHAR(120)  NOT NULL, 
  ut_nif        VARCHAR(15)   NULL, 
  ut_email      VARCHAR(120)  NULL, 
  ut_tlm        VARCHAR(20)   NULL, 
  ut_morada     VARCHAR(150)  NULL, 
  ut_cod_postal VARCHAR(10)   NULL, 
  PRIMARY KEY (ut_cod), 
  UNIQUE KEY uk_utente_email (ut_email), 
  KEY ix_utente_cod_postal (ut_cod_postal), 
  CONSTRAINT fk_utente_cod_postal 
    FOREIGN KEY (ut_cod_postal) REFERENCES codigo_postal (cod_postal) 
      ON UPDATE CASCADE ON DELETE SET NULL 
) ENGINE=InnoDB; 

-- ========================= 
-- Tabela: REQUISICAO 
-- ========================= 
CREATE TABLE requisicao ( 
  re_cod             INT        NOT NULL AUTO_INCREMENT, 
  re_ut_cod          INT        NOT NULL, 
  re_lex_cod         INT        NOT NULL, 
  re_data_requisicao DATE       NOT NULL, 
  re_data_devolucao  DATE       NULL, 
  PRIMARY KEY (re_cod), 
  KEY ix_req_utente (re_ut_cod), 
  KEY ix_req_exemplar (re_lex_cod), 
  CONSTRAINT fk_req_utente 
    FOREIGN KEY (re_ut_cod)  REFERENCES utente (ut_cod) 
      ON UPDATE CASCADE ON DELETE RESTRICT, 
  CONSTRAINT fk_req_exemplar 
    FOREIGN KEY (re_lex_cod) REFERENCES livro_exemplar (lex_cod) 
      ON UPDATE CASCADE ON DELETE RESTRICT 
) ENGINE=InnoDB; 


