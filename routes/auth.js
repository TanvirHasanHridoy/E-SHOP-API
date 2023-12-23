import express from "express";
import User from "../models/User.js";
const router =express.Router();
// import {AES} from 'crypto-js/aes.js';
import CryptoJS from "crypto-js";
import  Jwt  from "jsonwebtoken";



//Register

router.post('/register', async (req,res)=>{
    const newUser= new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt( req.body.password, process.env.PASSWORD_SECRET).toString(),
    })
    try{
        const savedUser = await newUser.save();
        console.log(savedUser)
        res.status(201).json(savedUser);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err)
    }
})

//LOGIN

router.post('/login', async (req,res)=>{
    try{
        const user= await User.findOne({username: req.body.username});
        
        //checking if user exists
        !user && res.status(401).json("Wrong Credentials");
        
        const userpass = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET).toString(CryptoJS.enc.Utf8);
        // console.log("user found and the unhashed pass is "+ userpass)
        // console.log("Bdy pass is "+ req.body.password)

        //checking if password matches
        userpass !== req.body.password && res.status(401).json("Wrong credentials")
        const {password, ...everyOtherInfo}=user._doc;
        
        const accessToken =  Jwt.sign({
            id:user._id, isAdmin:user.isAdmin,
        },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        
        )
        res.status(200).json({...everyOtherInfo, accessToken});
    }
    catch(err){
        res.status(500).json(err);
        console.log(err)
    }
});

export default router;