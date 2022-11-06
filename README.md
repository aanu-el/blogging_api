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
- update env with example.env
- run `npm run start`

## Base URL
- https://blogging-api-x32y.onrender.com/

## Models
