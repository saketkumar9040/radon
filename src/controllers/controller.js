const BookModel= require("../models/model")
const authorModel= require("../models/model")

const createAuthor= async function (req, res) {
    let data= req.body
    let savedData= await authorModel.create(data)
    res.send({msg: savedData})
}

const createBook= async function (req, res) {
    let data= req.body
    let savedData= await BookModel.create(data)
    res.send({msg: savedData})

}
const chetanBhagatBooks= async function (req, res) {
    let allBooks= await BookModel.find( {authorName : "HO" } )
    console.log(allBooks)
    if (allBooks.length > 0 )  res.send({msg: allBooks, condition: true})
    else res.send({msg: "No books found" , condition: false})
}

const twoStateAuthor= async function (req, res) {
    let data= req.body
    let savedData= await BookModel.create(data)
    res.send({msg: savedData})
}
const findAuthorByCost= async function (req, res) {
    let data= req.body
    let savedData= await BookModel.create(data)
    res.send({msg: savedData})
}

module.exports.createBook= createBook
module.exports.createAuthor= createAuthor
module.exports.chetanBhagatBooks= chetanBhagatBooks
module.exports.twoStateAuthor= twoStateAuthor
module.exports.findAuthorByCost= findAuthorByCost
