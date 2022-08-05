const express = require("express")
const router = express.Router()
const {createUser, loginUser, getUser,notFound, updateUser}=require("../controllers/userController")
const{ createProduct,getProductById,delProductById,updateProduct,getProducts}=require("../controllers/productController")
const {createCart, getCartDetails, deleteCart,updateCart}=require("../controllers/cartController")
const{ createOrder,updateOrder }=require("../controllers/orderController")
const { authen,author} = require("../middleware/middleware")


//—————————————————————————————————————————[  User Api's  ]————————————————————————————————————————————————————
router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authen,author,getUser)
router.put("/user/:userId/profile",authen,author,updateUser)


//—————————————————————————————————————————[  Product Api's  ]————————————————————————————————————————————————————

router.post("/products",createProduct)
router.get("/products/:productId",getProductById)
router.delete("/products/:productId",delProductById)
router.put("/products/:productId",updateProduct)
router.get("/products",getProducts )

//—————————————————————————————————————————[  Cart Api's  ]————————————————————————————————————————————————————

router.post("/users/:userId/cart",authen,author,createCart)
router.get("/users/:userId/cart",authen,author,getCartDetails)
router.delete("/users/:userId/cart",authen,author,deleteCart)
router.put("/users/:userId/cart",authen,author,updateCart)

//—————————————————————————————————————————[  order Api's  ]————————————————————————————————————————————————————
 
router.post("/users/:userId/orders",authen,author,createOrder)
router.put("/users/:userId/orders",authen,author,updateOrder)

//—————————————————————————————————————————[  Invalid Route ]————————————————————————————————————————————————————

 router.all("/*",notFound)




module.exports = router

