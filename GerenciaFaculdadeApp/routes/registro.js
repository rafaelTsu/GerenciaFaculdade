const express = require('express')
const router = express.Router()
const Estudante = require("../models/Estudante.js")
const Curso = require("../models/Curso.js")
const Professor = require("../models/Professor.js")
const Disciplina = require("../models/Disciplina.js")
const CursoDisciplina = require('../models/CursoDisciplina.js')

// Rotas
// Rota principal
router.get('/', (req,res)=>{
    res.render("registro/registro")
})

// ESTUDANTE
// Rota para visualizar estudantes
router.get('/estudante', (req,res)=>{
    Estudante.findAll({order:[['nome','ASC']] }).then((estudante)=>{
        res.render("registro/estudante", {estudante: estudante})
    }).catch((erro)=>{
        req.flash("error_msg", "Erro ao listar os estudantes " + erro)
        res.render("registro/registro")
    })
})

// Rota para matricular estudante
router.get("/estudante/add", (req,res)=>{
    Curso.findAll().then((curso)=>{
        res.render("registro/addestudante", {curso: curso})
    })
})

router.post('/estudante/novo', (req,res) =>{
    // Valida entradas do formulário
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido."})
    }

    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
        erros.push({texto: "CPF inválido."})
    }

    if(!req.body.cod_matricula || typeof req.body.cod_matricula == undefined || req.body.cod_matricula == null){
        erros.push({texto: "Código de matrícula inválida."})
    }

    if(req.body.curso == "0"){
        erros.push({texto: "Curso inválido"})
    }

    if(erros.length > 0){
        res.render("registro/addestudante", {erros: erros})
    }else{
        Estudante.create({
            nome: req.body.nome,
            cpf: req.body.cpf,
            endereco: req.body.endereco,
            cod_matricula: req.body.cod_matricula,
            id_curso: req.body.curso
        }).then(()=>{
            req.flash("success_msg", "Estudante matriculado com sucesso!")
            res.redirect("/registro/estudante")
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao matricular o estudante: " + erro)
            res.redirect("/registro/estudante")
        })
    }
})

// Rota para editar estudante
router.get("/estudante/edit/:id", (req,res)=>{
    Estudante.findByPk(req.params.id).then((estudante)=>{
        Curso.findAll().then((curso)=>{
            res.render("registro/editestudante", {estudante: estudante, curso: curso})
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao listar os cursos " + erro)
        })
    }).catch((erro)=>{
        req.flash("error_msg", "Houve um erro ao selecionar o estudante " + erro)
    })
})

router.post("/estudante/edit", (req,res)=>{
    // Valida entradas do formulário
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido."})
    }

    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
        erros.push({texto: "CPF inválido."})
    }

    if(!req.body.cod_matricula || typeof req.body.cod_matricula == undefined || req.body.cod_matricula == null){
        erros.push({texto: "Código de matrícula inválida."})
    }

    if(req.body.curso == "0"){
        erros.push({texto: "Curso inválido"})
    }

    if(erros.length > 0){
        Estudante.findByPk(req.body.id).then((estudante)=>{
            Curso.findAll().then((curso)=>{
                res.render("registro/editestudante", {estudante: estudante, curso: curso, erros: erros})
            }).catch((erro)=>{
                req.flash("error_msg", "Houve um erro ao listar os cursos " + erro)
            })
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao selecionar o estudante " + erro)
        })
    }else{
        Estudante.findByPk(req.body.id).then((estudante)=>{
            estudante.nome = req.body.nome
            estudante.cpf = req.body.cpf
            estudante.endereco = req.body.endereco
            estudante.cod_matricula = req.body.cod_matricula
            estudante.id_curso = req.body.curso

            estudante.save().then(()=>{
                req.flash("success_msg", "Estudante editado com sucesso!")
                res.redirect("/registro/estudante")
            }).catch(()=>{
                req.flash("error_msg", "Houve um erro ao salvar a edição " + erro)
                res.redirect("/registro/estudante")
            })
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao editar o estudante " + erro)
            res.redirect("/registro/estudante")
        })
    }
})

// Rota para excluir estudante
router.post("/estudante/deletar", (req,res)=>{
    Estudante.destroy({where: {'id': req.body.id}}).then(()=>{
        req.flash("success_msg", "Estudante excluido com sucesso")
        res.redirect("/registro/estudante")
    }).catch((erro)=>{
        req.flash("error_msg", "Houve um erro ao excluir o estudante " + erro)
        res.redirect("/registro/estudante")
    })
})

// CURSO
// Rota para visualizar curso
router.get('/curso', (req,res)=>{
    Curso.findAll({order:[['nome','ASC']] }).then((curso)=>{
        res.render("registro/curso", {curso: curso})
    }).catch((erro)=>{
        req.flash("error_msg", "Erro ao listar os cursos " + erro)
        res.render("registro/registro")
    })
})

