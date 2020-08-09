const express=require("express");

const router =express.Router();
const {body,validationResult} = require('express-validator');

//bring in article
let Article = require('../models/article.js');
//add route
router.get("/add" , (req,res)=>{
    res.render('add_article',{
        title:"Add Article"
    });
});
//add submit post route
router.post('/add',[
    body("title","title is required").notEmpty(),
    body("author","author is required").notEmpty(),
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
        article.author=req.body.author;
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
router.get('/edit/:id',(req,res)=>{
    Article.findById(req.params.id,(err,data)=>{
        console.log(data);
        res.render('edit_article',{
            title:"edit",
            data:data 
        });
    });
})
//update post edit
router.post("/edit/:id",(req,res)=>{
    let article={}
    article.title=req.body.title;
    article.author=req.body.author;
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
router.get('/:id',(req,res)=>{
    Article.findById(req.params.id,(err,data)=>{
        console.log(data);
        res.render('article',{
            data:data 
        });
    });
})

router.delete("/:id",(req,res)=>{
    let query={_id:req.params.id}
    
   
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
});


module.exports = router;