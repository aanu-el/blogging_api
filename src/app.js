const express = require("express")
const bodyParser = require("body-parser")
require("dotenv").config()

const connectToMongoDB = require("./config/db")

const authRoute = require("./routes/auth")
const blogRoute = require("./routes/blogs")
require("./auth/auth")

const app = express()

/* Connect to Database */
connectToMongoDB()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* Template Engine */
app.set('view engine', 'ejs')
app.set('views', 'views')

/* App Routes */
app.use('/', authRoute)
app.use('/blogs', blogRoute)

/* Home Route */
app.get('/', (req, res) => {
    res.send("Welcome to my blog")
    // render all published blogs
})

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