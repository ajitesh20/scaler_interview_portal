const express = require('express');
const app = express();
const sequelize = require('./database');
const path = require('path');
const InterviewDetails = require('./interview_details');
const ejs = require('ejs');
const PORT = (process.env.PORT||8000);

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res) => {
    console.log('Form loaded');
    res.sendFile(__dirname + '/public/index.html');
})

sequelize.sync({force: true})
    .then(() => {
        console.log('Model was synchronized');
        app.listen(PORT,() => {
            console.log('server started at port '+PORT)
        })
    });