const UserModel = require("../model/users-model")

async function getUsers(req, res, next) {
    const { authorization } = req.headers

    const [_, token] = authorization.split(" ")

    const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

    const user = decodedToken.user

    await UserModel.findOne({ email: user.email })
        .then((user) => {
            return res.json({ user })
        }).catch((err) => {
            console.log(err)
            next(err)
        })
}

module.exports = { getUsers }