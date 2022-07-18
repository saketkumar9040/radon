const express = require("express")
const route = express.Router();
const {createUrl, getUrl} = require("../controllers/urlController");

//---------------------------------------------------[ROUTE 1]----------------------------------------------------------------//
route.post("/url/shorten" , createUrl)

//---------------------------------------------------[ROUTE 2]----------------------------------------------------------------//
route.get("/:urlCode" , getUrl)

module.exports = route
