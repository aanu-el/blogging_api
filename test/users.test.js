const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")

const UserModel = require("../model/users-model")

require("dotenv").config()

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    first_name: "kyle",
    last_name: "xy",
    email: "xyz@example.com",
    password: "xyz123"
}

beforeEach(async () => {
    await UserModel.deleteMany()
    const user = new UserModel(userOne)
    await user.save()
})

describe('User Endpoint', () => {
    it('POST /signup: should return status 200', async () => {
        const response = await supertest(app).post('/api/signup').send({
            email: "abc@gmail.com",
            first_name: "Kylian",
            last_name: "Mbappe",
            password: "abc123"
        })
        expect(response.status).toBe(200)
        expect(typeof response.body).toBe("object")
        expect(response.body).toHaveProperty("user")
    })

    it("should login existing user", async () => {
        const response = await supertest(app).post('/api/login').send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)

        expect(response.body).toHaveProperty("token")
    })

    it("should not login non-existed user", async () => {
        const response = await supertest(app).post('/api/login').send({
            email: "you@example.com",
            password: "example@pass"
        }).expect(500)
    })
})