const express = require("express")
const Router = express.Router
const UserRouter = new Router()

const controllers = require("../controllers/users")

UserRouter.get('/profile', controllers.getUsers)

module.exports = UserRouter