const cartModel= require("../models/cartModel")
const usermodel = require("../models/userModel")
const productModel = require("../models/productModel")

//—————————————————————————————————————————Create Cart————————————————————————————————————————————————————

const createCart= async function(req,res){
    let userId= req.params.userId
    if(!(await cartModel.findById(userId))){
        
    }
}