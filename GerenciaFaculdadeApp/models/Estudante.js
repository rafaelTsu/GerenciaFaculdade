const db = require('./db.js')
const Sequelize = require('sequelize')

// Definição dos atributos do estudante
const Estudante = db.sequelize.define('estudantes', {
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
        unique: true
    },
    endereco:{
        type: db.Sequelize.TEXT,
        allowNull: false
    },
    dt_matricula:{
        type: db.Sequelize.DATE,
        defaultValue: db.Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    cod_matricula:{
        type: db.Sequelize.INTEGER,
        allowNull: false,
        unique: true
    }
})

module.exports = Estudante