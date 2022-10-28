const mongoose = require("mongoose")
const Schema = mongoose.Schema

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    author: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    state: {
        type: Number,
        default: 0
    },
    read_count: {
        type: Number,
        default: 0
    },
    reading_time: String,
    tags: {
        type: [String]
    },
    body: {
        type: String,
        required: true
    }
}, { timestamps: true })

const BlogModel = mongoose.model('Blog', BlogSchema)

module.exports = BlogModel