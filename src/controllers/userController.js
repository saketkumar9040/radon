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
    const {fname,lname,email,phone,password,address}= data
    const {street,city,pincode}=address.shipping
    const {bill}=address.billing

    
    if(isValidBody(data)) return res.status(400).send({status:false,message:"Body Should not be empty"})
    if(!("fname" in data)) return res.status(400).send({status:false,message:"fname is required"})
    if(!("lname" in data)) return res.status(400).send({status:false,message:"lname is required"})
    if(!("email" in data)) return res.status(400).send({status:false,message:"email is required"})
    if(!("profileImage" in data))return res.status(400).send({status:false,message:"profileImage is required"})
    if(!("phone" in data)) return res.status(400).send({status:false,message:"phone is required"})
    if(!("password" in data)) return res.status(400).send({status:false,message:"password is required"})
    if(!("address" in data)) return res.status(400).send({status:false,message:"address is required"})
    if(!("shipping" in address)) return res.status(400).send({status:false,message:"shipping is required in address"})
    if(!("street" in shipping)) return res.status(400).send({status:false,message:"street is required in shipping"})
    if(!("city" in shipping)) return res.status(400).send({status:false,message:"city is required in shipping"})
    if(!("pincode" in shipping)) return res.status(400).send({status:false,message:"pincode is required in shipping"})
    if(!("billing" in address)) return res.status(400).send({status:false,message:"billing is required in address"})
    if(!("street" in bill)) return res.status(400).send({status:false,message:"street is required in billing"})
    if(!("city" in bill)) return res.status(400).send({status:false,message:"city is required in billing"})
    if(!("pincode" in bill)) return res.status(400).send({status:false,message:"pincode is required in billing"})
    
    if(!isValid(fname)) return res.status(400).send({status:false,message:"fname shouldnot be empty"})
    if(!isValidName(fname)) return res.status(400).send({status:false,message:"Pls Enter Valid First Name"})
    if(!isValid(lname)) return res.status(400).send({status:false,message:"lname shouldnot be empty"})
    if(!isValidName(lname)) return res.status(400).send({status:false,message:"Pls Enter Valid Last Name"})
    if(!isValid(email)) return res.status(400).send({status:false,message:"email shouldnot be empty"})
    if(!isValidMail(email)) return res.status(400).send({status:false,message:"Pls "})
    if(!isValid(profileImage))return res.status(400).send({status:false,message:"profileImage shouldnot be empty"})
    if(!isValidImg(profileImage))return res.status(400).send({status:false,message:"Img should be of jpg|png|gif|bmp"})
    if(!isValid(phone)) return res.status(400).send({status:false,message:"phone shouldnot be empty"})
    if(!isValidPh(phone)) return res.status(400).send({status:false,message:"Phone No.Should be valid INDIAN no."})
    if(!isValid(password)) return res.status(400).send({status:false,message:"password shouldnot be empty"})
    if(!isValidPassword(password)) return res.status(400).send({status:false,message:"Password must be in 8-15 characters long and it should contains 1 Upper 1 lower 1 digit and 1 special character atleast"})
    if(typeof address== String) return res.status(400).send({status:false,message:"Address should be an Object"})
    if(isValidBody(address)) return res.status(400).send({status:false,message:"Address Should not be empty"})
    if(typeof address.shipping== String) return res.status(400).send({status:false,message:"Shipping should be an Object"})
    if(isValidBody(address.shipping)) return res.status(400).send({status:false,message:"Shipping Should not be empty"})
    if(!isValid(street)) return res.status(400).send({status:false,message:"street should not be empty"})
    if(!isValidStreet(street)) return res.status(400).send({status:false,message:"Pls Enter Valid Street Address in Shipping"})
    if(!isValid(city)) return res.status(400).send({status:false,message:"city should not be empty"})
    if(!isValidName(city)) return res.status(400).send({status:false,message:"Pls Enter Valid City Name"})
    if(!isValid(pincode)) return res.status(400).send({status:false,message:"pincode should not be empty"})
    if(!isValidPincode(pincode)) return res.status(400).send({status:false,message:"Pls Enter Valid PAN PINCODE"})
    if(typeof bill== String) return res.status(400).send({status:false,message:"Billing should be an Object"})
    if(isValidBody(bill)) return res.status(400).send({status:false,message:"Billing Should not be empty"})
    if(!isValid(bill.street)) return res.status(400).send({status:false,message:"street should not be empty in Billing"})
    if(!isValidStreet(bill.street))return res.status(400).send({status:false,message:"Pls Enter Valid Street Address in Billing"})
    if(!isValid(bill.city)) return res.status(400).send({status:false,message:"city should not be empty in Billing"})
    if(!isValidName(bill.city)) return res.status(400).send({status:false,message:"Pls Enter Valid City Name in Billing"})
    if(!isValid(bill.pincode)) return res.status(400).send({status:false,message:"pincode should not be empty in Billing"})
    if(!isValidPincode(bill.pincode)) return res.status(400).send({status:false,message:"Pls Enter Valid PAN PINCODE in Billing"})

    let saveddata= await usermodel.create(data)
    res.status(201).send({status:true,message:Success,data:saveddata})




}









module.exports={createUser}