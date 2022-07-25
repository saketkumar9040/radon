const usermodel= require("../models/userModel")
const { isValid, isValidBody, isValidName, isValidMail, isValidImg, isValidPh, isValidPassword, isValidPincode, isValidStreet } = require("../validation/validation")
// fname: {type:String,required:true},
//     lname: {type:String, required:true},
//     email: {type:String, required:true,unique:true},
//     profileImage: {type:String, required:true}, // s3 link
//     phone: {type:String, required:true, unique:true}, 
//     password: {type:String, required:true, min:8, max:15}, // encrypted password
//     address: {
//       shipping: {
//         street: {type:String, required:true},
//         city: {type:String, required:true},
//         pincode: {type:Number, required:true}
//       },
//       billing: {
//         street: {type:String, required:true},
//         city: {type:String, required:true},
//         pincode: {type:Number, required:true}
//       }
//     }
const createUser=async function(req,res){
 
    let data= req.body
    if(isValidBody(data)) return res.status(400).send({status:false,message:"Body Should not be empty"})
    const {fname,lname,email,phone,password,address,profileImage}= data
        

    
    if(!("fname" in data)) return res.status(400).send({status:false,message:"fname is required"})
    if(!("lname" in data)) return res.status(400).send({status:false,message:"lname is required"})
    if(!("email" in data)) return res.status(400).send({status:false,message:"email is required"})
    if(!("profileImage" in data))return res.status(400).send({status:false,message:"profileImage is required"})
    if(!("phone" in data)) return res.status(400).send({status:false,message:"phone is required"})
    if(!("password" in data)) return res.status(400).send({status:false,message:"password is required"})
    if(!("address" in data)) return res.status(400).send({status:false,message:"address is required"})
    if(!("shipping" in address)) return res.status(400).send({status:false,message:"shipping is required in address"})
    if(!("street" in address.shipping)) return res.status(400).send({status:false,message:"street is required in shipping"})
    if(!("city" in address.shipping)) return res.status(400).send({status:false,message:"city is required in shipping"})
    if(!("pincode" in address.shipping)) return res.status(400).send({status:false,message:"pincode is required in shipping"})
    if(!("billing" in address)) return res.status(400).send({status:false,message:"billing is required in address"})
    if(!("street" in address.billing)) return res.status(400).send({status:false,message:"street is required in billing"})
    if(!("city" in address.billing)) return res.status(400).send({status:false,message:"city is required in billing"})
    if(!("pincode" in address.billing)) return res.status(400).send({status:false,message:"pincode is required in billing"})
    
    if(!isValid(fname)) return res.status(400).send({status:false,message:"fname shouldnot be empty"})
    if(!isValidName(fname)) return res.status(400).send({status:false,message:"Pls Enter Valid First Name"})
    if(!isValid(lname)) return res.status(400).send({status:false,message:"lname shouldnot be empty"})
    if(!isValidName(lname)) return res.status(400).send({status:false,message:"Pls Enter Valid Last Name"})
    if(!isValid(email)) return res.status(400).send({status:false,message:"email shouldnot be empty"})
    if(!isValidMail(email)) return res.status(400).send({status:false,message:"Pls enter valid email id"})
    if(!isValid(profileImage))return res.status(400).send({status:false,message:"profileImage shouldnot be empty"})
    //if(!isValidImg(profileImage))return res.status(400).send({status:false,message:"Img should be of jpg|png|gif|bmp"})
    if(!isValid(phone)) return res.status(400).send({status:false,message:"phone shouldnot be empty"})
    if(!isValidPh(phone)) return res.status(400).send({status:false,message:"Phone No.Should be valid INDIAN no."})
    if(!isValid(password)) return res.status(400).send({status:false,message:"password shouldnot be empty"})
    if(!isValidPassword(password)) return res.status(400).send({status:false,message:"Password must be in 8-15 characters long and it should contains 1 Upper 1 lower 1 digit and 1 special character atleast"})
    if(typeof address== String) return res.status(400).send({status:false,message:"Address should be an Object"})
    if(isValidBody(address)) return res.status(400).send({status:false,message:"Address Should not be empty"})
    if(typeof address.shipping== String) return res.status(400).send({status:false,message:"Shipping should be an Object"})
    if(isValidBody(address.shipping)) return res.status(400).send({status:false,message:"Shipping Should not be empty"})
    if(!isValid(address.shipping.street)) return res.status(400).send({status:false,message:"street should not be empty"})
   // if(!isValidStreet(street)) return res.status(400).send({status:false,message:"Pls Enter Valid Street Address in Shipping"})
    if(!isValid(address.shipping.city)) return res.status(400).send({status:false,message:"city should not be empty"})
    if(!isValidName(address.shipping.city)) return res.status(400).send({status:false,message:"Pls Enter Valid City Name"})
    if(!isValid(address.shipping.pincode)) return res.status(400).send({status:false,message:"pincode should not be empty"})
    if(!isValidPincode(address.shipping.pincode)) return res.status(400).send({status:false,message:"Pls Enter Valid PAN PINCODE"})
    if(typeof address.billing== String) return res.status(400).send({status:false,message:"address.billinging should be an Object"})
    if(isValidBody(address.billing)) return res.status(400).send({status:false,message:"address.billinging Should not be empty"})
    if(!isValid(address.billing.street)) return res.status(400).send({status:false,message:"street should not be empty in address.billinging"})
   // if(!isValidStreet(address.billing.street))return res.status(400).send({status:false,message:"Pls Enter Valid Street Address in address.billinging"})
    if(!isValid(address.billing.city)) return res.status(400).send({status:false,message:"city should not be empty in address.billinging"})
    if(!isValidName(address.billing.city)) return res.status(400).send({status:false,message:"Pls Enter Valid City Name in address.billinging"})
    if(!isValid(address.billing.pincode)) return res.status(400).send({status:false,message:"pincode should not be empty in address.billinging"})
    if(!isValidPincode(address.billing.pincode)) return res.status(400).send({status:false,message:"Pls Enter Valid PAN PINCODE in Billing"})

    //let CheckData=await usermodel.findOne({$or}) 

    let saveddata= await usermodel.create(data)
    res.status(201).send({status:true,message:"Success",data:saveddata})



//
}









module.exports={createUser}