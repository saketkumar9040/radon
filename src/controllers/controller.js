const authorModel = require("../models/authorModel")
const bookModel= require("../models/bookModel")
const publisherModel= require("../models/publisherModel")


const createAuthor= async function (req, res) {
    let author = req.body
    let authorCreated = await authorModel.create(author)
    res.send({data: authorCreated})
}

const createPublisher = async function (req, res) {
    let publisher=req.body
    let publisherCreated = await publisherModel.create(publisher)
    res.send({data: publisherCreated})
}


const createBook= async function (req, res) {
    let Data= req.body

    let authorId=Data.author
    if(!authorId) res.send("no Author Id")
    
    let publisherId=Data.publisher
    if(!publisherId) res.send("no publisher Id")

    let verifyAuthorId= await authorModel.findById(authorId)
    if(!verifyAuthorId)res.send("incorrect Author Id")

    let verifyPublisherId=await publisherModel.findById(publisherId)
    if(!verifyPublisherId)res.send("incorrect Publisher Id")

    let bookCreated = await bookModel.create(Data)
    res.send({data: bookCreated})
}

const booksWithAuthor  = async function (req, res) {
    let bookData = await bookModel.find().populate("publisher").populate("author")
    res.send({data: bookData })
}

// const updateBook = async function (req, res) {
//     let bookData = await bookModel.find({publisher:"62a20a1edc6adba2e908f1a6"},{publisher:"62a20a6bdc6adba2e908f1ac"}).updateMany({$set:{HardCopy:false}})
//     res.send({data: bookData })
// }


module.exports.createBook= createBook
module.exports.createAuthor= createAuthor
module.exports.createPublisher= createPublisher
module.exports.booksWithAuthor= booksWithAuthor
// module.exports.updateBook=updateBook

