const supertest = require("supertest")
const app = require("../app")

const users = {
    "email": " "
}

describe('Home Route', () => {
    it('Should return status true', async () => {
        const response = await supertest(app).get('/api')
        expect(response.status).toBe(200)
        // expect(response.body).toBe([])
    })
})