const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const orderModel=require("../models/orderModel")
const { isValid, isValidBody, isValidSize, isValidTName, isValidImg, isValidName, isValidObjectId } = require("../validation/validation")

const createOrder=async(req,res)=>{

    // {
    //     "_id": ObjectId("88abc190ef0288abc190ef88"),
    //     userId: ObjectId("88abc190ef0288abc190ef02"),
    //     items: [{
    //       productId: ObjectId("88abc190ef0288abc190ef55"),
    //       quantity: 2
    //     }, {
    //       productId: ObjectId("88abc190ef0288abc190ef60"),
    //       quantity: 1
    //     }],
    //     totalPrice: 50.99,
    //     totalItems: 2,
    //     totalQuantity: 3,
    //     cancellable: true,
    //     status: 'pending'
    //     createdAt: "2021-09-17T04:25:07.803Z",
    //     updatedAt: "2021-09-17T04:25:07.803Z",
    //   }
   try{
     let userId=req.params.userId
     if(!isValidObjectId(userId))return res.status(40).send({status:false,message:"User Id is not in valid format"})
     let userExists=await userModel.findOne({_id:userId,isDeleted:false})
     if(!userExists)return res.status(404).send({status:false,message:"No such user exists"})
     let userCart=await cartModel.findOne({usedId:usedId})
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
        if(data.cancellable!=="Boolean"){
           return res.status(400).send({status:false,message:"cancellable should be either true or false "})
        }
    }

     if("status" in data){
     if(data.status!=="pending"||data.status!=="completed"||data.status!=="cancled"){
        return res.status(400).send({status:false,message:"Status should be either of these [pending, completed, cancled] "})}
     }
     let savedData=await orderModel.create(data)
     res.status(201).send({status:true,message:"Order Created Successfully",data:savedData})
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

module.exports={createOrder}