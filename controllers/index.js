const BlogModel = require("../model/blogs-model")


/* Get all Published Blogs and render on home page */
async function homePageHandler(req, res) {
    const page = req.query.page || 0
    const booksPerPage = 20
    let { author, title, tags, order = 'asc', order_by = 'created_at' } = req.query

    const findQuery = {}
    findQuery.state = 1

    if (author) {
        author = author.toLowerCase()
        findQuery.author = author
    }

    if (title) {
        findQuery.title = title
    }

    if (tags) {
        findQuery.tags = tags
    }

    const sortQuery = {}

    const sortingAttributes = order_by.split(',')
    for (let attribute of sortingAttributes) {
        if (order === "asc" && order_by) {
            sortQuery[attribute] = 1
        } else {
            sortQuery[attribute] = -1
        }
    }

    await BlogModel.find(findQuery).sort(sortQuery).skip(page * booksPerPage).limit(booksPerPage)
        .then((blog) => {
            return res.status(200).send(blog)
        }).catch((err) => {
            console.log(err)
            return res.status(500).send(err.message)
        })

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