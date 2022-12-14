const rateLimit = require("express-rate-limit")

require("dotenv").config()



function getUserFromToken(req, res) {
    const { authorization } = req.headers
    const [_, token] = authorization.split(" ")
    const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

    return decodedToken.user
}

const Limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false
})



module.exports = { getUserFromToken, Limiter }