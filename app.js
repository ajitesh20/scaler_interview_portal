const express = require('express');
const app = express();
const sequelize = require('./database');
const path = require('path');
const InterviewDetails = require('./interview_details');
const PORT = (process.env.PORT||8000);

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res) => {
    console.log('index loaded');
    res.sendFile(__dirname + '/public/index.html');
})

app.get('/create',(req,res) => {
    console.log('Create loaded');
    res.sendFile(__dirname + '/public/create.html');
});

app.post('/create',(req,res) => {
    console.log();
    console.log(req.body);
    InterviewDetails.create({
        interviewer: req.body.interviewerName,
        interviewer_email: req.body.interviewerEmail,
        candidate: req.body.candidateName,
        candidate_email: req.body.candidateEmail,
        startTime : req.body.startTime,
        endTime : req.body.endTime
    }).then((data) => {
        console.log(data);
        res.send(data);
    });
});

sequelize.sync({force: true})
    .then(() => {
        console.log('Model was synchronized');
        app.listen(PORT,() => {
            console.log('server started at port '+PORT)
        })
    });