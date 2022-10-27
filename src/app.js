const express = require("express")
const bodyParser = require("body-parser")
require("dotenv").config()

const connectToMongoDB = require("./config/db")

const authRoute = require("./routes/auth")
require("./auth/auth")

const app = express()

/* Connect to Database */
connectToMongoDB()

app.use(bodyParser.urlencoded({ extended: false }))

/* Template Engine */
app.set('view engine', 'ejs')
app.set('views', 'views')

/* App Routes */
app.use('/', authRoute)

/* Home Route */
app.get('/', (req, res) => {
    res.send("Welcome to my blog")
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