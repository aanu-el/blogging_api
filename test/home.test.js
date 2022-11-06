const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")

require("dotenv").config()

describe('Home Route', () => {

    it('Should return status 200', async () => {
        const response = await supertest(app).get('/api/')
        expect(response.status).toBe(200)
        expect(typeof response.body).toBe("object")
    })
})