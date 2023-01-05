const express = require("express")
const bodyParser = require("body-parser")
const passport = require("passport")
require("dotenv").config()

const connectToMongoDB = require("./config/db")

const authRouter = require("./routes/auth")
const blogRouter = require("./routes/blogs")
const userRouter = require("./routes/users.js")

require("./auth/auth")

const controllers = require("./controllers/index")

/* Initialize App */
const app = express()

/* Connect to Database */
connectToMongoDB()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', 'views')


/* App Routes */
app.use('/api/v1', authRouter)
app.use('/api/v1/my-blogs', passport.authenticate('jwt', { session: false }), blogRouter)
app.use('/api/v1/users', passport.authenticate('jwt', { session: false }), userRouter)

/* Home Route */
app.get('/', (req, res) => {
    res.status(200).render('index')
})
app.get('/api/v1', controllers.homePageHandler)
app.get('/api/v1/:id', controllers.getAPublishedBlog)

/* Error Handler */
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
})

/* Server Configuration */
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server Listening on PORT ${PORT}`)
})

module.exports = app