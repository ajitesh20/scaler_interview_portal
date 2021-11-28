const express = require('express');
const app = express();
const sequelize = require('./database');
const path = require('path');
const InterviewDetails = require('./interview_details');
const PORT = (process.env.PORT||8000);
const multer = require('multer');
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      const name = file.originalname.split(".")[0];
      cb(null, 'resumes/'+name+Date.now()+"."+ext);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "pdf") {
      cb(null, true);
    } else {
      cb(new Error("Not a PDF File!!"), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
  });

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/create',(req,res) => {
    res.sendFile(__dirname + '/public/create.html');
});

app.post('/create',upload.single('candidateResume'),(req,res) => {
    InterviewDetails.create({
        interviewer: req.body.interviewerName,
        interviewer_email: req.body.interviewerEmail,
        candidate: req.body.candidateName,
        candidate_email: req.body.candidateEmail,
        startTime : req.body.startTime,
        endTime : req.body.endTime,
        resume: req.file.path
    }).then((data) => {
        res.sendFile(__dirname+'\\'+data.resume);
    });
});

sequelize.sync({force: true})
    .then(() => {
        console.log('Model was synchronized');
        app.listen(PORT,() => {
            console.log('server started at port '+PORT)
        })
    });