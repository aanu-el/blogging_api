const express = require('express')
const Router = express.Router
const jwt = require('jsonwebtoken')
const passport = require('passport')
require('dotenv').config()

const authRouter = new Router()

const UserModel = require("../model/users-model")

authRouter.post('/signup', async (req, res, next) => {
    const user = req.body

    UserModel.create({ email: user.email, first_name: user.first_name, last_name: user.last_name, password: user.password })
        .then((user) => {
            res.status(200).json({
                message: 'Signup successful',
                user: user
            })
        }).catch((err) => {
            console.log(err)
            return next(err)
        })
})

authRouter.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err) {
                return next(err)
            }

            if (!user) {
                const error = new Error('Username or password is incorrect');
                return next(error);
            }

            req.login(user, { session: false }, async (error) => {
                if (error) { return next(error) }

                const body = { _id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name }

                const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: "3h" })

                return res.json({ token })
            })
        } catch (error) {
            console.log(error)
            return next(error)
        }
    })(req, res, next)
})

module.exports = authRouter