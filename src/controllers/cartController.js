const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const {
    isValid,
    isValidBody,
    isValidObjectId,
} = require("../validation/validation");

//—————————————————————————————————————————[ Create Cart ]———————————————————————————————————————————————————

const createCart = async function (req, res) {

  try{
    let userId = req.params.userId;

    let body = req.body;

//———————————————————————————:) Empty  body  validation
    if (isValidBody(body))
        return res
            .status(400)
            .send({ status: false, message: "Body Should Not Be Empty" });
    let { productId, cartId, quantity } = body;
    if (!"productId" in body)
        return res
            .status(400)
            .send({ status: false, message: "ProductId is required" });
    if (!isValid(productId))
        return res
            .status(400)
            .send({ status: false, message: "ProductId Should Not Be Empty" });
    if (!isValidObjectId(productId))
        return res
            .status(400)
            .send({ status: false, message: `This ${productId} is not Valid` });
    let productExists = await productModel.findOne({
        _id: productId,
        isDeleted: false,
    });

    if (!productExists)
        return res
            .status(400)
            .send({ status: false, message: `No Product With This Id ${productId}` });
    if ("quantity" in body) {
        let str = "";
        if (!isValid(quantity))
            return res
                .status(400)
                .send({ status: false, message: "Quantity Should Not Be empty" });
        let split = quantity
            .toString()
            .trim()
            .split("")
            .filter((e) => e != "");

//———————————————————————————:)  Check  valid  number provided in quantity

        for (let i = 0; i < split.length; i++) {
            if (isNaN(parseInt(split[i]))) {
                str += split[i];
            }
        }
        if (str.length > 1)
            return res
                .status(400)
                .send({ status: false, message: `(${str}) is not A number` });
        quantity = quantity;
    } else {
        quantity = 1;
    }
    let cartExists = await cartModel.findOne({ userId: userId });

    //———————————————————————————:)  Create new cart 

    if (!cartExists) {
      if("cartId" in body)return res.status(404).send({status:false,message:"First Create cart and then provide cart Id"})
        let obj = {
            userId: userId,
            items: [{ productId: productId, quantity: quantity }],
            totalPrice: productExists.price * parseInt(quantity),
            totalItems: 1,
        };
        let data = await cartModel.create(obj);
        res
            .status(201)
            .send({ status: true, message: "SuccessFully Created", data: data });
    } 
//———————————————————————————:)  Updating existing cart
    else {
        if (!("cartId" in body))
            return res
                .status(400)
                .send({ status: false, message: "You have already created your cart please provide cart Id for verification" });
        if (!isValid(cartId))
            return res
                .status(400)
                .send({ status: false, message: "CartId should not be empty" });
        if (!isValidObjectId(cartId))
            return res
                .status(400)
                .send({ status: false, message: `${cartId} not a Valid Id` });
        let cartExists = await cartModel.findById(cartId);
        if(!cartExists)return res.status(404).send({status:false,message:"No such cart Exists"})
        let cartItems = cartExists.items;

//———————————————————————————:)  To update the existing product 

        for (let i = 0; i < cartItems.length; i++) {
            if (cartExists.items[i].productId == productId) {
                let priceOfproduct = productExists.price;
                cartExists.items[i].quantity += parseInt(quantity);
                cartExists.totalPrice =
                    cartExists.totalPrice + priceOfproduct * parseInt(quantity);
                cartExists.totalItems = cartItems.length;
                let updateExistingProduct = await cartModel.findOneAndUpdate(
                    { _id: cartId },
                    {
                        $set: {
                            items: cartExists.items,
                            totalItems: cartExists.totalItems,
                            totalPrice: Math.floor(cartExists.totalPrice),
                        },
                    },
                    { new: true }
                );
                return res
                    .status(201)
                    .send({
                        status: true,
                        message: "Successfully Created",
                        data: updateExistingProduct,
                    });
            }
        }

//———————————————————————————:)  Adding new product into array of items

        let addProduct = {
            $push: { items: { productId: productId, quantity: quantity } },
            $set: {
                totalPrice: Math.floor(
                    cartExists.totalPrice + productExists.price * parseInt(quantity)
                ),
                totalItems: cartItems.length + 1,
            },
        };
        let updateData = await cartModel.findOneAndUpdate(
            { _id: cartId },
            addProduct,
            { new: true }
        );
        return res
            .status(201)
            .send({
                status: true,
                message: "Successfully Created",
                data: updateData,
            });
    }
  }catch(err){
    return res.status(500).send({status:false,message:err.message})
  }
};

//—————————————————————————————————————————[ Get Cart Details ]——————————————————————————————————————————————