// Rota para cadastrar curso
router.get("/curso/add", (req,res)=>{
    res.render("registro/addcurso")
})

router.post('/curso/novo', (req,res) =>{
    // Valida entradas do formulário
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido."})
    }

    if(!req.body.codigo || typeof req.body.codigo == undefined || req.body.codigo == null){
        erros.push({texto: "Código inválido."})
    }

    if(!req.body.unidade || typeof req.body.unidade == undefined || req.body.unidade == null){
        erros.push({texto: "Unidade inválida."})
    }

    if(erros.length > 0){
        res.render("registro/addcurso", {erros: erros})
    }else{
        Curso.create({
            nome: req.body.nome,
            codigo: req.body.codigo,
            descricao: req.body.descricao,
            unidade: req.body.unidade
        }).then(()=>{
            req.flash("success_msg", "Curso cadastrado com sucesso!")
            res.redirect("/registro/curso")
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao cadastrar o curso: " + erro)
            res.redirect("/registro/curso")
        })
    }
})

// Rota para editar um curso
router.get("/curso/edit/:id", (req, res) => {
    Curso.findByPk(req.params.id).then((curso)=>{
        res.render("registro/editcurso", {curso: curso})
    }).catch((erro)=>{
        req.flash("error_msg", "Esse curso não existe! " + erro)
        res.redirect("/registro/curso")
    })
})

router.post("/curso/edit", (req,res)=> {
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido."})
    }

    if(!req.body.codigo || typeof req.body.codigo == undefined || req.body.codigo == null){
        erros.push({texto: "Código inválido."})
    }

    if(!req.body.unidade || typeof req.body.unidade == undefined || req.body.unidade == null){
        erros.push({texto: "Unidade inválida."})
    }

    if(erros.length > 0){
        Curso.findByPk(req.body.id).then((curso)=>{
            res.render("registro/editcurso", {curso: curso, erros: erros})
        }).catch((erro)=>{
            req.flash("error_msg", "Esse curso não existe! " + erro)
            res.redirect("/registro/curso")
        })
    }else{
        Curso.findByPk(req.body.id).then((curso)=>{
            curso.nome = req.body.nome
            curso.codigo = req.body.codigo
            curso.unidade = req.body.unidade
            curso.descricao = req.body.descricao

            curso.save().then(()=>{
                req.flash("success_msg", "Curso editado com sucesso")
                res.redirect("/registro/curso")
            }).catch((erro)=>{
                req.flash("error_msg", "Houve erro ao salvar a edição do curso " + erro)
                res.redirect("/registro/curso")
            })
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao editar o curso " + erro)
            res.redirect("/registro/curso")
        })
    }
})

// Rota para visualizar disciplinas do curso
router.get("/curso/cursodisciplina/:id", (req, res) => {
    Curso.findByPk(req.params.id).then((curso)=>{
        CursoDisciplina.findAll({where: {'id_curso': req.params.id}}).then((cursodisciplina)=>{
            res.render("registro/cursodisciplina", {curso: curso, cursodisciplina: cursodisciplina})
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao listar as disciplinas do curso")
            res.redirect("/registro/curso")
        })
    }).catch((erro)=>{
        req.flash("error_msg", "Esse curso não existe!")
        res.redirect("/registro/curso")
    })
})

// Rota para adicionar disciplina ao curso
router.get("/curso/addcursodisciplina/:id", (req,res)=>{
    Curso.findByPk(req.params.id).then((curso)=>{
        Disciplina.findAll().then((disciplina)=>{
            res.render("registro/addcursodisciplina", {curso: curso, disciplina: disciplina})
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao listar as disciplinas")
            res.redirect("/registro/curso")
        })
    }).catch((erro)=>{
        req.flash("error_msg", "Houve um erro ao selecionar o curso")
        res.redirect("/registro/curso")
    })
})

router.post('/curso/cursodisciplina/novo', (req,res) =>{
    // Valida entradas do formulário
    var erros = []
    if(req.body.disciplina == "0"){
        erros.push({texto: "Disciplina inválida."})
    }

    if(erros.length > 0){
        res.render("registro/addcurso", {erros: erros})
    }else{
        (async () => {
            try {
                const curso1 = await Curso.findByPk(req.body.id);
                const disciplina1 = await Disciplina.findByPk(req.body.disciplina);
        
                if (curso1 && disciplina1) {
                    await curso1.addDisciplina(disciplina1).then(()=>{
                        req.flash("success_msg", "Disciplina adicionada ao curso com sucesso!")
                        res.redirect("/registro/curso")
                    }).catch((error)=>{
                        req.flash("error_msg", "Houve um erro ao adicionar a disciplina no curso" + error)
                        res.redirect("/registro/curso")
                    });
                }
            } catch (error) {
                req.flash("error_msg", "Houve um erro ao adicionar a disciplina no curso" + error)
                res.redirect("/registro/curso")
            }
        })();
    }
})

