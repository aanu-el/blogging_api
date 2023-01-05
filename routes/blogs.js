const express = require("express")
const Router = express.Router
const BlogRouter = new Router()

const controllers = require("../controllers/blogs")
const { AddBlogValidatorMW, UpdateBlogValidatorMW } = require("../validators/blogs.validator")

// BlogRouter.get('/', controllers.getAllPublishedBlogs)

BlogRouter.post('/', AddBlogValidatorMW, controllers.createBlogs)
BlogRouter.get('/', controllers.getAllUserBlogs)
BlogRouter.patch('/:id', UpdateBlogValidatorMW, controllers.updateBlog)
BlogRouter.delete('/:id', controllers.deleteBlog)


module.exports = BlogRouter