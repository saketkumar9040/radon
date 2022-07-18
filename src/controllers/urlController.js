const validUrl = require("valid-url");
const shortId = require("shortid");
const urlModel = require("../models/urlModel");
const urlRegex = (value) => {
    let urlRegex = /^(?:(?:(?:https?|http):)?\/\/.*\.(?:png|gif|webp|com|in|org|co|co.in|net|jpeg|jpg))/i;
    if (urlRegex.test(value))
        return true;
}

const createUrl = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Body is empty!" })
        const longUrl = req.body.longUrl
        if (!urlRegex(longUrl)) return res.status(400).send({ status: false, message: "Url is not valid!!" })
        if (!validUrl.isUri(longUrl)) return res.status(400).send({ status: false, message: "Please enter a valid Url!" })
        let uniqueUrl = await urlModel.findOne({ longUrl }).select({ __v: 0, createdAt: 0, updatedAt: 0, _id: 0 })
        if (uniqueUrl) return res.status(200).send({ status: true, data: uniqueUrl })
        let urlCode = shortId.generate().toLocaleLowerCase();
        let shortUrlCode = "http://localhost:3000/" + urlCode
        data.urlCode = urlCode
        data.shortUrl = shortUrlCode

        let urlCreation = await urlModel.create(data)
        urlCreation = await urlModel.findOne({ urlCode }).select({ __v: 0, createdAt: 0, updatedAt: 0, _id: 0 })
        res.status(201).send({ status: true, data: urlCreation })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getUrl = async (req, res) => {
    const urlCode = req.params.urlCode
    if (!shortId.isValid(urlCode)) return res.status(400).send({ status: false, message: "Invalid URL!" })
    const findUrl = await urlModel.findOne({ urlCode })
    if(!findUrl) return res.status(400).send({ status: false, message: "Url not found!" })
    return res.status(302).redirect(findUrl.longUrl)
}

module.exports = { createUrl, getUrl }