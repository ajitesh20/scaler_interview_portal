const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('scalarInterviewPortal','root','password',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;