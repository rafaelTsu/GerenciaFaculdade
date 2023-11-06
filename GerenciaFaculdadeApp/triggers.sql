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

CREATE OR REPLACE FUNCTION verificar_cursos_disciplina()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM cursodisciplinas
    WHERE id_disciplina = OLD.id
  ) THEN
    RAISE EXCEPTION 'Não é possível excluir a disciplina, pois há cursos relacionados a ela.';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deletar_disciplina
BEFORE DELETE ON disciplinas
FOR EACH ROW
EXECUTE FUNCTION verificar_cursos_disciplina();

CREATE OR REPLACE FUNCTION verificar_disciplinas_professor()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM disciplinas
    WHERE professor_id = OLD.id
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

CREATE TABLE estudantes_log (
  id SERIAL PRIMARY KEY,
  acao VARCHAR(10) NOT NULL,
  id_estudante INTEGER,
  endereco VARCHAR(255),
  dt_matricula DATE,
  cod_matricula INTEGER,
  dt_acao TIMESTAMP
);

CREATE OR REPLACE FUNCTION log_estudante()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO estudantes_log (acao, id_estudante, endereco, dt_matricula, cod_matricula, dt_acao)
    VALUES ('DELETE', OLD.id, OLD.endereco, OLD.dt_matricula, OLD.cod_matricula, NOW());
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO estudantes_log (acao, id_estudante, endereco, dt_matricula, cod_matricula, dt_acao)
    VALUES ('UPDATE', NEW.id, NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_estudante
AFTER DELETE OR UPDATE ON estudantes
FOR EACH ROW
EXECUTE FUNCTION log_estudante();
