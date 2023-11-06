const Sequelize = require('sequelize');

// Conexão com banco de dados
const sequelize = new Sequelize('projeto', 'postgres', '123', {
    host: "localhost",
    dialect: "postgres"
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}