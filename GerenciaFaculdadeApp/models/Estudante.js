const db = require('./db.js')
const Sequelize = require('sequelize')

// Definição dos atributos do estudante
const Estudante = db.define('estudantes', {
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
        unique: true
    },
    endereco:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    dt_matricula:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    cod_matricula:{
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
    }
})

module.exports = Estudante