const cartModel = require("../models/cartModel")
const orderModel=require("../models/orderModel")
const { isValid, isValidObjectId } = require("../validation/validation")

//—————————————————————————————————————————[  Create Order  ]————————————————————————————————————————————————————
const createOrder=async(req,res)=>{

   try{
     let userId=req.params.userId

     let userCart=await cartModel.findOne({userId:userId})
     if(!userCart)return res.status(404).send({status:false,message:"No such cart exists for the given user"})
     
     let data=req.body
     data.userId=userId
     data.items=userCart.items
     data.totalPrice=userCart.totalPrice
     data.totalItems=userCart.totalItems
 
     let cartTotalItems=0
    for(let items of userCart.items){
      cartTotalItems+=items.quantity  
    }

     data.totalQuantity=cartTotalItems

     if("cancellable" in data){
        if(!isValid(data.cancellable)) return res.status(400).send({status:false,message:"cancellable field should not be empty"})
        if(!(data.cancellable==="true"||data.cancellable==="false")){
           return res.status(400).send({status:false,message:"cancellable should be either true or false and in (lowerCase)"})
        }
    }

     if("status" in data){
        if(!isValid(data.status)) return res.status(400).send({status:false,message:"status should not be empty"})
        if(data.status=="pending")return res.status(400).send({status:false,messgae:"You Can only cancel your order"})
     if(!(data.status==="cancled")){
        return res.status(400).send({status:false,message:"Status should be either of these [pending,cancled] "})}
     }
     if(userCart.items.length==0)return res.status(400).send({status:false,message:"Your cart is empty To create an order please add some items"})
     let savedData=await orderModel.create(data)
     userCart.items=[]
     userCart.totalItems=0
     userCart.totalPrice=0
     userCart.save()
     res.status(201).send({status:true,message:"Order Created Successfully",data:savedData})
    }
    catch(err){
      console.log(err)
        return res.status(500).send({status:false,message:err.message})
    }
}

//—————————————————————————————————————————[  Update User  ]————————————————————————————————————————————————————
const updateOrder= async(req,res)=>{
   try{
   let userId=req.params.userId

   let data=req.body
   let{orderId}=data
   if(!"orderId" in data)return res.status(400).send({status:false,message:"Please enter order Id in body"})
   if(!isValid(orderId))return res.status(400).send({status:false,message:"Order Id should not be empty"})
   if(!isValidObjectId(orderId))return res.status(400).send({status:false,message:"Please enter a valid object Id"})
   let orderExists=await orderModel.findOne({_id:orderId,userId:userId})
   if(!orderExists)return res.status(404).send({status:false,message:"This order doesn't belongs to the users "})

   if(orderExists.status=="cancled")return res.status(400)
   .send({status:false,message:`(${orderId}) is already cancelled please create another order for updations `})

   if(orderExists.cancellable==false)return res.status(400).send({status:false,message:"The order that you have been trying to cancel is under non-cancellable property"})

   let updatedOrder=await orderModel.findOneAndUpdate({_id:orderId},{status:"cancled",deletedAt:new Date(),isDeleted:true},{new:true})
   return res.status(200).send({status:true,message:"Order Updated Successfully",data:updatedOrder})
   }catch(err){
      return res.status(500).send({status:false,message:err.message})
   }
} 

module.exports={createOrder,updateOrder}