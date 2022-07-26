const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const {createUser, loginUser, getUser}=require("../controllers/userController")



router.post("/register",createUser)
router.get("/login",loginUser)
router.get("/user/:userId/profile",getUser)

module.exports = router

