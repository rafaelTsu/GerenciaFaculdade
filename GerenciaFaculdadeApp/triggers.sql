-- TRIGGERS PARA VERIFICAR INTEGRIDADE DOS RELACIONAMENTOS

-- VERIFICA SE UM CURSO TEM ESTUDANTES
CREATE OR REPLACE FUNCTION verificar_estudantes_curso()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM estudantes
    WHERE id_curso = OLD.id
  ) THEN
    RAISE EXCEPTION 'Não é possível excluir o curso, pois há estudantes relacionados a ele.';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deletar_curso
BEFORE DELETE ON cursos
FOR EACH ROW
EXECUTE FUNCTION verificar_estudantes_curso();

-- VERIFICA SE UMA DISCIPLINA ESTÁ RELACIONADA A UM CURSO
CREATE OR REPLACE FUNCTION verificar_cursos_disciplina()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM cursodisciplinas
    WHERE id_disciplina = OLD.id
  ) THEN
    RAISE EXCEPTION 'Não é possível excluir a disciplina, pois ela está relacionada a um curso.';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deletar_disciplina
BEFORE DELETE ON disciplinas
FOR EACH ROW
EXECUTE FUNCTION verificar_cursos_disciplina();

-- VERIFICA SE UM PROFESSOR É RESPONSÁVEL POR UMA DISCIPLINA
CREATE OR REPLACE FUNCTION verificar_disciplinas_professor()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM disciplinas
    WHERE id_professor = OLD.id
  ) THEN
    RAISE EXCEPTION 'Não é possível excluir o professor, pois há disciplinas relacionadas a ele.';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER antes_deletar_professor
BEFORE DELETE ON professores
FOR EACH ROW
EXECUTE FUNCTION verificar_disciplinas_professor();

-- TRIGGERS PARA TABELA LOG_ESTUDANTE
CREATE TABLE log_estudante (
  id SERIAL PRIMARY KEY,
  operacao VARCHAR(10) NOT NULL,
  id_estudante INTEGER,
  nome VARCHAR(255),
  cpf VARCHAR(255),
  endereco VARCHAR(255),
  dt_matricula DATE,
  cod_matricula INTEGER,
  id_curso INTEGER,
  data_operacao TIMESTAMP NOT NULL
);

CREATE OR REPLACE FUNCTION log_estudante()
RETURNS TRIGGER AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO log_estudante (operacao, id_estudante, nome, cpf, endereco, dt_matricula, cod_matricula, id_curso, data_operacao)
      VALUES ('INSERT', NEW.id, NEW.nome, NEW.cpf, NEW.endereco, NEW.dt_matricula, NEW.cod_matricula, NEW.id_curso, NOW());
    ELSIF TG_OP = 'UPDATE' THEN
      INSERT INTO log_estudante (operacao, id_estudante, nome, cpf, endereco, dt_matricula, cod_matricula, id_curso, data_operacao)
      VALUES ('UPDATE', OLD.id, NEW.nome, NEW.cpf, NEW.endereco, NEW.dt_matricula, NEW.cod_matricula, NEW.id_curso, NOW());
    ELSIF TG_OP = 'DELETE' THEN
      INSERT INTO log_estudante (operacao, id_estudante, nome, cpf, endereco, dt_matricula, cod_matricula, id_curso, data_operacao)
      VALUES ('DELETE', OLD.id, OLD.nome, OLD.cpf, OLD.endereco, OLD.dt_matricula, OLD.cod_matricula, OLD.id_curso, NOW());
    END IF;
    RETURN NULL;
  END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_estudante_trigger
AFTER INSERT OR UPDATE OR DELETE ON estudantes
FOR EACH ROW
EXECUTE FUNCTION log_estudante();

-- TRIGGERS PARA TABELA LOG_PROFESSOR
CREATE TABLE log_professor (
  id SERIAL PRIMARY KEY,
  operacao VARCHAR(12) NOT NULL,
  id_professor INT,
  nome VARCHAR(255),
  cpf VARCHAR(255),
  especializacao VARCHAR(255),
  data_operacao TIMESTAMP NOT NULL
);

