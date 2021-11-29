const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./database');
let InterviewDetails = sequelize.define('InterviewDetails', {
    interviewer: DataTypes.STRING,
    interviewer_email: DataTypes.STRING,
    candidate: DataTypes.STRING,
    candidate_email: DataTypes.STRING,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    resume: DataTypes.STRING
});

module.exports = InterviewDetails;