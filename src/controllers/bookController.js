const bookModel= require("../models/bookModel")

const createBook= async function (req, res) {
    let data= req.body
    let savedData= await bookModel.create(data)
    res.send({msg: savedData})
}

const bookList= async function (req, res) {
    let allList= await bookModel.find().select({bookName:1,authorName:1,_id:0})
    res.send({msg: allList})
}
const getBooksByYear= async function (req, res) {
    let bookYear= await bookModel.find({year:req.body.year})
    res.send({msg: bookYear})
}

const getParticularBooks= async function (req, res) {
    let search=req.body
    let bookType= await bookModel.find(search)
    res.send({msg: bookType})
}

const getXINRBooks= async function (req, res) {
    let ip= await bookModel.find({$or:[{"prices.indianPrice":"INR100"},{"prices.indianPrice":"INR200"},{"prices.indianPrice":"INR500"}]})
    res.send({msg: ip})
}

const getRandomBooks= async function (req, res) {
    let available= await bookModel.find({$or:[{stockAvailable:true},{totalpages:{$gt:500}}]})
    res.send({msg: available})
}
module.exports.createBook= createBook
module.exports.bookList= bookList
module.exports.getBooksByYear= getBooksByYear
module.exports. getParticularBooks= getParticularBooks
module.exports.getXINRBooks= getXINRBooks
module.exports.getRandomBooks= getRandomBooks