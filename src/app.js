const express = require("express")
const bodyParser = require("body-parser")
const passport = require("passport")
require("dotenv").config()

const connectToMongoDB = require("./config/db")

const authRouter = require("./routes/auth")
const blogRouter = require("./routes/blogs")
const userRouter = require("./routes/users.js")

require("./auth/auth")

const controllers = require("./controllers/blogs")

/* Initialize App */
const app = express()

/* Connect to Database */
connectToMongoDB()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


/* App Routes */
app.use('/', authRouter)
app.use('/my-blogs', passport.authenticate('jwt', { session: false }), blogRouter)
app.use('/users', passport.authenticate('jwt', { session: false }), userRouter)

/* Home Route */
app.get('/', controllers.homePageHandler)
app.get('/:id', controllers.getAPublishedBlog)

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