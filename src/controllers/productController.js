const productModel=require("../models/productModel")
const { isValid, isValidBody,isValidCurrency ,isValidSize,isValidTName,isValidImg, isValidName, isValidObjectId} = require("../validation/validation")
const { uploadFile } = require("../aws/aws")

const createProduct= async (req,res)=>{
    try{
    let data =req.body 
    let files=req.files
    if(isValidBody(data)){return res.status(400).send({status:false,message:"Body Should Not Be Empty"})}
    let{title,description,price,currencyId, currencyFormat,style,availableSizes}=data

    let arr=["title","description","price","availableSizes","style"]
        for (let i = 0; i < arr.length; i++) {
            if (!((arr[i] in data))) {
                return res.status(400).send({ status: false, message: `${arr[i]} is required` })}
            }
    if(!isValid(title))return res.status(400).send({ status: false, message: `Title should not be empty` })
    if(!isValidTName(title))return res.status(400).send({ status: false, message: `${title} is not a valid title` })
    if(await productModel.findOne({title:title}))return res.status(400).send({ status: false, message: `${title} already  exists` })
    
    if(!isValid(description))return res.status(400).send({ status: false, message: `Description should not be empty` })

    if(!isValid(price))return res.status(400).send({ status: false, message: `price should not be empty` })
   // if( price !== Number)return res.status(400).send({ status: false, message: `${price} is not a valid Indian Currency` })
    
    if(currencyId){
      if( currencyId!="INR") return res.status(400).send({ status: false, message: `Currency Id should Be INR` })}
      data.currencyId="INR"

      if(currencyFormat){
      if( currencyFormat!="₹") return res.status(400).send({ status: false, message: `Currency format should Be ₹ `})}
      data.currencyFormat="₹"
    
   if(!isValid(style)){ return res.status(400).send({ status: false, message: "Style should not be empty" })}
   if(!isValidName(style)){ return res.status(400).send({ status: false, message: `${style} is not a valid style name` })}

   if(!isValidSize(availableSizes)){ return res.status(400).send({ status: false, message: "Please select from the given sizes S, XS, M, X, L, XXL, XL" })}

//    if(installments){
//     if(!isValid(installments))return res.status(400).send({ status: false, message: `Installments cannot be empty` })
//     if(!isValidCurrency(installments))return res.status(400).send({ status: false, message: `${installments} is not a valid Installments` })}
if (files && files.length > 0) {
    if (!(isValidImg(files[0].mimetype))) {
        return res.status(400).send({ status: false, message: "Image Should be of JPEG/ JPG/ PNG" })
    }
    let uploadedFileURL = await uploadFile(files[0])
    data.productImage = uploadedFileURL
}else{
    return res.status(400).send({ status: false, message: "Product image is required" })
}
data.deletedAt=null
     let saveddata=await productModel.create(data)
      res.status(201).send({status:true,message:"Product Created Successfully",data:saveddata})
}catch(error){
   return res.status(500).send({status:false,message:error.message})
}
}

