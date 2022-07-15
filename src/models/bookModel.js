const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const bookSchema = new mongoose.Schema({

    bookCover:String,

    title: {
        type: String,
        required: 'Book Title Required',
        unique: true,
        trim: true
    },
    excerpt: {
        type: String,
        required: 'Excerpt is Required'
    },
    userId: {
        type: ObjectId,
        required: 'userId is Required',
        ref: 'User',
        trim: true
    },
    ISBN: {
        type: String,
        required: 'ISBN is Required',
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: 'Category is Required',
        trim: true
    },
    subCategory: {
        type: [String],
        required: 'subCategory is Required',
        trim: true
    },
    reviews: {
        type: Number,
        default: 0,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
    releasedAt: {
        type: Date,
        required: 'releasedAt is Required'
    }

}, { timestamps: true })

module.exports = mongoose.model("Book", bookSchema)