const express = require('express');


const welcome = require('../logger/logger')
const externalModule1=require('../util/helper')
const externalModule2=require('../validator/formatter')

const router = express.Router();



router.get('/welcome', function (req, res) {
    console.log(welcome.welcome())
    res.send("Thank u for ur visit")
});

router.get('/date', function (req, res) {
    console.log("today is"+externalModule1.today)
    res.send("today is a great day")
});

router.get('/month', function (req, res) {
    console.log("this month is"+externalModule1.thisMonth())
    res.send("this month i have learned a lots of coding")
});

router.get('/trim', function (req, res) {
    console.log("we love"+externalModule1.trimm())
});


router.get('/upper', function (req, res) {
    console.log("hey"+externalModule2.upp())
});


router.get('/lower', function (req, res) {
    console.log("hello"+externalModule2.low())
});


router.get('/getmyinfo', function (req, res) {
    console.log("personal status"+externalModule1.getbatchinfo())
    res.send("hey there,i am saket")
});




module.exports = router;
