const db = require('./db.js')
const Sequelize = require('sequelize')

const Disciplina = require('./Disciplina.js')

// Definição dos atributos do professor
const Professor = db.define('professores', {
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
    cpf:{
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
    },
    dt_contratacao:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    especializacao:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Relacionamento 1 para n Professor com Disciplina
Professor.hasMany(Disciplina, {
    foreignKey: 'id_professor',
    constraints: true
})

module.exports = Professor