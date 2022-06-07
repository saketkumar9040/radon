const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema( {  

        author_id:{
                  type:Number,
                  required:true,
                  unique:true
                 },
        author_name:String,
        age:Number,
        address:String
    } 
, { timestamps: true });


const bookSchema = new mongoose.Schema( {  

    name:String,
    author_id:{
               type:Number,
               required:true,
               unique:true
            },
    price:Number,
    ratings:Number,
} 
, { timestamps: true });


module.exports = mongoose.model('Author', authorSchema) //authors
module.exports = mongoose.model('Book', bookSchema) //books