// Rota para visualizar a disciplina do curso
router.get("/curso/visualizarcursodisciplina/:id", (req,res)=>{
    Disciplina.findByPk(req.params.id).then((disciplina)=>{
        res.render("registro/visualizardisciplina", {disciplina: disciplina})
    }).catch((erro)=>{
        req.flash("error_msg", "Houve um erro ao procurar pela disciplina " + erro)
        res.redirect("/registro/curso")
    })
})

// Rota para excluir a disciplina do curso
router.post("/curso/cursodisciplina/deletar", (req,res)=>{
    CursoDisciplina.destroy({where: {'id': req.body.id}}).then(()=>{
        req.flash("success_msg", "Disciplina foi excluido do curso com sucesso")
        res.redirect("/registro/curso")
    }).catch((erro)=>{
        req.flash("error_msg", "Houve um erro ao excluir a disciplina do curso " + erro)
        res.redirect("/registro/curso")
    })
})

// Rota para excluir um curso
router.post("/curso/deletar", (req,res)=>{
    Curso.destroy({where: {'id': req.body.id}}).then(()=>{
        req.flash("success_msg", "Curso excluido com sucesso")
        res.redirect("/registro/curso")
    }).catch((erro)=>{
        req.flash("error_msg", "Houve um erro ao excluir o curso " + erro)
        res.redirect("/registro/curso")
    })
})

// PROFESSOR
// Rota para visualizar professores
router.get('/professor', (req,res)=>{
    Professor.findAll({order:[['nome','ASC']] }).then((professor)=>{
        res.render("registro/professor", {professor: professor})
    }).catch((erro)=>{
        req.flash("error_msg", "Erro ao listar os professor " + erro)
        res.render("registro/registro")
    })
})

// Rota para cadastrar um professor
router.get("/professor/add", (req,res)=>{
    res.render("registro/addprofessor")
})

router.post('/professor/novo', (req,res) =>{
    // Valida entradas do formulário
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido."})
    }

    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
        erros.push({texto: "CPF inválido."})
    }

    if(!req.body.especializacao || typeof req.body.especializacao == undefined || req.body.especializacao == null){
        erros.push({texto: "Especialização inválida."})
    }

    if(erros.length > 0){
        res.render("registro/addprofessor", {erros: erros})
    }else{
        Professor.create({
            nome: req.body.nome,
            cpf: req.body.cpf,
            especializacao: req.body.especializacao,
        }).then(()=>{
            req.flash("success_msg", "Professor cadastrado com sucesso!")
            res.redirect("/registro/professor")
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao cadastrar o professor: " + erro)
            res.redirect("/registro/professor")
        })
    }
})

// Rota para editar um professor
router.get("/professor/edit/:id", (req, res) => {
    Professor.findByPk(req.params.id).then((professor)=>{
        res.render("registro/editprofessor", {professor: professor})
    }).catch((erro)=>{
        req.flash("error_msg", "Esse professor não existe! " + erro)
        res.redirect("/registro/professor")
    })
})

router.post("/professor/edit", (req,res)=> {
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido."})
    }

    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
        erros.push({texto: "CPF inválido."})
    }

    if(!req.body.especializacao || typeof req.body.especializacao == undefined || req.body.especializacao == null){
        erros.push({texto: "Especialização inválida."})
    }

    if(erros.length > 0){
        Professor.findByPk(req.body.id).then((professor)=>{
            res.render("registro/editprofessor", {professor: professor, erros: erros})
        }).catch((erro)=>{
            req.flash("error_msg", "Esse professor não existe! " + erro)
            res.redirect("/registro/professor")
        })
    }else{
        Professor.findByPk(req.body.id).then((professor)=>{
            professor.nome = req.body.nome
            professor.cpf = req.body.cpf
            professor.especializacao = req.body.especializacao

            professor.save().then(()=>{
                req.flash("success_msg", "Professor editado com sucesso")
                res.redirect("/registro/professor")
            }).catch((erro)=>{
                req.flash("error_msg", "Houve erro ao salvar a edição do professor " + erro)
                res.redirect("/registro/professor")
            })
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao editar o professor " + erro)
            res.redirect("/registro/professor")
        })
    }
})

// Rota para excluir professor
router.post("/professor/deletar", (req,res)=>{
    Professor.destroy({where: {'id': req.body.id}}).then(()=>{
        req.flash("success_msg", "professor excluido com sucesso")
        res.redirect("/registro/professor")
    }).catch((erro)=>{
        req.flash("error_msg", "Houve um erro ao excluir o professor " + erro)
        res.redirect("/registro/professor")
    })
})

