const cartModel= require("../models/cartModel")
const usermodel = require("../models/userModel")
const productModel = require("../models/productModel")
const { isValid, isValidBody, isValidSize, isValidTName, isValidImg, isValidName, isValidObjectId } = require("../validation/validation")
//—————————————————————————————————————————Create Cart————————————————————————————————————————————————————

const createCart= async function(req,res){
try{
    let userId= req.params.userId
    let body= req.body
    let sum=0
    if(isValidBody(body)) return res.status(400).send({status:false,message:"Body Should not Be Empty"})
    if(!(await cartModel.findOne({userId:userId}))){
        let {quantity,productId,userId}= body
        if(!("productId" in body)) return res.status(400).send({status:false,message:"ProductId is Required"})
        if(!("quantity" in body)) return res.status(400).send({status:false,message:"Quantity is Required"})
        // if(!("userId" in body)) return res.status(400).send({status:false})
        if(!isValid(productId)) return res.status(400).send({status:false,message:"ProductId Should not be empty"})
        if(!isValidObjectId(productId)) return res.status(400).send({status:false,message:"Enter ProductId in valid format"})
        if(!(await productModel.findById(productId))) return res.status(400).send({status:false,message:"This Product Doesn't Exists"})
        if(!isValid(quantity)) return res.status(400).send({status:false,message:"Quantity Should be not empty"})
        if(isNaN(parseInt(quantity))) return res.status(400).send({status:false,message:"Quantity Should only be in a Number"})
        body.items= {
            productId:productId,
            quantity:quantity
        }
        body.userId=req.params.userId
        body.totalItems=quantity
        let price= await productModel.findById(productId).select({_id:0,price:1})
        console.log(price)
       let totlAmount= price.price*quantity
       sum=sum+totlAmount
        console.log(totlAmount);
        body.totalPrice= sum
        let savedData= await cartModel.create(body)
        res.status(201).send({status:true,message:"SuccessFully Cart Created",data:savedData})
    }
    else{
        let userid= req.params.userId
        console.log(userid)
        let cartId= await cartModel.findOne({userId:userid}).select({_id:1})
        console.log(cartId)
        let {quantity,productId,userId}= body
        if(!("productId" in body)) return res.status(400).send({status:false,message:"ProductId is Required"})
        if(!("quantity" in body)) return res.status(400).send({status:false,message:"Quantity is Required"})
        if(!isValid(productId)) return res.status(400).send({status:false,message:"ProductId Should not be empty"})
        if(!isValidObjectId(productId)) return res.status(400).send({status:false,message:"Enter ProductId in valid format"})
        if(!(await productModel.findById(productId))) return res.status(400).send({status:false,message:"This Product Doesn't Exists"})
        if(!isValid(quantity)) return res.status(400).send({status:false,message:"Quantity Should be not empty"})
        if(isNaN(parseInt(quantity))) return res.status(400).send({status:false,message:"Quantity Should only be in a Number"})
        body.totalItems=quantity
        let price= await productModel.findById(productId).select({_id:0,price:1})
        let totlAmount= price.price*quantity
        sum=sum+totlAmount
        console.log(totlAmount);
        body.totalPrice= sum
        let updateData= await cartModel.findOneAndUpdate({_id:cartId},{$push:{items:{
            productId:productId,
            quantity:quantity
        }
       },totalItems:quantity,totalPrice:totlAmount},{new:true})
    res.status(201).send({status:false,message:"Product Added To Cart Successfully",data:updateData})
    }
}
catch(err){
    console.log(err)
    res.status(500).send({status:false,message:err.message})
}
}

module.exports={createCart}