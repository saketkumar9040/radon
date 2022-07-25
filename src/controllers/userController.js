const usermodel= require("../models/userModel")
const { isValid, isValidBody, isValidName, isValidMail, isValidImg, isValidPh, isValidPassword, isValidPincode, isValidStreet, securepw } = require("../validation/validation")
const aws= require("aws-sdk")

const createUser=async function(req,res){
    try{
    let data= req.body
    if(isValidBody(data)) return res.status(400).send({status:false,message:"Body Should not be empty"})
    const {fname,lname,email,phone,password,address,profileImage}= data
       
    if(!("fname" in data)) return res.status(400).send({status:false,message:"fname is required"})
    if(!("lname" in data)) return res.status(400).send({status:false,message:"lname is required"})
    if(!("email" in data)) return res.status(400).send({status:false,message:"email is required"})
    // if(!("profileImage" in data))return res.status(400).send({status:false,message:"profileImage is required"})
    if(!("phone" in data)) return res.status(400).send({status:false,message:"phone is required"})
    if(!("password" in data)) return res.status(400).send({status:false,message:"password is required"})
    if(!("address" in data)) return res.status(400).send({status:false,message:"address is required"})
    
    if(!isValid(fname)) return res.status(400).send({status:false,message:"fname shouldnot be empty"})
    if(!isValidName(fname)) return res.status(400).send({status:false,message:"Pls Enter Valid First Name"})
    if(!isValid(lname)) return res.status(400).send({status:false,message:"lname shouldnot be empty"})
    if(!isValidName(lname)) return res.status(400).send({status:false,message:"Pls Enter Valid Last Name"})
    if(!isValid(email)) return res.status(400).send({status:false,message:"email shouldnot be empty"})
    if(!isValidMail(email)) return res.status(400).send({status:false,message:"Pls enter EmailId in Valid Format"})
   // if(!isValid(profileImage))return res.status(400).send({status:false,message:"profileImage shouldnot be empty"})
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
    if(!("street" in address.shipping)) return res.status(400).send({status:false,message:"Street In Shipping is required"})
    if(!("city" in address.shipping)) return res.status(400).send({status:false,message:"City In Shipping is required"})
    if(!("pincode" in address.shipping)) return res.status(400).send({status:false,message:"Pincode In Shipping is required"})
    if(!isValid(address.shipping.street)) return res.status(400).send({status:false,message:"Street should not be empty in Shipping"})
    if(!isValid(address.shipping.city)) return res.status(400).send({status:false,message:"city should not be empty in shipping"})
    if(!isValidName(address.shipping.city)) return res.status(400).send({status:false,message:"Pls Enter Valid City Name in Shipping"})
    if(!isValid(address.shipping.pincode)) return res.status(400).send({status:false,message:"Pincode should not be empty in shipping"})
    if(!isValidPincode(address.shipping.pincode)) return res.status(400).send({status:false,message:"Pls Enter Valid PAN PINCODE in Shipping"})
    //——————————————————————————————Address Billing Validations
    if(!("billing" in address)) return res.status(400).send({status:false,message:"Billing Is required in address"})
    if(typeof address.billing === "string") return res.status(400).send({status:false,message:"billing should be an Object"})
    if(isValidBody(address.billing)) return res.status(400).send({status:false,message:"Billing Should not be empty"})
    if(!("street" in address.billing)) return res.status(400).send({status:false,message:"Street In Billing is required"})
    if(!("city" in address.billing)) return res.status(400).send({status:false,message:"City In Billing is required"})
    if(!("pincode" in address.billing)) return res.status(400).send({status:false,message:"Pincode In Billing is required"})
    if(!isValid(address.billing.street)) return res.status(400).send({status:false,message:"Street should not be empty in Billing"})
    if(!isValid(address.billing.city)) return res.status(400).send({status:false,message:"city should not be empty in Billing"})
    if(!isValidName(address.billing.city)) return res.status(400).send({status:false,message:"Pls Enter Valid City Name in Billing"})
    if(!isValid(address.billing.pincode)) return res.status(400).send({status:false,message:"Pincode should not be empty in Billing"})
    if(!isValidPincode(address.billing.pincode)) return res.status(400).send({status:false,message:"Pls Enter Valid PAN PINCODE in Billing"})
    }

    if(await usermodel.findOne({email})) return res.status(400).send({status:false,message:`${email} is already exists`})
    if(await usermodel.findOne({phone})) return res.status(400).send({status:false,message:`${phone} is already exists`})

    data.password=await securepw(data.password)
    aws.config.update({
        accessKeyId: "AKIAY3L35MCRVFM24Q7U",
        secretAccessKey: "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",
        region: "ap-south-1"
    })
    
    let uploadFile= async ( file) =>{
       return new Promise( function(resolve, reject) {
        let s3= new aws.S3({apiVersion: '2006-03-01'}); 
        var uploadParams= {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",  
            Key: "abc/" + file.originalname, 
            Body: file.buffer
        }
        s3.upload( uploadParams, function (err, data ){
            if(err) {
                return reject({"error": err})
            }
            console.log(data)
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })
       })
    }
    let files= req.files
    if(files && files.length>0){
    let uploadedFileURL= await uploadFile(files[0])
    data.profileImage =uploadedFileURL
    let saveddata= await usermodel.create(data)
    res.status(201).send({status:true,message:"Success",data:saveddata}) }
    else{ res.status(400).send({ status:false,message: "No file found" })}
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}









module.exports={createUser}