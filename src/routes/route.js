const express = require('express');
const router = express.Router();
const CowinController= require("../controllers/cowinController")
const weatherController= require("../controllers/weatherController")
const memesController= require("../controllers/memesController")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


router.get("/cowin/states", CowinController.getStates)
router.get("/cowin/districtsInState/:stateId", CowinController.getDistricts)
router.get("/cowin/getByPin", CowinController.getByPin)
router.post("/cowin/getOtp", CowinController.getOtp)

// WRITE A GET API TO GET THE LIST OF ALL THE "vaccination sessions by district id" for any given district id and for any given date
router.get("/cowin/getByDistrictId", CowinController.getByDistrictId)

// api for city and temp
router.get("/getTemp", weatherController.getTemperature)

// api for list of memes
router.get("/getMemes", memesController.getMemes)

//api for creating memes
router.post("/createMemes", memesController.createMemes)





module.exports = router;