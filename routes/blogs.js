const express = require("express")
const Router = express.Router
const BlogRouter = new Router()

const controllers = require("../controllers/blogs")

// BlogRouter.get('/', controllers.getAllPublishedBlogs)

BlogRouter.post('/', controllers.createBlogs)
BlogRouter.get('/', controllers.getAllUserBlogs)
BlogRouter.patch('/:id', controllers.updateBlog)
BlogRouter.delete('/:id', controllers.deleteBlog)


module.exports = BlogRouter