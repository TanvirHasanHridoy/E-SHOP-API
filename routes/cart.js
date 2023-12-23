import express from "express";
import {verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from "./verifytokens.js";
import Cart from "../models/Cart.js";

const router =express.Router();

// CREATE 
router.post('/', verifyToken, async( req,res)=>{
    const newCart= new Product(req.body)
    try{
        const savedProduct = await newCart.save();
        res.status(200).json(savedProduct);
    }
    catch(err){
        res.status(500).json(err)
    }
})

// UPDATE the product
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  
   try{
       const updatedCart=  await Product.findByIdAndUpdate(req.params.id, {
        $set:req.body
       },{new:true}) ;
       res.status(200).json(updatedCart)
   }
   catch(err) {
    res.status(500).json(err);
   }
})

// DELETE CART

router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id) 
        res.status(200).json("Cart deleted!")
    }catch(err){
        res.status(500).json(err)
    }
})


// GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const cart= await Cart.findOne({userId:req.params.userId}) ;
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json(err)
    }
})

// GET all Carts
router.get("/", verifyTokenAndAdmin,  async (req,res)=>{
    try{
        const carts= await Cart.find();
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err);
}}
);


export default router;