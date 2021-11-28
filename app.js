const express = require('express');
const app = express();
const sequelize = require('./database');
const InterviewDetails = require('./interview_details');

const PORT = (process.env.PORT||8000);

app.use(express.json());
app.use(express.urlencoded({extended : false}));

sequelize.sync({force: true})
    .then(() => {
        console.log('Model was synchronized');
        app.listen(PORT,(req,res) => {
            console.log('server stated at port '+PORT)
        })
    });