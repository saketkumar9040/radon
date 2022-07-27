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

//—————————————————————————————————————————getProductById————————————————————————————————————————————————————————————————————————

const getProductById= async function(req,res){
    let id= req.params.productId
    if(!isValidObjectId(id)) return res.status(400).send({status:false,message:"Enter Id in valid Format"})
    
    let data= await productModel.findById(id)
    if(!data) return res.status(400).send({status:false,message:"No Data found wih this ID"})
    if(data.isDeleted == true){return res.status(400).send({status:false,message:"This product is Deleted"})}
    res.status(200).send({status:true,data:data})
}

const delProductById=async function(req,res){
    let id= req.params.productId
    if(!isValidObjectId(id)) return res.status(400).send({status:false,message:"Enter Id in valid Format"})
    
    let data= await productModel.findById(id)
    if(!data) return res.status(400).send({status:false,message:"No Data found wih this ID"})
    if(data.isDeleted == true){return res.status(400).send({status:false,message:"This product is already Deleted"})}

    date=new Date().toISOString()
    await productModel.findOneAndUpdate({_id:id},{isDeleted:true,deletedAt:date})

    res.status(200).send({status:true,message:"Product is deleted Successfully"})

}


module.exports={createProduct,getProductById,delProductById}

      