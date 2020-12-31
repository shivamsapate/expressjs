const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true 
    }, 
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required: true,
        unique:true
    },

    age:{
        type:Number,
        required: true
    },
    password:{
        type:String,
        required : true
    },
    conformpassword:{
        type:String,
        required:true
    }
})



//concept of middleware
employeSchema.pre("save",async function(next){

    if(this.isModified("password")){
        console.log(`previous password ${this.password}`);
        this.password = await bcrypt.hash(this.password,10)
        console.log(`current password ${this.password}`);
        this.conformpassword = undefined;
    }   
    next()

})

// we need to create collection
const Register = mongoose.model("Register",employeSchema);
module.exports = Register;