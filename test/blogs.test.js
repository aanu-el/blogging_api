const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")

const UserModel = require("../model/users-model")
const BlogModel = require("../model/blogs-model")

require("dotenv").config()

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    first_name: "kyle",
    last_name: "xy",
    email: "xyz@example.com",
    password: "xyz123"
}

describe('Blog Route', () => {

    let token

    beforeAll(async () => {
        await UserModel.deleteMany()
        await BlogModel.deleteMany()

        const user = new UserModel(userOne)
        await user.save()

        const loginResponse = await supertest(app)
            .post('/api/login')
            .set('content-type', 'application/json')
            .send({
                email: userOne.email,
                password: userOne.password
            })

        token = loginResponse.body.token
    })

    describe("Blogs Endpoints", () => {
        it("not logged in user cannot create a blog", async () => {

            const response = await supertest(app).post('/api/my-blogs')
                .send({
                    title: "This is a test post",
                    description: "lorem ipsum",
                    tags: ["test"],
                    body: "Pellentesque habitant morbi tristique senectus"
                }).expect(401)
        })

        it("logged in user can create a blog", async () => {

            const response = await supertest(app).post('/api/my-blogs')
                .set('content-type', 'application/json')
                .set({ Authorization: 'bearer ' + token, 'Content-Type': 'application/json' })
                .send({
                    title: "This is a test case",
                    description: "lorem ipsum",
                    tags: ["test"],
                    body: "Pellentesque habitant morbi tristique senectus"
                }).expect(201)
            expect(response.body).toHaveProperty("blog")
            expect(response.body).toHaveProperty("message", "Success!")
        })


        it("logged in user can get all user blog", async () => {

            const response = await supertest(app).get(`/api/my-blogs/`)
                .set('content-type', 'application/json')
                .set({ Authorization: 'bearer ' + token, 'Content-Type': 'application/json' })

            expect(response.status).toBe(200)
            expect(typeof response.body).toBe("object")
        })

        it("logged in user can update own blog", async () => {

            const blogId = new mongoose.Types.ObjectId()
            const newBlog = {
                _id: blogId,
                title: "This is a update test case",
                description: "lorem ipsum",
                author: "kyle xy",
                tags: ["test"],
                body: "Pellentesque habitant morbi tristique senectus",
                author_id: userOne._id
            }

            await BlogModel.create(newBlog)

            const response = await supertest(app)
                .patch(`/api/my-blogs/${newBlog._id}`)
                .set('content-type', 'application/json')
                .set({ Authorization: 'bearer ' + token, 'Content-Type': 'application/json' })
                .send({
                    state: 1
                })

            expect(response.status).toBe(200)
        })


        it("logged in user can delete own blog", async () => {

            const blogId = new mongoose.Types.ObjectId()
            const newBlog = {
                _id: blogId,
                title: "This is a delete test case",
                description: "lorem ipsum",
                author: "kyle xy",
                tags: ["test"],
                body: "Pellentesque habitant morbi tristique senectus",
                author_id: userOne._id
            }

            await BlogModel.create(newBlog)

            const response = await supertest(app)
                .delete(`/api/my-blogs/${newBlog._id}`)
                .set('content-type', 'application/json')
                .set({ Authorization: 'bearer ' + token, 'Content-Type': 'application/json' })

            expect(response.status).toBe(200)
        })

    })
})