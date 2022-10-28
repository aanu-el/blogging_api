const express = require("express")
const Router = express.Router
const BlogRouter = new Router()

const controllers = require("../controllers/blogs")

BlogRouter.get('/', controllers.getAllBlogs)

module.exports = BlogRouter