const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")




 


const bcrypt = require("bcrypt")
let saltrounds = 10
let c;
const securepw= async (password)=>{
const hashpass= await bcrypt.hash(password, saltrounds)
        console.log(hashpass)
const compare = await bcrypt.compare(password,hashpass)
console.log(compare)
};

securepw("sameer@2002")

module.exports = router

