const passport = require("passport")
const localStrategy = require("passport-local")
const ExtractJwt = require("passport-jwt").ExtractJwt
const JwtStrategy = require("passport-jwt").Strategy

const UserModel = require("../model/users-model")

require("dotenv").config()

let opts = {}
opts.secretOrKey = process.env.JWT_SECRET
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

passport.use(new JwtStrategy(opts, async (token, done) => {
    try {
        return done(null, token.user)
    } catch (error) {
        done(error)
    }
}))

passport.use('signup', new localStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async function (email, password, done) {
        try {
            const user = await UserModel.create({ email, password })

            return done(null, user)
        } catch (error) {
            done(error)
        }
    }
))

passport.use('login', new localStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async function (email, password, done) {
        try {
            const user = await UserModel.findOne({ email })

            if (!user) {
                return done(null, false, { message: 'User not found' })
            }

            const validate = await user.isValidPassword(password)

            if (!validate) {
                return done(null, false, { message: 'Wrong Password' })
            }

            return done(null, user, { message: 'Logged in Successfully' })
        } catch (error) {
            return done(error)
        }
    }
))