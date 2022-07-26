const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const {createUser, loginUser, getUser}=require("../controllers/userController")
const { auth } = require("../middleware/middleware")



router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",auth,getUser)

module.exports = router

