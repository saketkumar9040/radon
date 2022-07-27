const mongoose=require("mongoose")

const productSchema=new mongoose.schema({
    
        title: {type:String, required:true, unique:true},
        description: {type:string, required:true},
        price: {type:number,required:true},// valid number/decimal
        currencyId: {type:String,required:true},// INR
        currencyFormat: {type:String, required:true },//Rupee symbol
        isFreeShipping: {type:boolean, default: false},
        productImage: {type:String, required:true},  // s3 link
        style: {type:String},
        availableSizes: {type:[String] ,enum:["S", "XS","M","X", "L","XXL", "XL"]},
        installments: {type:Number},
        deletedAt: {type:Date}, 
        isDeleted: {type:boolean, default: false}
      
},{timestamps:true})

module.exports=mongoose.model("product",productSchema)