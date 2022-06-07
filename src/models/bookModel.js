const mongoose = require('mongoose');

const authorModel = new mongoose.Schema( {  

        author_id:number,
        author_name:string,
        age:number,
        address:string
    } 
, { timestamps: true });


const bookModel = new mongoose.Schema( {  

     
    name:string,
    author_id:number,
    price:number,
    ratings:number,

} 
, { timestamps: true });


module.exports = mongoose.model('author', authorModel) //authors
module.exports = mongoose.model('Book', bookModel) //books
