# Blogging_API

### API Documentation: https://documenter.getpostman.com/view/19301718/2s8YRcPwtt

## Requirements
1. User should be able to sign up and sign in
2. Use JWT as authentication strategy and expire the token after 1 hour
3. Logged in users should be able to create a blog.
4. Logged in and not logged in users should be able to get a list of published blogs created
5. When a blog is created, it is in draft state
6. Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
7. A blog can be in two states; draft and published
8. Logged in and not logged in users should be able to to get a published blog
9. The owner of the blog should be able to update the state of the blog to published
10. The owner of a blog should be able to edit the blog in draft or published state
11. The owner of the blog should be able to delete the blog in draft or published state
12. The owner of the blog should be able to get a list of their blogs.
13. The list of blogs endpoint that can be accessed by both logged in and not logged in users.
14. When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1
15. Test Application

## Setup
- Install NodeJs, mongodb
- pull this repo
- create `.env` file
  - specify a PORT number: `PORT=3333`
  - connect mongodb: `MONGODB_CONNECTION_URL=mongodb://localhost/`
  - specify a JWT_SECRET: `JWT_SECRET=something-secret`
- run `npm run start`

## Base URL
- https://blogging-api-x32y.onrender.com/

## Models
### User
| field | data_type | constraints |
| ---- | ---- | ---- |
| id | string | required |
| email | string | required, unique |
| first_name | string | required |
| last_name | string | required |
| password | string | 

### Blog
| field | data_type | constraints |
| ---- | ---- | ---- |
| id | string | required |
| title | string | required, unique |
| description | string | 
| author | string | required |
| state | number | default: 0 |
| read_count | number | default: 0 |
| reading_time | string |
| tags | [string] | 
| body | string | required |
| author_id | string | required |
| timestamp | timestamp | 

## APIs
### Home
- Route: `/api`
- Method: GET

### Signup User
- Route: `/api/signup`
- Method: POST

### Login User
- Route: `/api/login`
- Method: POST

## Create Blog
- Route: `/api/my-blogs`
- Method: POST
- Header
  - Authorization: Bearer {token}

## Get All Blogs of a User
- Route: `/api/my-blogs`
- Method: GET
- Header
  - Authorization: Bearer {token}
  
 ## Update Blog
- Route: `/api/my-blogs/:id`
- Method: PATCH
- Header
  - Authorization: Bearer {token}

## Delete Blog
- Route: `/api/my-blogs/:id`
- Method: DELETE
- Header
  - Authorization: Bearer {token}
