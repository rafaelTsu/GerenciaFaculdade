const Sequelize = require('sequelize')
const db = require('./db.js');

// Denifição dos atributos do CursoDisciplina
const CursoDisciplina = db.define('cursodisciplinas', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
})

// Exporta Cliente
module.exports = CursoDisciplina;