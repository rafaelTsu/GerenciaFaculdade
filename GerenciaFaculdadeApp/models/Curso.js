const Estudante = require('./Estudante.js')
const CursoDisciplina = require('./CursoDisciplina.js')
const db = require('./db.js')
const Sequelize = require('sequelize')

// Definição dos atributos do curso
const Curso = db.sequelize.define('cursos', {
    id:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    codigo:{
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    unidade:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: db.Sequelize.STRING
    }
})

// Relacionamento 1 para n Curso com Estudante
Curso.hasMany(Estudante, {
    foreignKey: 'id_curso',
    constraints: true
})

Curso.hasMany(CursoDisciplina, {
    foreignKey: 'id_curso',
    constraints: true
})

/*
// Relacionamento n para n Curso com Disciplina
Curso.belongsToMany(Disciplina,{
    through:{
        model: CursoDisciplina
    },
    foreignKey: 'id_curso',
    constraints: true
})
*/

module.exports = Curso