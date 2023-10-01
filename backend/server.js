const mongoose = require('mongoose'); // Mongoose for communicating with mongoDB
const DataModel=require('./models/data') // Mongoose Model to store Payment Details(go to the file path to see)
const express=require('express')
const bodyParser=require('body-parser')
const port=3001
const app=express()
const cors=require('cors');
const Data = require('./models/data');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors())

const mongodburl="" //Your mongoDB Url
mongoose.connect(mongodburl,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

app.post('/create-todo',(req,res)=>{
    const {title,time}=req.body
        const model={
            title:title,
            time:time,
            collaborators:""
        }
        const data=new DataModel(model)
        data.save()
        .then((resp)=>{
              res.json({success:resp})
        }).catch((err)=>{
              res.json({error:err})
      });
})

app.post('/fetch-todo',(req,res)=>{
  const time=req.body
      DataModel.find()
      .then((data)=>{
        const final=data.filter((dt)=>{
          return new Date(dt.time).getDate()==time.date&&new Date(dt.time).getMonth()==time.month&&new Date(dt.time).getFullYear()==time.year
        })
          res.json({success:final});
      })
      .catch((err)=>{
          res.json({error:err});
      })
})

app.get('/delete-todo/:id',(req,res)=>{
      const id=new mongoose.Types.ObjectId(req.params.id)
      DataModel.findByIdAndDelete(id)
      .then((data)=>{
          res.json({success:"Todo Deleted!"});
      })
      .catch((err)=>{
          res.json({error:err});
      })
})

app.post('/edit-todo/:id',(req,res)=>{
 const id=req.params.id
 let newData={}
 const {title,time,newTime}=req.body
 if(newTime)
  newData={title:title,time:newTime,collaborators:""}
else
 newData={title:title,time:time,collaborators:""}
 Data.findByIdAndUpdate(id,newData,{new:true})
 .then(()=>{
  res.json({success:"Todo Updated!"});
 })
 .catch((err)=>{
  res.json({error:err});
 })
})

app.listen(port,()=>{
    console.log(`Server Listening on Port ${port}`)
})

