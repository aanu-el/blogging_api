const mongoose = require("mongoose")
require("dotenv").config()

const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL

const TEST_MONGODB_CONNECTION_URL = process.env.TEST_MONGODB_CONNECTION_URL

if (process.env.NODE_ENV == 'test') {
    function connectToMongoDB() {
        mongoose.connect(TEST_MONGODB_CONNECTION_URL)

        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDb successfully")
        })

        mongoose.connection.on("error", (err) => {
            console.log(err)
            console.log("An error occurred")
        })
    }
} else {
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

}

module.exports = connectToMongoDB 