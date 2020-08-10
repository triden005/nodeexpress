const express=require("express");

const router =express.Router();
const {body,validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

const passport = require("passport")
//Bring in user Model

let User = require("../models/user");

//Register form
router.get("/register",(req,res)=>{
    res.render("register",{
        title:"Register"
    });
});


router.post("/register",[
    body("Name","name is required").notEmpty(),
    body("email","email is required").isEmail(),
    body("username","usename is required").notEmpty(),
    body("password","password is required").notEmpty(),
    body("password2",'Password confirmation does not match password').custom((value,{req})=>{
        if (value !== req.body.password) {
            // throw new Error('Password confirmation does not match password');
            return false;
            }
        return true;
    })
    ], (req,res) => {
    
    // console.log(req.body);
    const errors = validationResult(req).errors;
    console.log(errors);
    if(errors.length){
        errors.forEach(element => {
            req.flash("danger",element.msg);
        });
        res.redirect("/users/register");
    }
    else{
        const name=req.body.Name;
        const email=req.body.email;
        const username=req.body.username;
        const password=req.body.password;

        let newUser=new User({
            name:name,
            email:email,
            username:username,
            password:password
        });

        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=> {
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save((err)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        req.flash("success","you are now registered and can login");
                        res.redirect("/users/login");
                    }
                })
            });
        })
    }
});

//login window
router.get("/login",(req,res)=>{
    res.render("login",{
        title:"UserLogin"
    });
});


//login process
router.post("/login",passport.authenticate('local',{
    failureRedirect:"/users/login",
    failureFlash:true
}),function(req, res) {
    req.flash("success","login successfully")
    res.redirect("/");
    
    // `req.user` contains the authenticated user.
    

});
//logout
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","you are logged out sucessfully");
    res.redirect("/users/login");
});

module.exports = router;