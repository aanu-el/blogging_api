const BlogModel = require("../model/blogs-model")
const UserModel = require("../model/users-model")


async function getAllPublishedBlogs(req, res) {
    await BlogModel.find({ state: 1 })
        .then((blog) => {
            res.status(200).send(blog)
        }).catch((err) => {
            console.log(err)
            res.status(500).send(err)
        })
}

async function createBlogs(req, res) {
    const newBlog = req.body

    // Get User Details from Token
    const { authorization } = req.headers
    const [_, token] = authorization.split(" ")
    const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

    const user = decodedToken.user

    // Calculate Reading Time for Blogs
    const blogLength = newBlog.body.trim().split(/\s+/).length
    const reading_time = Math.ceil(blogLength / 225)

    // Save to DB
    await BlogModel.create({
        title: newBlog.title,
        description: newBlog.description,
        author: user._id,
        tags: newBlog.tags,
        reading_time: `${reading_time} mins`,
        body: newBlog.body
    })
        .then((blog) => {
            return res.status(201).json({ message: "Success!", blog })
        }).catch((err) => {
            console.log(err)
            return res.status(500).send(err.message)
        })
}

module.exports = { getAllPublishedBlogs, createBlogs }