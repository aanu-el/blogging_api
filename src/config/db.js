const mongoose = require("mongoose")
require("dotenv").config()

const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL

function connectToMongoDB() {
    mongoose.connect(MONGODB_CONNECTION_URL)

    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDb successfully")
    })

    mongoose.connection.on("error", (err) => {
        console.log(err)
        console.log("An error occurred")
    })
}

module.exports = connectToMongoDB 