const db = require('./db.js')
const Sequelize = require('sequelize')

const Estudante = require('./Estudante.js')
const cursoDisciplina = require('./CursoDisciplina.js')
const Disciplina = require('./Disciplina.js')

// Definição dos atributos do curso
const Curso = db.define('cursos', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    codigo:{
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
    },
    unidade:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.STRING
    }
})

// Relacionamento 1 para n Curso com Estudante
Curso.hasMany(Estudante, {
    foreignKey: 'id_curso',
    constraints: true
})

// Relacionamento n para n Curso com Disciplina
Curso.belongsToMany(Disciplina,{
    through:{
        model: cursoDisciplina
    },
    foreignKey: 'id_curso',
    constraints: true
})

Disciplina.belongsToMany(Curso, {
    through: {
        model: cursoDisciplina
    },
    foreignKey: 'id_disciplina',
    constraint: true
})

module.exports = Curso