//—————————————————————————————————————————UpdateProductById————————————————————————————————————————————————————————————————————————
const updateProduct= async function(req,res){
    try{
    let id= req.params.productId
    if(!isValidObjectId(id)) return res.status(400).send({status:false,message:"Enter Id in valid Format"})
    
    let data= await productModel.findById(id)
    if(!data) return res.status(404).send({status:false,message:"No Data found wih this ID"})
    if(data.isDeleted == true){return res.status(404).send({status:false,message:"This product is Deleted"})}

    let body= req.body
    let files= req.files
    if(!files){
    if(isValidBody(body)) return res.status(400).send({status:false,message:"Pls enter Some Data To update"})
    }
    let {title,description,price,productImage,style,availableSizes,installments} = body
//     title: {string, mandatory, unique},
//   description: {string, mandatory},
//   price: {number, mandatory, valid number/decimal},
//   currencyId: {string, mandatory, INR},
//   currencyFormat: {string, mandatory, Rupee symbol},
//   isFreeShipping: {boolean, default: false},
//   productImage: {string, mandatory},  // s3 link
//   style: {string},
//   availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]},
//   installments: {number},
 
     if("title" in body){
        if(!isValid(title)) return res.status(400).send({status:false,message:"Title should not be empty"})
        if(!isValidTName(title)) return res.status(400).send({status:false,message:"Enter Valid Title Name"})
        if(await productModel.findOne({title:title})) return res.status(400).send({status:false,message:`${title} is already exists`})
        data.title=title
     }
     if("description" in body){
        if(!isValid(description)) return res.status(400).send({status:false,message:"Description should not be empty"})
        data.description=description
     }
     if("price" in body){
        if(!isValid(price)) return res.status(400).send({status:false,message:"Price should not be empty"})
        data.price=price
     }
     if("isFreeShipping" in body){
        if(!isValid(isFreeShipping)) return res.status(400).send({status:false,message:"isFreeShipping should not be empty"})
        if(typeof isFreeShipping !== "boolean") return res.status(400).send({status:false,message:"isFreeShipping should be only True False"})
        data.isFreeShipping=isFreeShipping
     }
     if (files && files.length > 0) {
        if (!(isValidImg(files[0].mimetype))) {
            return res.status(400).send({ status: false, message: "Image Should be of JPEG/ JPG/ PNG" })
        }
        let uploadedFileURL = await uploadFile(files[0])
        data.productImage = uploadedFileURL
    }
     if("style" in body){
        if(!isValid(style)) return res.status(400).send({status:false,message:"Style should not be empty"})
        if(!isValidTName(style)) return res.status(400).send({status:false,message:"Pls Enter Valid Style Category"})
        data.style=style
     }
     if("availableSizes" in body){
         if(!isValid(availableSizes)) return res.status(400).send({status:false,message:"AvailableSizes should not be empty"})
         if(!isValidSize(availableSizes)) return res.status(400).send({status:false,message:" Sizes should be from these ['S', 'XS','M','X', 'L','XXL','XL']"})
         data.availableSizes=availableSizes
        }
        
        if("installments" in body){
         if(!isValid(installments)) return res.status(400).send({status:false,message:"installments should not be empty"})
         if(typeof installments !== Number) return res.status(400).send({status:false,message:"Installments Should be Of Number Type"})
         data.installments=installments
     }

     data.save()
     res.status(200).send({status:false,message:"Updated Successfully" ,data:data})
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}








//—————————————————————————————————————————getProductById————————————————————————————————————————————————————————————————————————

const getProductById= async function(req,res){
    let id= req.params.productId
    
    if(!isValidObjectId(id)) return res.status(400).send({status:false,message:"Enter Id in valid Format"})
    
    let data= await productModel.findById(id)
    if(!data) return res.status(404).send({status:false,message:"No Data found wih this ID"})
    if(data.isDeleted == true){return res.status(404).send({status:false,message:"This product is Deleted"})}
    res.status(200).send({status:true,data:data})
}
//—————————————————————————————————————————delProductById————————————————————————————————————————————————————————————————————————

const delProductById=async function(req,res){
    let id= req.params.productId
    if(!isValidObjectId(id)) return res.status(400).send({status:false,message:"Enter Id in valid Format"})
    
    let data= await productModel.findById(id)
    if(!data) return res.status(404).send({status:false,message:"No Data found wih this ID"})
    if(data.isDeleted == true){return res.status(404).send({status:false,message:"This product is already Deleted"})}

    date=new Date().toISOString()
    await productModel.findOneAndUpdate({_id:id},{isDeleted:true,deletedAt:date})

    res.status(200).send({status:true,message:"Product is deleted Successfully"})

}



module.exports={createProduct,getProductById,delProductById,updateProduct}

      