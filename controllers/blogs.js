const BlogModel = require("../model/blogs-model")
const services = require("../services/services")


/* Logged in Users Can Create Blogs */
async function createBlogs(req, res) {
    const newBlog = req.body

    // Get User Details from Token
    const user = services.getUserFromToken(req, res)
    const author = user.first_name + ' ' + user.last_name

    // Calculate Reading Time for Blogs
    const blogLength = newBlog.body.trim().split(/\s+/).length
    const reading_time = Math.ceil(blogLength / 225)

    // Save to DB
    await BlogModel.create({
        title: newBlog.title,
        description: newBlog.description,
        author: author,
        tags: newBlog.tags,
        reading_time: `${reading_time} mins`,
        body: newBlog.body,
        author_id: user._id
    })
        .then((blog) => {
            return res.status(201).json({ message: "Success!", blog })
        }).catch((err) => {
            console.log(err)
            return res.status(500).send(err.message)
        })
}

/* Get all Blogs created by the Logged In user */
async function getAllUserBlogs(req, res) {
    // Get the request param
    const page = req.query.page || 0
    const state = req.query.state
    const booksPerPage = 5
    // Get User Details from Token
    const user = services.getUserFromToken(req, res)

    const findQuery = {}
    findQuery.author_id = user._id

    if (state) {
        findQuery.state = state
    }

    try {
        const blogs = await BlogModel.find(findQuery, { author_id: 0 })
            .skip(page * booksPerPage)
            .limit(booksPerPage)

        return res.status(200).send(blogs)
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}


/* Update Blogs created by the Logged In user */
async function updateBlog(req, res) {
    const blog_Id = req.params.id
    const detailsToUpdate = req.body
    const user = services.getUserFromToken(req, res)

    await BlogModel.findOneAndUpdate({ author_id: user._id, _id: blog_Id }, detailsToUpdate, { new: true })
        .then((blog) => {
            if (blog == null) {
                res.status(400).json({
                    message: "Unauthorized! You cannot update another user's blog"
                })
            } else {
                res.status(200).json({
                    message: "Success!",
                    data: blog
                })
            }
        }).catch((err) => {
            console.log(err)
            res.status(500).send(err.message)
        })
}


/* Delete Blogs created by the Logged In user */
async function deleteBlog(req, res) {
    const blog_Id = req.params.id
    const user = services.getUserFromToken(req, res)

    await BlogModel.findOneAndDelete({ author_id: user._id, _id: blog_Id })
        .then((blog) => {
            if (blog == null) {
                res.status(400).json({
                    message: "Unauthorized! You cannot delete another user's blog"
                })
            } else {
                res.status(200).json({
                    message: "Success!",
                    data: blog
                })
            }
        }).catch((err) => {
            console.log(err)
            res.status(500).send(err.message)
        })
}


module.exports = { createBlogs, getAllUserBlogs, updateBlog, deleteBlog }