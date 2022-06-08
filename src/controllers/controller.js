const bookModel= require("../models/bookModel")
const authorModel= require("../models/authorModel")

const createAuthor= async function (req, res) {
    let data= req.body
    let savedData= await authorModel.create(data)
    res.send({msg: savedData})
}

const createBook= async function (req, res) {
    let data= req.body
    let savedData= await bookModel.create(data)
    res.send({msg: savedData})
  

}
const chetanBhagatBooks= async function (req, res) {
    let data= await authorModel.findOne({author_name:"Chetan Bhagat"}).select({author_id:1,_id:0})
    let savedData= await bookModel.find(data)
    res.send({msg: savedData})
   
}

const twoStateAuthor= async function (req, res) {
    let data= await bookModel.findOneAndUpdate({name:"Two states" },{$set:{prices:100}},{new:true})
    let savedData= await authorModel.find({author_id:data.author_id}).select("author_name")
    let newPrice=data.prices
    res.send({msg: savedData,newPrice})
   

}
const findAuthorByCost= async function (req, res) {
    let data= await bookModel.find( { prices : { $gte: 50, $lte: 100} } ).select({author_id:1,_id:0})
    res.send({msg: data})
    // let savedData= await authorModel.find({author_id :data.author_id}).select("author_name")
    // res.send({msg: savedData})
   


}

module.exports.createBook= createBook
module.exports.createAuthor= createAuthor
module.exports.chetanBhagatBooks= chetanBhagatBooks
module.exports.twoStateAuthor= twoStateAuthor
module.exports.findAuthorByCost= findAuthorByCost
