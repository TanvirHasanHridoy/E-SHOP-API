import express from "express";
import {verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from "./verifytokens.js";
import Product from "../models/Product.js";

const router =express.Router();

// CREATE PRODUCT
router.post('/', verifyTokenAndAdmin, async( req,res)=>{
    const newProduct= new Product(req.body)
    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }
    catch(err){
        res.status(500).json(err)
    }
})

// UPDATE the product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  
   try{
       const updatedProduct=  await Product.findByIdAndUpdate(req.params.id, {
        $set:req.body
       },{new:true}) ;
       res.status(200).json(updatedProduct)
   }
   catch(err) {
    res.status(500).json(err);
   }
})

// DELETE the PRODUCT

router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id) 
        res.status(200).json("PRODUCT deleted!")
    }catch(err){
        res.status(500).json(err)
    }
})


// GET Product
router.get("/find/:id", async (req,res)=>{
    try{
        const product= await Product.findById(req.params.id) ;
        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err)
    }
})

// GET all the Products
router.get("/",  async (req,res)=>{
    const queryForNew = req.query.new;
    const queryForCategories = req.query.categories;

    try{
        let products;
        
        if(queryForNew){
            products= await Product.find().sort({createdAt:-1}).limit(5)
        }
        else if(queryForCategories){
            console.log("It was query for categiry")
            products= await Product.find({categories:{
                $in :[queryForCategories]
            }})
        }
        else{
            products= await Product.find();
        }
        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err)
    }
})


export default router;