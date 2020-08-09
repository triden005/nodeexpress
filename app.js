const express = require("express");
const path=require('path');
const mongoose=require("mongoose");
const bodyParser = require('body-parser');
// const expressValidator = require('express-validator');
const {body,validationResult} = require('express-validator');
// const flash = require('connect-flash');
const session = require("express-session");

mongoose.connect('mongodb://localhost/nodebackend',{useNewUrlParser: true,useUnifiedTopology: true,});

const db=mongoose.connection;
db.on('error',(err)=>{
    console.log(err);
})
//check for db errors
db.once('open',()=>{
    console.log("connected to mongosDB");
})


//init app 
const app = express();


//bring in article
let Article = require('./models/article.js');

//load view engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//set public folder
app.use(express.static(path.join(__dirname,"public")));

//express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator
//not added anything

//home route
app.get('/',(req,res)=>{

    Article.find({},function(err,articlesdata){
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{
                title:'index',
                articles:articlesdata
            });
        }
    })
    
});


//Add route
let articles=require("./routes/articles.js");
app.use("/articles",articles);




//start server
app.listen (3000,()=>{
    console.log("server started on 3000")
});