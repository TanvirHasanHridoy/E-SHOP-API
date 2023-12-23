import express from "express";
import {verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from "./verifytokens.js";
import User from "../models/User.js";

const router =express.Router();

// router.get('/',(req, res) => {
//     res.send("Welcome")
// })

// router.post("/testPost",(req, res) => {
//     const username = req.body.username
//     console.log("The username is " + username)
//     res.send("username: " + username)
// })

// UPDATE the user
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
   if(req.body.password){
    req.body.password= CryptoJS.AES.encrypt( req.body.password, process.env.PASSWORD_SECRET).toString()
   }
   try{
       const updatedUser=  await User.findByIdAndUpdate(req.params.id, {
        $set:req.body
       },{new:true}) ;
       res.status(200).json(updatedUser)
   }
   catch(err) {
    res.status(500).json(err);
   }
})

// DELETE the user

router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id) 
        res.status(200).json("User deleted!")
    }catch(err){
        res.status(500).json(err)
    }
})


// GET the user
router.get("/find/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        const user= await User.findById(req.params.id) 
        const {password, ...everyOtherInfo}=user._doc;
        res.status(200).json(everyOtherInfo);
    }catch(err){
        res.status(500).json(err)
    }
})

// GET all the users
router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    const query = req.query.new;

    try{
        const users= query ? await User.find().sort({_id:-1}).limit(1) : await User.find() 
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err)
    }
})


// GET user stats from last year
router.get("/stats", verifyTokenAndAdmin, async (req,res)=>{
    const date= new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1))
    
    try{
        const data = await User.aggregate([
          { $match: { createdAt: { $gte: lastYear } } },
          {
            $project: {
              month: { $month: "$createdAt" },
            },
          },
          {
            $group: {
              _id: "$month",
              total: { $sum: 1 },
            },
          },
        ]);
        res.status(200).json(data)
      }
    catch(err){
        res.status(500).json(err);
    }
})


export default router;