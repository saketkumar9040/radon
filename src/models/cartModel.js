const mongoose=require("mongoose")
const objectId=mongoose.Schema.Types.ObjectId


const cartScehma= mongoose.Schema(
    {
        userId: {type: objectId, ref: "User", required:true, unique:true},
        items: {
          productId: {objectId, ref :"Product" , required:true},
          quantity: {type:Number, required:true, min :1}
        },
        totalPrice: {type:Number, required:true, comment: "Holds total price of all the items in the cart"},
        totalItems: {type:Number, required:true, comment: "Holds total number of items in the cart"}

    },{timestamps:true}
);
module.exports=mongoose.model("cart",cartScehma)