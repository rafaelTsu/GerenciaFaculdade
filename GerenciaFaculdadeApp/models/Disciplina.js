const db = require('./db.js')
const Sequelize = require('sequelize')

const Estudante = require('./Estudante.js')
const CursoDisciplina = require('./CursoDisciplina.js')

// Definição dos atributos da disciplina
const Disciplina = db.define('disciplinas', {
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
    ch:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    cpf_monitor:{
        type: Sequelize.STRING,
        allowNull: true
    }
})

// Relacionamento 1 para 1 Disciplina com Estudante
Disciplina.belongsTo(Estudante, {
    foreignKey: 'cpf_monitor',
    constraints: false
})

module.exports = Disciplina