const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const Schema = mongoose.Schema
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: String
})


UserSchema.pre("save", async function (next) {
    const user = this
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    this.first_name = this.first_name.toLowerCase()
    this.last_name = this.last_name.toLowerCase()
    next()

})

UserSchema.methods.isValidPassword = async function (password) {
    const user = this
    const compare = await bcrypt.compare(password, user.password)

    return compare
}

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel