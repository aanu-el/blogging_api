const BlogModel = require("../model/blogs-model")

async function getAllBlogs(req, res) {
    await BlogModel.find({ state: 1 })
        .then((blog) => {
            res.status(200).send(blog)
        }).catch((err) => {
            console.log(err)
            res.status(500).send(err)
        })
}

// async function create(req, res) {

// }

module.exports = { getAllBlogs }