-- khan
-- https://github.com/topfreegames/khan
--
-- Licensed under the MIT license:
-- http://www.opensource.org/licenses/mit-license
-- Copyright © 2016 Top Free Games <backend@tfgco.com>

REVOKE ALL ON SCHEMA public FROM kublai_khan_test;
DROP DATABASE IF EXISTS kublai_khan_test;
DROP ROLE kublai_khan_test;

CREATE ROLE kublai_khan_test LOGIN
  SUPERUSER INHERIT CREATEDB CREATEROLE;

CREATE DATABASE kublai_khan_test
  WITH OWNER = kublai_khan_test
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       TEMPLATE = template0;

GRANT ALL ON SCHEMA public TO kublai_khan_test;
