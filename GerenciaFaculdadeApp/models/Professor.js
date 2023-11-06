const Disciplina = require('./Disciplina.js')
const db = require('./db.js')
const Sequelize = require('sequelize')

// Definição dos atributos do professor
const Professor = db.sequelize.define('professores', {
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
    cpf:{
        type: db.Sequelize.STRING,
        allowNull: false,
        unique:true
    },
    dt_contratacao:{
        type: db.Sequelize.DATE,
        defaultValue: db.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    especializacao:{
        type: db.Sequelize.STRING,
        allowNull: false
    }
})

// Relacionamento 1 para n Professor com Disciplina
Professor.hasMany(Disciplina, {
    foreignKey: 'id_professor',
    constraints: true
})

module.exports = Professor