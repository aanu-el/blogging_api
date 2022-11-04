const BlogModel = require("../model/blogs-model")
const services = require("../services/services")

/* Get all Published Blogs and render on home page */
async function homePageHandler(req, res) {
    const page = req.query.page || 0
    const booksPerPage = 20
    let { author, title, tags, read_count, reading_time, timestamp } = req.query

    if (author) {
        author = author.toLowerCase()

        await BlogModel.find({ state: 1, author: author }, { author_id: 0 })
            .sort({ read_count: read_count, reading_time: reading_time, timestamp: timestamp })
            .skip(page * booksPerPage)
            .limit(booksPerPage)
            .then((blog) => {
                if (blog.length == 0) {
                    res.status(404).json({
                        message: `No Published Blogs by: ${author}`,
                        published_blogs: "None"
                    })
                } else {
                    res.status(200).json({
                        message: `All Published Blogs by: ${author}`,
                        published_blogs: blog
                    })
                }
            }).catch((err) => {
                console.log(err)
                res.status(500).send(err)
            })
    } else if (title) {
        await BlogModel.find({ state: 1, title: title })
            .sort({ read_count: read_count, reading_time: reading_time, timestamp: timestamp })
            .skip(page * booksPerPage)
            .limit(booksPerPage)
            .then((blog) => {
                if (blog.length == 0) {
                    res.status(404).json({
                        message: `${title} Not Found`,
                        published_blogs: "None"
                    })
                } else {
                    res.status(200).json({
                        message: `Success`,
                        published_blogs: blog
                    })
                }
            }).catch((err) => {
                console.log(err)
                res.status(500).send(err)
            })
    } else if (tags) {
        await BlogModel.find({ state: 1, tags: tags })
            .sort({ read_count: read_count, reading_time: reading_time, timestamp: timestamp })
            .skip(page * booksPerPage)
            .limit(booksPerPage)
            .then((blog) => {
                if (blog.length == 0) {
                    res.status(404).json({
                        message: `Not Found`,
                        published_blogs: "None"
                    })
                } else {
                    res.status(200).json({
                        message: `Success`,
                        published_blogs: blog
                    })
                }
            }).catch((err) => {
                console.log(err)
                res.status(500).send(err)
            })
    } else {
        await BlogModel.find({ state: 1 })
            .sort({ read_count: read_count, reading_time: reading_time, timestamp: timestamp })
            .skip(page * booksPerPage)
            .limit(booksPerPage)
            .then((blog) => {
                res.status(200).json({
                    message: "Welcome Home",
                    published_blogs: blog
                })
            }).catch((err) => {
                console.log(err)
                res.status(500).send(err)
            })
    }

}


/* Request a single published blog by ID */
async function getAPublishedBlog(req, res) {
    const id = req.params.id

    try {
        let blog = await BlogModel.findOne({ state: 1, _id: id }, { author_id: 0 })

        console.log(blog)
        let init_read_count = blog.read_count
        blog.read_count = init_read_count + 1

        await blog.save()

        res.send(blog)
    } catch (error) {
        console.log(error)
        res.send(err.message)
    }
}


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

    if (state) {
        await BlogModel.find({ author_id: user._id, state: state }, { author_id: 0 })
            .skip(page * booksPerPage)
            .limit(booksPerPage)
            .then((blogs) => {
                return res.status(200).send(blogs)
            }).catch((err) => {
                console.log(err)
                res.status(500).send(err.message)
            })
    } else {
        await BlogModel.find({ author_id: user._id }, { author_id: 0 })
            .skip(page * booksPerPage)
            .limit(booksPerPage)
            .then((blogs) => {
                return res.status(200).send(blogs)
            }).catch((err) => {
                console.log(err)
                res.status(500).send(err.message)
            })
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


module.exports = { createBlogs, getAllUserBlogs, updateBlog, deleteBlog, homePageHandler, getAPublishedBlog }