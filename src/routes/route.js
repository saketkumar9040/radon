const express = require('express');
const router = express.Router();
const Controller= require("../controllers/controller")


router.post("/createAuthor", Controller.createAuthor)

router.post("/createBook", Controller.createBook )

router.get("/chetanBhagatBooks", Controller.chetanBhagatBooks )

router.get("/twoStateAuthor", Controller.twoStateAuthor)

router.post("/findAuthorByCost", Controller.findAuthorByCost)


module.exports = router;