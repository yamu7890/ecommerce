const express=require("express")
const router =express.Router()
const Product=require("../models/Product.js")


const isAdmin=(req,res,next)=>{
  const {role}=req.body
  if(role!="admin")
     return res.status(403).json({"message":"access defind only admin can add a product"})
    next()
}


router.post("/add",isAdmin, async(req,res)=>{
    try{
        const{name,price,description,category,stock}=req.body
        const newProduct = new Product({
         name,price,description,category,stock
        })
        await newProduct.save()
        return res.status(200).json({"message":"product added successfully"})
    }
    catch(err){
        console.log("got the error from add product route",err)
        
    }
})
 
router.get("/",async(req,res)=>{
    try{
        const product=await Product.find()
        res.status(200).json(product)
    }
    catch(err){
        console.log("error while fetching the product",err)
        res.status(500).json({"message":"error while fetching the products" })
    }
})

module.exports=router