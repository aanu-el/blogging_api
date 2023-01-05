const express = require("express")
const bodyParser = require("body-parser")
const passport = require("passport")
const helmet = require("helmet")
const Sentry = require('@sentry/node')
require("dotenv").config()

const connectToMongoDB = require("./config/db")

const authRouter = require("./routes/auth")
const blogRouter = require("./routes/blogs")
const userRouter = require("./routes/users")
const { Limiter } = require("./services/services")

require("./auth/auth")
const SENTRY_DSN = process.env.SENTRY_DSN

const controllers = require("./controllers/index")

/* Initialize App */
const app = express()

// ---------- Sentry Config ----------
Sentry.init({ dsn: SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());


/* Connect to Database */
connectToMongoDB()

/* Middleware */
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Apply the rate limiting middleware to all requests
app.use(Limiter)

app.set('view engine', 'ejs')
app.set('views', 'views')


/* App Routes */
app.use('/api/v2', authRouter)
app.use('/api/v2/my-blogs', passport.authenticate('jwt', { session: false }), blogRouter)
app.use('/api/v2/users', passport.authenticate('jwt', { session: false }), userRouter)

/* Home Route */
app.get('/', (req, res) => {
    res.status(200).render('index')
})
app.get('/api/v2', controllers.homePageHandler)
app.get('/api/v2/:id', controllers.getAPublishedBlog)


// --------- Sentry Error Handler ------------
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    res.statusCode = err.status || 500;
    res.json({
        message: err.message,
        sentry_error_id: res.sentry
    })
})

/* Error Handler */
// app.use((err, req, res, next) => {
//     console.log(err);
//     res.status(err.status || 500);
//     res.json({ error: err.message });
// })


/* Server Configuration */
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server Listening on PORT ${PORT}`)
})

module.exports = app