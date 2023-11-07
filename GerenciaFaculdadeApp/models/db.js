const Sequelize = require('sequelize');

// Conexão com banco de dados
const nome_db = 'projeto'
const username = 'postgres'
const senha_db = '123'
const host = 'localhost'
const dialect = 'postgres'

const sequelize = new Sequelize(nome_db, username, senha_db, {
    host: host,
    dialect: dialect
});

module.exports = sequelize;