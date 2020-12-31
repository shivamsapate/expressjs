const express = require('express');
const path = require("path");
const hbs = require('hbs');
const bcrypt = require("bcryptjs");

const Register = require('./models/registers');
require('./db/conn');

const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}))

const static_path = path.join(__dirname,"../public");
const templates_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");


app.use(express.static(static_path))
app.set("view engine","hbs");
app.set('views',templates_path);
hbs.registerPartials(partials_path); 

app.get('/',(req,res)=>{
    res.render("index")
});

app.get('/login',(req,res)=>{
    res.render('login')
});

app.get('/register',(req,res)=>{
    res.render('register')
});



//register the user in the database
app.post('/register',async(req,res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.conformpassword;
        
        if(password==cpassword){
             
            const user = new Register({
                firstname :req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                gender : req.body.gender,
                phone : req.body.phone,
                age : req.body.age,
                password : password,
                conformpassword:password
  
            })
            const token =await user.generateAuth();


            const result  =  await user.save();

            res.redirect("/login")
        }else{
            res.send("password is not matching");
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

//Loging page backend code
app.post('/login', async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        
        const result =  await Register.findOne({email:email})
        const isMatch = await bcrypt.compare(password,result.password)

        if (isMatch){
            res.status(201).render('index')
        }else{
            res.send("invalid login details");
        }

    } catch (error) {
        res.status(400).send('invalid login details');
    }
})


//Listening a server on port no 3000
app.listen(port,()=>{
    console.log("server is running on port no "+port);
});