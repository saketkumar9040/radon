const cartModel = require("../models/cartModel")
const usermodel = require("../models/userModel")
const productModel = require("../models/productModel")
const { isValid, isValidBody, isValidSize, isValidTName, isValidImg, isValidName, isValidObjectId } = require("../validation/validation")
const userModel = require("../models/userModel")

//—————————————————————————————————————————[ Create Cart ]———————————————————————————————————————————————————
const createCart = async function (req, res) {
    let userId= req.params.userId
    let body= req.body
    if(isValidBody(body)) return res.status(400).send({status:false,message:"Body Should Not Be Empty"})
    let {productId,cartId,quantity} = body
    if(!("productId") in body) return res.status(400).send({status:false,message:"ProductId is required"})
    if(!isValid(productId))return res.status(400).send({status:false,message:"ProductId Should Not Be Empty"})
    if(!isValidObjectId(productId)) return res.status(400).send({status:false,message:`This ${productId} is not Valid`})
    let product =await productModel.findById(productId)
    // console.log(product.price)
    if(!product) return res.status(400).send({status:false,message:`No Product With This Id ${productId}`})
    if("quantity" in body) {
        let str=""
        if(!isValid(quantity)) return res.status(400).send({status:false,message:"Quantity Should Not Be empty"})
        let split= quantity.toString().trim().split("").filter(e=>e!="")
        for(let i=0;i<split.length;i++){  if(isNaN(parseInt(split[i]))) {str+=split[i]}  }
        if(str.length>1) return res.status(400).send({status:false,message:`(${str}) is not A number`})
        quantity= quantity}
    else{ quantity=1}
    let cart= await cartModel.findOne({_id:cartId,userId:userId})
    if(!cart){
        let obj={
            userId:userId,   items:[{productId:productId,quantity:quantity}],
            totalPrice:product.price*parseInt(quantity),  totalItems:1
        } 
        let data= await cartModel.create(obj)
        let response={_id:data._id,userId:userId,items:[{productId:data.items[0].productId,quantity:data.items[0].quantity}],totalItems:data.totalItems,totalPrice:data.totalPrice,createdAt:data.createdAt,updatedAt:data.updatedAt}
        res.status(201).send({status:true,message:"SuccessFully Created",data:response})
    }else{
        if(!"cartId" in body) return res.status(400).send({status:false,message:"CartId Is Necessary"})
        if(!isValid(cartId)) return res.status(400).send({status:false,message:"CartId should not be empty"})
        if(!isValidObjectId(cartId))return res.status(400).send({status:false,message:`${cartId} not a Valid Id`})
        // let cart= await cartModel.findOne({_id:cartId,userId:userId})
       // if(!cart) return res.status(400).send({status:false,message:`with this (${cartId}) no cart exists `})
       // let cartItems= cart.items
        for(let i=0;i<cart.items.length;i++){
        if(cart.items[i].productId==productId){
            let obj={
                items:[{productId:productId,quantity:quantity+parseInt(cart.items[i].quantity)}],
                totalPrice:cart.totalPrice+product.price*parseInt(quantity),  totalItems:cartItems.length
            }
           let updateData= await cartModel.findOneAndUpdate({_id:cartId},obj,{new:true})
           let response={_id:updateData._id,userId:updateData.userId,items:[{productId:updateData.items[0].productId,quantity:updateData.items[0].quantity}],totalItems:updateData.totalItems,totalPrice:updateData.totalPrice,createdAt:updateData.createdAt,updatedAt:updateData.updatedAt}
           return res.status(201).send({status:true,message:"Successfully Created",data:response})
        }
    }
    let obj={
        $push:{items:{productId:productId,quantity:quantity}},
        $set:{totalPrice:cart.totalPrice+product.price*parseInt(quantity), totalItems:cartItems.length+1}
    }
    let updateData= await cartModel.findOneAndUpdate({_id:cartId},obj,{new:true})
    
    // let response={_id:updateData._id,userId:updateData.userId,items:items,totalItems:updateData.totalItems,totalPrice:updateData.totalPrice,createdAt:updateData.createdAt,updatedAt:updateData.updatedAt}
    return res.status(201).send({status:true,message:"Successfully Created",data:updateData})
    }
}

//—————————————————————————————————————————[ Get Cart Details ]——————————————————————————————————————————————

const getCartDetails = async (req, res) => {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Enter userId in valid format" })
        if (!await userModel.findById(userId)) return res.status(400).send({ status: false, message: "No such  user exists" })

        let findCart = await cartModel.findOne({ userId: userId }).select({_id:1,userId:1,items:{productId:1,quantity:1},totalPrice:1,totalItems:1,createdAt:1,updatedAt:1})
        if (!findCart) return res.status(404).send({ status: false, message: "No such cart Exists" })
     
        res.status(200).send({ status: true, message: "Successful", data: findCart })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }

}
//———————————————————————————————————————[ Update Cart Details ]——————————————————————————————————————————————

const updateCart= async(req,res)=>{
   let body= req.body
   let {cartId,productId,removeProduct}=body

   if(!("cartId" in body)) return res.status(400).send({status:false,message:"Please enter cart Id in body "})
   if(!("productId" in body))return res.status(400).send({status:false,message:"Please enter product Id in body"})
   if(!("removeProduct" in body))return res.status(400).send({status:false,message:"Please enter removeProduct in body"})
   if(!(isValid(cartId)))return res.status(400).send({status:false,message:" cart Id should not be empty "})
   if(!(isValid(productId)))return res.status(400).send({status:false,message:" Product Id should not be empty "})
   if(!(isValid(removeProduct)))return res.status(400).send({status:false,message:" Remove Product should not be empty "})
   if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "Enter cartId in valid format" })
   let cart = await cartModel.findOne({_id:cartId})
   if(!cart) return res.status(404).send({status:false,message:"No such cart exists"})

   if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Enter productId in valid format"})
   if(!(await productModel.findOne({_id:productId,isDeleted:false})))return res.status(404).send({status:false,message:"No such product exists"})

   if(!(removeProduct==="1"||removeProduct==="0")) return res.status(400).send({ status: false, message: "Removed product should be '0' or '1'" })
   if(removeProduct==="0"){
    let updatedCart=await cartModel.findOneAndUpdate({_id:cartId},{items:[]},{new:true})
    res.status(200).send({status:true,message:"cart updated successfully",data:updatedCart})
}else{
     if(!(cart.totalItems>0))return res.status(400).send({ status: false, message: " No items to delete" })
       let updatedCart=await cartModel.findOneAndUpdate({_id:cartId},{items:{productId:productId,$inc:{quantity:-1}
    }},{new:true})
    res.status(200).send({status:true,message:"cart updated successfully",data:updatedCart})

   }
//    res.status(200).send({status:true,message:"cart updated successfully",data:updatedCart})
   
}
//—————————————————————————————————————————[ Delete Cart ]————————————————————————————————————————————————————

const deleteCart = async (req, res) => {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Enter userId in valid format" })
        if (!await userModel.findById(userId)) return res.status(400).send({ status: false, message: "No such user exists" })
        let findCart = await cartModel.findOneAndUpdate({ userId: userId }, { items: [], totalItems: 0, totalPrice: 0 })
        if (!findCart) return res.status(404).send({ status: false, message: "No such cart Exists" })
        console.log(findCart)
        res.status(204).send({ status: true, message: "cart Deleted Successfully" })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

module.exports = { createCart, getCartDetails, deleteCart ,updateCart}