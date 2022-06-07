const mongoose = require('mongoose');

const bookModel = new mongoose.Schema( {
    bookName: {
               type:String, 
               required:true
              },
    authorName: String, 
    tags: ["Action and Adventure", "Classics","Comic Book ", "Graphic Novel","Detective and Mystery", "Fantasy", " Historical Fiction", "Horror", "Literary Fiction"],
    totalPages:Number,
    year:Number,
    prices: {
        indianPrice: String,
        europePrice: String,
    },
    stockAvailable:Boolean,
}, { timestamps: true });


module.exports = mongoose.model('Book', bookModel) //users

