const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
     {
         bookName: String,
         authorName:String,
         categories:String,
         publishYear:Number,
         
     },

{ timestamps: true });

module.exports = mongoose.model('User', userSchema) //users



// String, Number
// Boolean, Object/json, array