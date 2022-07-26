const usermodel= require("../models/userModel")
const { isValid, isValidBody, isValidName, isValidMail, isValidImg, isValidPh, isValidPassword, isValidPincode, isValidStreet, securepw } = require("../validation/validation")
const {uploadFile}=require("../aws/aws")

const createUser=async function(req,res){
    try{
    let data= req.body
    if(isValidBody(data)) return res.status(400).send({status:false,message:"Body Should not be empty"})
    let files= req.files
    const {fname,lname,email,phone,password,address,profileImage}= data
    let arr=["fname","lname","email","phone","password","address"]
       for(let i=0;i<arr.length;i++){
          if(!(arr[i] in data)){
             return res.status(400).send({status:false,message:`${arr[i]} is required`})
          }
       }
    
    if(!isValid(fname)) return res.status(400).send({status:false,message:"fname shouldnot be empty"})
    if(!isValidName(fname)) return res.status(400).send({status:false,message:"Pls Enter Valid First Name"})
    if(!isValid(lname)) return res.status(400).send({status:false,message:"lname shouldnot be empty"})
    if(!isValidName(lname)) return res.status(400).send({status:false,message:"Pls Enter Valid Last Name"})
    if(!isValid(email)) return res.status(400).send({status:false,message:"email shouldnot be empty"})
    if(!isValidMail(email)) return res.status(400).send({status:false,message:"Pls enter EmailId in Valid Format"})
    
    if(!isValid(phone)) return res.status(400).send({status:false,message:"phone shouldnot be empty"})
    if(!isValidPh(phone)) return res.status(400).send({status:false,message:"Phone No.Should be valid INDIAN no."})
    if(!isValid(password)) return res.status(400).send({status:false,message:"password shouldnot be empty"})
    if(!isValidPassword(password)) return res.status(400).send({status:false,message:"Password must be in 8-15 characters long and it should contains 1 Upper 1 lower 1 digit and 1 special character atleast"})
    //——————————————————————————————Address Validations
    if(typeof address=== "string") return res.status(400).send({status:false,message:"Address should be an Object"})
    if (typeof address==="object"){
    if(isValidBody(address)) return res.status(400).send({status:false,message:"Address Should not be empty"})
    if(!("shipping" in address)) return res.status(400).send({status:false,message:"Shipping is required in address"})
    if(typeof address.shipping=== "string") return res.status(400).send({status:false,message:"Shipping in Address Should be an object"})
    if(isValidBody(address.shipping)) return res.status(400).send({status:false,message:"Shipping Should not be empty"})

    let required= ["street","city","pincode"]
    for(let i=0;i<required.length;i++){
        if(!(required[i] in address.shipping)) return res.status(400).send({status:false,message:`${required[i]} is required in Shipping`})}

    if(!isValid(address.shipping.street)) return res.status(400).send({status:false,message:"Street should not be empty in Shipping"})
    if(!isValid(address.shipping.city)) return res.status(400).send({status:false,message:"city should not be empty in shipping"})
    if(!isValidName(address.shipping.city)) return res.status(400).send({status:false,message:"Pls Enter Valid City Name in Shipping"})
    if(!isValid(address.shipping.pincode)) return res.status(400).send({status:false,message:"Pincode should not be empty in shipping"})
    if(!isValidPincode(address.shipping.pincode)) return res.status(400).send({status:false,message:"Pls Enter Valid PAN PINCODE in Shipping"})
    //——————————————————————————————Address Billing Validations
    if(!("billing" in address)) return res.status(400).send({status:false,message:"Billing Is required in address"})
    if(typeof address.billing === "string") return res.status(400).send({status:false,message:"billing should be an Object"})
    if(isValidBody(address.billing)) return res.status(400).send({status:false,message:"Billing Should not be empty"})

    let required1= ["street","city","pincode"]
    for(let i=0;i<required1.length;i++){
        if(!(required1[i] in address.billing)) return res.status(400).send({status:false,message:`${required1[i]} is required in Billing`})}
    
    if(!isValid(address.billing.street)) return res.status(400).send({status:false,message:"Street should not be empty in Billing"})
    if(!isValid(address.billing.city)) return res.status(400).send({status:false,message:"city should not be empty in Billing"})
    if(!isValidName(address.billing.city)) return res.status(400).send({status:false,message:"Pls Enter Valid City Name in Billing"})
    if(!isValid(address.billing.pincode)) return res.status(400).send({status:false,message:"Pincode should not be empty in Billing"})
    if(!isValidPincode(address.billing.pincode)) return res.status(400).send({status:false,message:"Pls Enter Valid PAN PINCODE in Billing"})
    }

    if(await usermodel.findOne({email})) return res.status(400).send({status:false,message:`${email} is already exists`})
    if(await usermodel.findOne({phone})) return res.status(400).send({status:false,message:`${phone} is already exists`})

    data.password=await securepw(data.password)
    if(files && files.length>0){
    if(!(isValidImg(files[0].mimetype))){
        return res.status(400).send({status:false,message:"Image Should be of JPEG/ JPG/ PNG"})
    }
    let uploadedFileURL= await uploadFile(files[0])
    data.profileImage =uploadedFileURL
    let saveddata= await usermodel.create(data)
    res.status(201).send({status:true,message:"Success",data:saveddata}) }
    else{ res.status(400).send({ status:false,message: "profileImage is Required" })}
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}









module.exports={createUser}