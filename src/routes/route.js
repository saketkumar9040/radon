const express = require('express');
const router = express.Router();
const Controller= require("../controllers/controller")


router.get("/createAuthor", Controller.createAuthor)

router.get("/createBook", Controller.createBook  )

router.post("/chetanBhagatBooks", Controller.chetanBhagatBooks )

router.get("/twoStateAuthor", Controller.twoStateAuthor)

router.post("/findAuthorByCost", Controller.findAuthorByCost)


module.exports = router;