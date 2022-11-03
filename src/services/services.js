function getUserFromToken(req, res) {
    const { authorization } = req.headers
    const [_, token] = authorization.split(" ")
    const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

    return decodedToken.user
}


module.exports = { getUserFromToken }