const jwt= require("jsonwebtoken")
const usermodel= require("../models/userModel")
const { isValidObjectId } = require("../validation/validation")

//—————————————————————————————————————————[ Authentication ]————————————————————————————————————————————————————

const authen= async function(req,res,next){
    try{
     const bearerheader= req.headers.authorization
     if(typeof bearerheader=="undefined" || typeof bearerheader=="null"){
      return res.status(401).send({status:false,message:"Token Must Be present"})
     }
    if(!bearerheader) return res.status(401).send({status:false,message:"Token Must Be present"})
     let bearerToken=bearerheader.split(" ")
     let token=bearerToken[1]
      let decodeToken=jwt.verify(token,"project5@sss123",{ ignoreExpiration: true },function(err,decode){
        if(err){ 
            return res.status(401).send({status:false,message:"Token Invalid"}) }
        else{
            if (Date.now() > decode.exp * 1000) {
                return res.status(401).send({ status: false, message: "Session Expired ! Login Again" });
            }
        }
        req.DecodedId=decode.userId
        next()
    })}
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

//—————————————————————————————————————————[ Authorization ]————————————————————————————————————————————————————

const author= async function (req,res,next){
    let parmId=req.params.userId
    let dUderId=req.DecodedId
     if(parmId){
        if(req.params.userId.length==0 || req.params.userId==':userId') return res.status(400).send({status:false,message:"Please Enter UserId in params"})
        if(!isValidObjectId(parmId)) return res.status(400).send({status:false,message:"Pls Enter Id in Valid Format"})
        if(!(await usermodel.findById(parmId))) return res.status(400).send({status:false,message:"Id Doesn't Exists"})
        if(parmId !== dUderId) return res.status(400).send({status:false,message:"Sorry You Are Not Authorise"})
        next()
     }
}




module.exports={authen,author}