const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const orderModel=require("../models/orderModel")
const { isValid, isValidBody, isValidSize, isValidTName, isValidImg, isValidName, isValidObjectId } = require("../validation/validation")

const createOrder=async(req,res)=>{

   try{
     let userId=req.params.userId
     if(!isValidObjectId(userId))return res.status(400).send({status:false,message:"User Id is not in valid format"})
     let userExists=await userModel.findOne({_id:userId,isDeleted:false})
     if(!userExists)return res.status(404).send({status:false,message:"No such user exists"})
     let userCart=await cartModel.findOne({userId:userId})
     if(!userCart)return res.status(404).send({status:false,message:"No such cart exists for the given user"})
     

     let data=req.body
     data.userId=userId
     data.items=userCart.items
     data.totalPrice=userCart.totalPrice
     data.totalItems=userCart.totalItems

     let cartTotalItems=0
    for(let i=0;i<userCart.items.length;i++){
      cartTotalItems+=userCart.items[i].quantity
        
    }

     data.totalQuantity=cartTotalItems

     if("cancellable" in data){
        if(!isValid(data.cancellable)) return res.status(400).send({status:false,message:"cancellable should not be empty"})
        if(!(data.cancellable==="true"||data.cancellable==="false")){
           return res.status(400).send({status:false,message:"cancellable should be either true or false and in (lowerCase)"})
        }
    }

     if("status" in data){
        if(!isValid(data.status)) return res.status(400).send({status:false,message:"status should not be empty"})
     if(!(data.status==="pending"||data.status==="completed"||data.status==="cancled")){
        return res.status(400).send({status:false,message:"Status should be either of these [pending, completed, cancled] "})}
     }
     let savedData=await orderModel.create(data)
     res.status(201).send({status:true,message:"Order Created Successfully",data:savedData})
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

const updateOrder= async(req,res)=>{

   let userId=req.params.userId

   let data=req.body
   let{orderId}=data
   if(!"orderId" in data)return res.status(400).send({status:false,message:"Please enter object Id in body"})
   if(!isValid(orderId))return res.status(400).send({status:false,})
   if(!isValidObjectId(orderId))return res.status(400).send({status:false,message:"Please enter a valid object Id"})
   let orderExists=await orderModel.findOne({_id:orderId,userId:userId})
   if(!orderExists)return res.status(404).send({status:false,message:"This order doesn't belongs to the users "})

   if(orderExists.status=="cancled")return res.status(400).send({status:false,message:"This order has already been cancelled"})

   if(orderExists.cancellable==false)return res.status(400).send({status:false,message:"The order user is trying to cancel is non-cancellable"})

   let updatedOrder=await orderModel.findOneAndUpdate({_id:orderId},{status:"cancled"},{new:true})
   return res.status(200).send({status:true,message:"Order Updated Successfully",data:updatedOrder})

}

module.exports={createOrder,updateOrder}