CREATE OR REPLACE FUNCTION log_professor()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO log_professor (operacao, id_professor, nome, cpf, especializacao, data_operacao)
        VALUES ('INSERT', NEW.id, NEW.nome, NEW.cpf, NEW.especializacao, NOW());
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO log_professor (operacao, id_professor, nome, cpf, especializacao, data_operacao)
        VALUES ('UPDATE', OLD.id, NEW.nome, NEW.cpf, NEW.especializacao, NOW());
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO log_professor (operacao, id_professor, nome, cpf, especializacao, data_operacao)
        VALUES ('DELETE', OLD.id, OLD.nome, OLD.cpf, OLD.especializacao, NOW());
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_professor_trigger
AFTER INSERT OR UPDATE OR DELETE ON professores
FOR EACH ROW
EXECUTE FUNCTION log_professor();

-- TRIGGERS PARA TABELA LOG_CURSO
CREATE TABLE log_curso (
  id SERIAL PRIMARY KEY,
  operacao VARCHAR(12) NOT NULL,
  id_curso INTEGER,
  nome VARCHAR(255),
  codigo INTEGER,
  unidade VARCHAR(255),
  descricao VARCHAR(255),
  data_operacao TIMESTAMP NOT NULL
);

CREATE OR REPLACE FUNCTION log_curso()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO log_curso (operacao, id_curso, nome, codigo, unidade, descricao, data_operacao)
        VALUES ('INSERT', NEW.id, NEW.nome, NEW.codigo, NEW.unidade, NEW.descricao, NOW());
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO log_curso (operacao, id_curso, nome, codigo, unidade, descricao, data_operacao)
        VALUES ('UPDATE', OLD.id, NEW.nome, NEW.codigo, NEW.unidade, NEW.descricao, NOW());
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO log_curso (operacao, id_curso, nome, codigo, unidade, descricao, data_operacao)
        VALUES ('DELETE', OLD.id, OLD.nome, OLD.codigo, OLD.unidade, OLD.descricao, NOW());
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_curso_trigger
AFTER INSERT OR UPDATE OR DELETE ON cursos
FOR EACH ROW
EXECUTE FUNCTION log_curso();

-- TRIGGERS PARA TABELA LOG_DISCIPLINA
CREATE TABLE log_disciplina (
  id SERIAL PRIMARY KEY,
  operacao VARCHAR(12) NOT NULL,
  id_disciplina INTEGER,
  nome VARCHAR(255),
  codigo INTEGER,
  ch INTEGER,
  cpf_monitor VARCHAR(255),
  id_professor INTEGER,
  data_operacao TIMESTAMP NOT NULL
);

CREATE OR REPLACE FUNCTION log_disciplina()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO log_disciplina (operacao, id_disciplina, nome, codigo, ch, cpf_monitor, id_professor, data_operacao)
        VALUES ('INSERT', NEW.id, NEW.nome, NEW.codigo, NEW.ch, NEW.cpf_monitor, NEW.id_professor, NOW());
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO log_disciplina (operacao, id_disciplina, nome, codigo, ch, cpf_monitor, id_professor, data_operacao)
        VALUES ('UPDATE', OLD.id, NEW.nome, NEW.codigo, NEW.ch, NEW.cpf_monitor, NEW.id_professor, NOW());
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO log_disciplina (operacao, id_disciplina, nome, codigo, ch, cpf_monitor, id_professor, data_operacao)
        VALUES ('DELETE', OLD.id, OLD.nome, OLD.codigo, OLD.ch, OLD.cpf_monitor, OLD.id_professor, NOW());
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_disciplina_trigger
AFTER INSERT OR UPDATE OR DELETE ON disciplinas
FOR EACH ROW
EXECUTE FUNCTION log_disciplina();