const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const {createUser}=require("../controllers/userController")



router.post("/register",createUser)


module.exports = router

