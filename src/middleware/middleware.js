const jwt= require("jsonwebtoken")

const auth= async function(req,res,next){
     const bearerheader= req.headers.Authorization
     if(typeof bearerheader=="undefined" || typeof bearerheader=="null"){
      return res.status(401).send({status:false,message:"Token Must Be present"})
     }
     let bearerToken=bearerheader.split(" ")
     let token=bearerToken[0]
      let decodeToken=jwt.verify(token,"project5@sss123",function(err,decode){
        if(err){ return res.status(400).send({status:false,message:"Token Invalid"}) }
        else{
            if (Date.now() > decode.exp * 1000) {
                return res.status(401).send({ status: false, message: "Session Expired" });
            }
        }
        req.DecodedId=decodeToken.userId
        next()
     })
}

module.exports={auth}