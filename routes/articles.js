const express=require("express");

const router =express.Router();
const {body,validationResult} = require('express-validator');

//bring in article
let Article = require('../models/article.js');
//bringing article model
let user=require("../models/user");
const article = require("../models/article.js");
//add route
router.get("/add" ,ensureAuthenticated, (req,res)=>{
    res.render('add_article',{
        title:"Add Article"
    });
});
//add submit post route
router.post('/add',ensureAuthenticated,[
    body("title","title is required").notEmpty(),
    // body("author","author is required").notEmpty(),
    body("body","body is required").notEmpty(),
    ]
,(req,res)=>{

    const errors = validationResult(req).errors;
    console.log(errors);
    if(errors.length){
        errors.forEach(element => {
            req.flash("danger",element.msg);
        });
        res.redirect("/articles/add");
    }
    else{
        let article=new Article();
        article.title=req.body.title;
        article.author=req.user._id;
        article.body=req.body.body;

        article.save((err)=>{
            if(err){
                console.log(err);
                return;
            }
            else{
                req.flash("success","article added");
                res.redirect('/');
            }
        })
    }
});


//load edit form 
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Article.findById(req.params.id,(err,data)=>{
        console.log(data);
        if(data.author!=req.user._id){
            req.flash("danger","please login");
            res.redirect("/users/login");
        }
        res.render('edit_article',{
            title:"Edit Article",
            data:data 
        });
    });
})
//update post edit
router.post("/edit/:id",(req,res)=>{
    let article={}
    article.title=req.body.title;
    article.author=req.user._id;
    article.body=req.body.body;

    let query = {_id:req.params.id}
    Article.update(query,article,(err)=>{
        if(err){
            console.log(err);
            return;
        }
        else{
            req.flash("success","edited successfully");
            res.redirect('/');
        }
    })
    
    return;
})

//get single article
router.get('/:id',[],(req,res)=>{
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        res.redirect("/");
    }
    Article.findById(req.params.id,(err,data)=>{
        if(err){
            console.log(err);
        }
        // console.log("hello")
        console.log(data);
        if(data!=null){
            user.findById(data.author,function(err,user){
                res.render('article',{
                    title: "Article",
                    data: data,
                    author : user.name 
                });
            })

        }
        
        else{
            res.redirect("/");
        }
        // console.log(data);
        
    });
})

router.delete("/:id",(req,res)=>{
    if(!req.user._id){
        res.status(500).send("bad request")
    }

    let query={_id:req.params.id}

    Article.findById(req.params.id,function(err,data){
        if(data.author!= req.user._id){
            res.status(500).send("bad request dude");
        } else{
            Article.remove(query,(err)=>{
                if(err){
                    console.log(err);
                    res.send(400, "Unable to find customer.");
                    res.status(402).send("Not found.");
                }
                else{
                    res.send(200,'success');
                }
            });
        }
    })
    
   
   
});
// access control

function ensureAuthenticated (req,res,next){
    if(req.isAuthenticated()){
        return next();

    }else{
        req.flash("danger","Please Login First");
        res.redirect("/users/login");
    }
}

router.get("*",(req,res)=>{
    res.redirect("/");
})

module.exports = router;