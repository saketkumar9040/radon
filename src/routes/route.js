const express = require('express');
const router = express.Router();
const BookController= require("../controllers/BookController")


router.post("/createBook",  BookController.createBook  )

router.get("/bookList",  BookController.bookList)

router.get("/getBooksByYear", BookController.getBooksByYear) 

router.get("/getParticularBooks", BookController.getParticularBooks)

router.get("/getXINRBooks", BookController.getXINRBooks)

router.get("/getRandomBooks", BookController.getRandomBooks)

module.exports = router;