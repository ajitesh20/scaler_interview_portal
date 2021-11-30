const express = require('express');
const app = express();
const sequelize = require('./database');
const path = require('path');
const InterviewDetails = require('./interview_details');
const PORT = (process.env.PORT||8000);
const multer = require('multer');
const {Op} = require('sequelize');
const ejs = require('ejs');
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
app.set('view engine', 'ejs');

app.get('/',(req,res) => {
    res.render('index');
});

app.get('/create',(req,res) => {
    res.render('create');
});

app.post('/create',upload.single('resume'),(req,res) => {
    let createData = {
      interviewer: req.body.interviewerName,
      interviewer_email: req.body.interviewerEmail,
      candidate: req.body.candidateName,
      candidate_email: req.body.candidateEmail,
      startTime : new Date(req.body.startTime),
      endTime : new Date(req.body.endTime),
      resume: (req.file==undefined?'NULL':req.file.path)
  };

    InterviewDetails.findOne({
        where: {
            [Op.or]: [{interviewer: createData.interviewer},{candidate: createData.candidate}],
            [Op.and]: [{startTime: {[Op.lte]: createData.endTime}},{endTime: {[Op.gte]: createData.startTime}}]
        }})
        .then(data => {
            if(data){
                res.render('result',{
                    status: false,
                    message: 'Interview already exists'
                });
            } else {
                InterviewDetails.create(createData).then(data => {
                    res.render('result',{
                        status: true,
                        message: 'Interview created successfully'
                    });
                })}})
            .catch(err => {
                    res.render('result',{
                        status: false,
                        message: 'Error while creating interview'
                    });
                });
});

app.post('/update/:id',upload.single('resume'),(req,res) => {
    let createData = {
      id: req.params.id,
      interviewer: req.body.interviewerName,
      interviewer_email: req.body.interviewerEmail,
      candidate: req.body.candidateName,
      candidate_email: req.body.candidateEmail,
      startTime : new Date(req.body.startTime),
      endTime : new Date(req.body.endTime),
      resume: (req.file==undefined?'NULL':req.file.path)
  };

InterviewDetails.update(createData,{
    where: {
        id: createData.id
    }
})
.then(data => {
    res.render('result',{
        status: true,
        message: 'Interview updated successfully'
})})
.catch(err => {
        res.render('result',{
            status: false,
            message: 'Error while updating interview'
        });
})
});

app.get('/upcoming',(req,res) => {
    InterviewDetails.findAll({
        where: {
            startTime: {
                [Op.gt]: new Date()
            }
        }
    }).then((data) => {
        res.render('upcoming',{userData: data});
    });
});

app.get('/public/resumes/:file',(req,res) => {
    res.sendFile(path.join(__dirname,'public\\resumes',req.params.file));
});

app.get('/users/edit/:id',(req,res) => {
    InterviewDetails.findOne({
        where: {
            id: req.params.id
        }
    })
    .then((data) => {
        data.oper = 'update/'+data.id;
        res.render('edit',{data: data});
    })
    .catch((err) => { 
        console.log(err);
    })
});

sequelize.sync({force:true})
    .then(() => {
        console.log('Model was synchronized');
        app.listen(PORT,() => {
            console.log('server started at port '+PORT)
        })
});