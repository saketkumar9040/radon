const express = require("express")
const router = express.Router()
const {createUser, loginUser, getUser,notFound}=require("../controllers/userController")
const { authen,author} = require("../middleware/middleware")



router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authen,author,getUser)
 router.all("\*",notFound)
module.exports = router

