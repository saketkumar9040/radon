const express = require('express');
const router = express.Router();

const controller= require("../controllers/controller")


router.post("/createAuthor",controller.createAuthor  )

router.post("/createPublisher",controller.createPublisher)

router.post("/createBook",controller.createBook  )

router.get("/booksWithAuthor",controller.booksWithAuthor)

// router.put("/book",controller.updateBook  )

module.exports = router;