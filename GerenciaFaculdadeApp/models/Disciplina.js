const Estudante = require('./Estudante.js')
const CursoDisciplina = require('./CursoDisciplina.js')
const db = require('./db.js')
const Sequelize = require('sequelize')

// Definição dos atributos da disciplina
const Disciplina = db.sequelize.define('disciplinas', {
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
    ch:{
        type: db.Sequelize.INTEGER,
        allowNull: false
    },
    cpf_monitor:{
        type: db.Sequelize.STRING,
        allowNull: true
    }
})

// Relacionamento 1 para 1 Disciplina com Estudante
Disciplina.belongsTo(Estudante, {
    foreignKey: 'cpf_monitor',
    constraints: false
})

Disciplina.hasMany(CursoDisciplina, {
    foreignKey: 'id_disciplina',
    constraints: true
})

/*
// Relacionamento n para n Disciplina com Curso
Disciplina.belongsToMany(Curso,{
    through:{
        model: CursoDisciplina
    },
    foreignKey: 'id_disciplina',
    constraints: true,
    as: 'curso'
})
*/

module.exports = Disciplina