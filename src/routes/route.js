const express = require('express');
const router = express.Router();
const aws= require("aws-sdk")
const{createBook}=require("../controller/BookController")

router.post("/books", createBook)


module.exports = router;
