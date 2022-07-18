const express = require("express")
const route = express.Router();
const {createUrl, getUrl} = require("../controllers/urlController");

route.post("/url/shorten" , createUrl)
route.get("/:urlCode" , getUrl)

module.exports = route
