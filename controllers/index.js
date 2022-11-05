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

module.exports = {
    homePageHandler, getAPublishedBlog
}