const express=require('express')
const mongoose=require('mongoose')
const multer=require('multer')
const bodyParser=require('body-parser')
const UserModel=require('./Models/User')
const DocumentModel=require('./Models/documents')


const app=express()
const storage=multer.memoryStorage()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
const upload=multer({storage:storage})


//Database Connection.
mongoose.connect("mongodb+srv://test:test123@cluster0.kifneti.mongodb.net/test").then(result=>app.listen(5000))

//Sign In
app.post("/SignIn",
(req,res)=>{
    UserModel.find({name:req.body.name}).then(
        (result)=>{
            if(result.length==1){
            if(result[0].Password==req.body.Password){
                res.json({status:"ok",userid:result[0].userid})
            } 
            else{ 
                res.json({status:"Incorrect password"})
            }
        }
        else{
            res.json({status:"Invalid username"})
        }
    }
    )
})  

//Sign Up
app.post("/signup",
(req,res)=>{
    UserModel.find({name:req.body.name}).then(result=>{
        if(result.length==1){
            res.json({status:"user already exists"})
        }
        else{
            const User=new UserModel({
                userid:req.body.name+Date.now()+Math.random(),
                name:req.body.name,
                Password:req.body.Password
            })
            User.save()
            .then((result)=>{res.json({status:"ok"});})
            .catch((err)=>res.json({status:"error"}))
        }
    })
    
})

//get documents of user
app.get("/documents/:id",
(req,res)=>{
    const id=req.params.id
    DocumentModel.find({userid:id},{fileName:1,filetype:1})
    .then(result=>res.send(result))
})


//upload document
app.post("/upload",
upload.single("file"),
(req,res)=>{
    const Doc=new DocumentModel({
        userid:req.body.userid,
        fileName:req.file.originalname,
        filetype:req.file.mimetype,
        Document:{
            data:req.file.buffer,
            contentType:req.file.mimetype
        }
    })
    Doc.save()
    .then(result=>res.json({status:"ok"}))
})


//Download File.
app.get("/:filename",
(req,res)=>{
    const fname=req.params.filename
    DocumentModel.find({fileName:fname},{Document:1,_id:0})
    .then(result=>{
        if(result.length>=1){
            res.set('Content-Type',result[0].Document.contentType)
            res.send(result[0].Document.data)
        }
        else{
            res.send(result.length.toString())
        }
    })
})

//Delete Document.
app.delete('/Delete',(req,res)=>{
    DocumentModel.findOneAndDelete({fileName:req.body.name,userid:req.body.uid}).then(result=>res.json({status:"ok"}))
})