// DISCIPLINAS
// Rota para visualizar disciplinas
router.get('/disciplina', (req,res)=>{
    Disciplina.findAll({order:[['nome','ASC']] }).then((disciplina)=>{
        res.render("registro/disciplina", {disciplina: disciplina})
    }).catch((erro)=>{
        req.flash("error_msg", "Erro ao listar as disciplinas " + erro)
        res.render("registro/registro")
    })
})

// Rota para cadastrar disciplina
router.get("/disciplina/add", (req,res)=>{
    Professor.findAll().then((professor)=>{
        Estudante.findAll().then((estudante)=>{
            res.render("registro/adddisciplina", {professor: professor, estudante: estudante})
        })
    })
})

router.post('/disciplina/novo', (req,res) =>{
    // Valida entradas do formulário
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido."})
    }

    if(!req.body.codigo || typeof req.body.codigo == undefined || req.body.codigo == null){
        erros.push({texto: "Código inválido."})
    }

    if(!req.body.ch || typeof req.body.ch == undefined || req.body.ch == null){
        erros.push({texto: "Carga horária inválida."})
    }

    if(req.body.professor == "0"){
        erros.push({texto: "Professor inválido"})
    }

    if(erros.length > 0){
        res.render("registro/adddisciplina", {erros: erros})
    }else{
        Disciplina.create({
            nome: req.body.nome,
            codigo: req.body.codigo,
            ch: req.body.ch,
            id_professor: req.body.professor,
            cpf_monitor: req.body.monitor
        }).then(()=>{
            req.flash("success_msg", "Disciplina cadastrado com sucesso!")
            res.redirect("/registro/disciplina")
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao cadastrar a disciplina: " + erro)
            res.redirect("/registro/disciplina")
        })
    }
})

// Rota para editar uma disciplina
router.get("/disciplina/edit/:id", (req,res)=>{
    Disciplina.findByPk(req.params.id).then((disciplina)=>{
        Professor.findAll().then((professor)=>{
            Estudante.findAll().then((estudante)=>{
                res.render("registro/editdisciplina", {disciplina: disciplina, professor: professor, estudante: estudante})
            }).catch((erro)=>{
                req.flash("error_msg", "Houve um erro ao listar os monitores " + erro)
            })
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao listar os professores " + erro)
        })
    }).catch((erro)=>{
        req.flash("error_msg", "Houve um erro ao selecionar a disciplina " + erro)
    })
})

router.post("/disciplina/edit", (req,res)=>{
    // Valida entradas do formulário
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido."})
    }

    if(!req.body.codigo || typeof req.body.codigo == undefined || req.body.codigo == null){
        erros.push({texto: "Código inválido."})
    }

    if(!req.body.ch || typeof req.body.ch == undefined || req.body.ch == null){
        erros.push({texto: "Carga horária inválida."})
    }

    if(req.body.professor == "0"){
        erros.push({texto: "Professor inválido"})
    }

    if(erros.length > 0){
        Disciplina.findByPk(req.body.id).then((disciplina)=>{
            Professor.findAll().then((professor)=>{
                Estudante.findAll().then((estudante)=>{
                    res.render("registro/editdisciplina", {disciplina: disciplina, professor: professor, estudante: estudante, erros: erros})
                }).catch((erro)=>{
                    req.flash("error_msg", "Houve um erro ao listar os monitores " + erro)
                })
            }).catch((erro)=>{
                req.flash("error_msg", "Houve um erro ao listar os professores " + erro)
            })
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao selecionar a disciplina " + erro)
        })
    }else{
        Disciplina.findByPk(req.body.id).then((disciplina)=>{
            disciplina.nome = req.body.nome
            disciplina.codigo = req.body.codigo
            disciplina.ch = req.body.ch
            disciplina.cpf_monitor = req.body.monitor
            disciplina.id_professor = req.body.professor

            disciplina.save().then(()=>{
                req.flash("success_msg", "Disciplina editada com sucesso!")
                res.redirect("/registro/disciplina")
            }).catch(()=>{
                req.flash("error_msg", "Houve um erro ao salvar a edição " + erro)
                res.redirect("/registro/disciplina")
            })
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao editar a disciplina " + erro)
            res.redirect("/registro/disciplina")
        })
    }
})

// Rota para excluir disciplina
router.post("/disciplina/deletar", (req,res)=>{
    Disciplina.destroy({where: {'id': req.body.id}}).then(()=>{
        req.flash("success_msg", "Disciplina excluída com sucesso")
        res.redirect("/registro/disciplina")
    }).catch((erro)=>{
        req.flash("error_msg", "Houve um erro ao excluir a disciplina " + erro)
        res.redirect("/registro/disciplina")
    })
})



module.exports = router