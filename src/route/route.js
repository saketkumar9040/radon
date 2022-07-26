const express = require("express")
const router = express.Router()
const {createUser, loginUser, getUser,notFound, updateUser}=require("../controllers/userController")
const { authen,author} = require("../middleware/middleware")



router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authen,author,getUser)
router.put("/user/:userId/profile",updateUser)
 router.all("\*",notFound)
module.exports = router

