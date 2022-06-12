const express = require('express');
const router = express.Router();

const controller= require("../controllers/controller")

const middleWare= require("../middlewares/middleware")

// 
// router.post("/createAuthor",controller.createAuthor  )

// router.post("/createPublisher",controller.createPublisher)

// router.post("/createBook",controller.createBook  )

// router.get("/booksWithAuthor",controller.booksWithAuthor)



router.get("/currentStatus" ,middleWare.mid1 )

module.exports = router;