const getCartDetails = async (req, res) => {
    try {
        let userId = req.params.userId;
        
        if (!isValidObjectId(userId))
            return res
                .status(400)
                .send({ status: false, message: "Enter userId in valid format" });
        if (!(await userModel.findById(userId)))
            return res
                .status(400)
                .send({ status: false, message: "No such  user exists" });

        let findCart = await cartModel
            .findOne({ userId: userId })
            .populate('items.productId', 'title description price availableSizes')
        if (!findCart)
            return res
                .status(404)
                .send({ status: false, message: "No such cart Exists" });
        if(findCart.items.length==0)
       return res.status(400).send({status:false,message:"There is no items in your cart to show"})

        res
            .status(200)
            .send({ status: true, message: "Successful", data: findCart });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: false, message: err.message });
    }
};
//———————————————————————————————————————[ Update Cart Details ]——————————————————————————————————————————————

const updateCart = async (req, res) => {
  try{
    let userId= req.params.userId
   
    let body = req.body;
    if (isValidBody(body))
        return res
            .status(400)
            .send({ status: false, message: "Body Should Not be Empty" });
    let { cartId, productId, removeProduct } = body;

    if (!("cartId" in body))
        return res
            .status(400)
            .send({ status: false, message: "Please enter cart Id in body " });
    if (!("productId" in body))
        return res
            .status(400)
            .send({ status: false, message: "Please enter product Id in body" });
    if (!("removeProduct" in body))
        return res
            .status(400)
            .send({ status: false, message: "Please enter removeProduct in body" });
    if (!isValid(cartId))
        return res
            .status(400)
            .send({ status: false, message: " cart Id should not be empty " });
    if (!isValid(productId))
        return res
            .status(400)
            .send({ status: false, message: " Product Id should not be empty " });
    if (!isValid(removeProduct))
        return res
            .status(400)
            .send({ status: false, message: " Remove Product should not be empty " });
    if (!isValidObjectId(cartId))
        return res
            .status(400)
            .send({ status: false, message: "Enter cartId in valid format" });
    let cartExists = await cartModel.findOne({ _id: cartId });
    if (!cartExists)
        return res
            .status(404)
            .send({ status: false, message: "No such cart exists" });

    if (!isValidObjectId(productId))
        return res
            .status(400)
            .send({ status: false, message: "Enter productId in valid format" });
    let productExists = await productModel.findOne({
        _id: productId,
        isDeleted: false,
    });
    if (!productExists)
        return res
            .status(404)
            .send({ status: false, message: "No such product exists" });

    if (!(removeProduct === "1" || removeProduct === "0" ||removeProduct === 1 || removeProduct === 0))
        return res
            .status(400)
            .send({ status: false, message: "Removed product should be '0' or '1'" });

//———————————————————————————:)  To remove entire product

    if (removeProduct === "0") {
        if (cartExists.items.length == 0)
            return res
                .status(400)
                .send({ status: false, message: "Cart is Already Empty" });
        for (let i = 0; i < cartExists.items.length; i++) {
            if (cartExists.items[i].productId == productId) {
                cartExists.items.splice(i, 1);
                cartExists.save();
                return res
                    .status(200)
                    .send({
                        status: true,
                        message: "SuccessFully Updated",
                        data: cartExists,
                    });
            } else {
                return res
                    .status(404)
                    .send({
                        status: false,
                        message: `No Product Exists With this (${productId}) ID in the Cart`,
                    });
            }
        }
    } 

//———————————————————————————:)  To decrement the quantity of a product

    else {
        if (cartExists.items.length == 0)
            return res
                .status(400)
                .send({ status: false, message: "Cart is Already Empty" });
        for (let j = 0; j < cartExists.items.length; j++) {
            if (cartExists.items[j].productId == productId) {
                cartExists.items[j].quantity -= 1;
                cartExists.totalPrice -= productExists.price;
                if (cartExists.items[j].quantity == 0) {
                    cartExists.totalItems -= 1;
                    cartExists.items.splice(j, 1);
                }
                cartExists.save();
                return res
                    .status(200)
                    .send({
                        status: true,
                        message: "successfully updated cart",
                        data: cartExists,
                    });
            }
        }
        return res
            .status(404)
            .send({
                status: false,
                message: `No Product Exists With this (${productId}) ID in the Cart`,
            });
    }
  }catch(err){
    return res.status(500).send({status:false,message:err.message})
  }
};

//—————————————————————————————————————————[ Delete Cart ]————————————————————————————————————————————————————

const deleteCart = async (req, res) => {
    try {
        let userId = req.params.userId;
        
        if (!isValidObjectId(userId))
            return res
                .status(400)
                .send({ status: false, message: "Enter userId in valid format" });
        if (!(await userModel.findById(userId)))
            return res
                .status(400)
                .send({ status: false, message: "No such user exists" });
       let findCart = await cartModel.findOne( { userId: userId });
        if (!findCart)
            return res
                .status(404)
                .send({ status: false, message: "No such cart Exists" });
        if(findCart.items.length==0)return res.status(400).send({status:false,message:"This Cart Is already Deleted"})
        console.log(findCart);
        findCart.totalItems=0
        findCart.totalPrice=0
        findCart.items=[]
        findCart.save()
        
        return res
            .status(200)
            .send({ status: true, message: "cart Deleted Successfully" });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

module.exports = { createCart, getCartDetails, deleteCart, updateCart };
