const mongoose = require('mongoose');

const bookModel = new mongoose.Schema( {  

    name:{
          type:String,
          },
    author_id:{
               type:String,
               unique:false
              },
    prices:Number,
    ratings:Number,
} ,{timestamps: true });



module.exports = mongoose.model('Book', bookModel) //books
