const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./database');
let InterviewDetails = sequelize.define('InterviewDetails', {
    interviewer: DataTypes.STRING,
    participants: DataTypes.STRING,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    resume: DataTypes.STRING
});

module.exports = InterviewDetails;