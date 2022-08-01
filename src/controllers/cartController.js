const cartModel = require("../models/cartModel")
const usermodel = require("../models/userModel")
const productModel = require("../models/productModel")
const { isValid, isValidBody, isValidSize, isValidTName, isValidImg, isValidName, isValidObjectId } = require("../validation/validation")
const userModel = require("../models/userModel")

//—————————————————————————————————————————[ Create Cart ]———————————————————————————————————————————————————

const createCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let body = req.body
        let sum = 0
        if (isValidBody(body)) return res.status(400).send({ status: false, message: "Body Should not Be Empty" })
        if (!(await cartModel.findOne({ userId: userId }))) {
            let { quantity, productId, userId } = body
            if (!("productId" in body)) return res.status(400).send({ status: false, message: "ProductId is Required" })
            if (!("quantity" in body)) return res.status(400).send({ status: false, message: "Quantity is Required" })

            if (!isValid(productId)) return res.status(400).send({ status: false, message: "ProductId Should not be empty" })
            if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Enter ProductId in valid format" })
            if (!(await productModel.findById(productId))) return res.status(400).send({ status: false, message: "This Product Doesn't Exists" })
            if (!isValid(quantity)) return res.status(400).send({ status: false, message: "Quantity Should be not empty" })
            let splitQuantity = quantity.trim().split("")
            let str = ""
            for (let i = 0; i < splitQuantity.length; i++) {
                if (isNaN(parseInt(splitQuantity[i]))) {
                    str = str + splitQuantity[i]
                }
            }
            if (str.length > 0) {
                return res.status(400).send({ status: false, message: `(${str}) is not A type Of Number [Add quantity in terms of Number]` })
            }
            body.items = {
                productId: productId,
                quantity: quantity
            }
            body.userId = req.params.userId
            body.totalItems = quantity
            let price = await productModel.findById(productId).select({ _id: 0, price: 1 })
            let totlAmount = price.price * parseInt(quantity)
            sum = sum + totlAmount
            body.totalPrice = sum
            let savedData = await cartModel.create(body)
            res.status(201).send({ status: true, message: "SuccessFully Cart Created", data: savedData })
        }
        else {
            let { quantity, productId,cartId } = body
            if (!("productId" in body)) return res.status(400).send({ status: false, message: "ProductId is Required" })
            if (!("quantity" in body)) return res.status(400).send({ status: false, message: "Quantity is Required" })
            if(!("cartId" in body ))return res.status(400).send({ status: false, message: "CartId is Required" })
            if (!isValid(cartId)) return res.status(400).send({ status: false, message: "CartId Should not be empty" })
            if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "Enter CartId in valid format" })
            if (!(await cartModel.findById(cartId))) return res.status(400).send({ status: false, message: "This cartId Doesn't Exists" })
            if (!isValid(productId)) return res.status(400).send({ status: false, message: "ProductId Should not be empty" })
            if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Enter ProductId in valid format" })
            if (!(await productModel.findById(productId))) return res.status(400).send({ status: false, message: "This Product Doesn't Exists" })
            if (!isValid(quantity)) return res.status(400).send({ status: false, message: "Quantity Should be not empty" })
            let splitQuantity = quantity.trim().split("")
            let str = ""
            for (let i = 0; i < splitQuantity.length; i++) {
                if (isNaN(parseInt(splitQuantity[i]))) {
                    str = str + splitQuantity[i]
                }
            }
            if (str.length > 0) {
                return res.status(400).send({ status: false, message: `(${str}) is not A type Of Number [Add quantity in terms of Number]` })
            }
            let cartid=await cartModel.findById(cartId)
            updatedItems = cartid.totalItems + parseInt(quantity)
            let price = await productModel.findById(productId).select({ _id: 0, price: 1 })
            let totlAmount = price.price * parseInt(quantity)
            sum = cartid.totalPrice + totlAmount
            let updateData = await cartModel.findOneAndUpdate({ _id: cartId }, {
                $push: {
                    items: {
                        productId: productId,
                        quantity: quantity
                    }
                }, totalItems: updatedItems, totalPrice: sum
            }, { new: true })
            res.status(201).send({ status: false, message: "Product Added To Cart Successfully", data: updateData })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}
//—————————————————————————————————————————[ Get Cart Details ]——————————————————————————————————————————————

const getCartDetails = async (req, res) => {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Enter userId in valid format" })
        if (!await userModel.findById(userId)) return res.status(400).send({ status: false, message: "No such  user exists" })

        let findCart = await cartModel.findOne({ userId: userId }).select({items:0})
        if (!findCart) return res.status(404).send({ status: false, message: "No such cart Exists" })
        let findCart1 = await cartModel.findOne({ userId: userId }).select({items:1,_id:0})
        let response={status} 
     
        res.status(200).send({ status: true, message: "Successful", data: findCart })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}
//———————————————————————————————————————[ Update Cart Details ]——————————————————————————————————————————————

const updateCart= async(req,res)=>{
   let cartId= req.body
   if(!cart) return res.status(400).send({status:false,message:"The Cart With this UserId Doesn't Exists"})
}
//—————————————————————————————————————————[ Delete Cart ]————————————————————————————————————————————————————

const deleteCart = async (req, res) => {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Enter userId in valid format" })
        if (!await userModel.findById(userId)) return res.status(400).send({ status: false, message: "No such user exists" })
        let findCart = await cartModel.findOneAndUpdate({ userId: userId }, { items: [], totalItems: 0, totalPrice: 0 })
        if (!findCart) return res.status(404).send({ status: false, message: "No such cart Exists" })
        console.log(findCart)
        res.status(204).send({ status: true, message: "cart Deleted Successfully" })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

module.exports = { createCart, getCartDetails, deleteCart ,updateCart}