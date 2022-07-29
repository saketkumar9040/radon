const express = require("express")
const router = express.Router()
const {createUser, loginUser, getUser,notFound, updateUser}=require("../controllers/userController")
const{ createProduct,getProductById,delProductById,updateProduct,getProducts}=require("../controllers/productController")
const { authen,author} = require("../middleware/middleware")


//—————————————————————————————————————————User Api's————————————————————————————————————————————————————
router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authen,author,getUser)
router.put("/user/:userId/profile",authen,author,updateUser)


//—————————————————————————————————————————Product Api's————————————————————————————————————————————————————

router.post("/products",createProduct)
router.get("/products/:productId",getProductById)
router.delete("/products/:productId",delProductById)
router.put("/products/:productId",updateProduct)
router.get("/products",getProducts )

//—————————————————————————————————————————Invalid Route————————————————————————————————————————————————————

 router.all("/*",notFound)




module.exports = router

