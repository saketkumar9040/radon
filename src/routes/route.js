const express = require('express');


const welcome = require('../logger/logger')
const util= require('../util/helper')
const validator= require('../validator/formatter')

const router = express.Router();



router.get('/welcome', function (req, res) {
  util.today();
  util.month();
  util.getbatchinfo();
  welcome.welcome();
    validator.upper();
     validator.lower();
    validator.trimm();
   
   
   
    res.send("Thank u for ur visit")
});
     
     module.exports = router;
