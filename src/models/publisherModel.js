const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const publisherModel = new mongoose.Schema( {
    name: String,
    headquarter:String,

}, { timestamps: true });

module.exports = mongoose.model('newPublisher', publisherModel)