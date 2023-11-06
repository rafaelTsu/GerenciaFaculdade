const db = require('./db.js');
const Sequelize = require('sequelize')

// Denifição dos atributos do CursoDisciplina
const CursoDisciplina = db.sequelize.define('cursodisciplinas', {
    id:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
})

// Exporta Cliente
module.exports = CursoDisciplina;