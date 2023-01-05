const { required } = require("joi")
const Joi = require("joi")

const AddBlogSchema = Joi.object({
    title: Joi.string()
        .min(10)
        .max(255)
        .trim()
        .required(),
    description: Joi.string()
        .min(10)
        .trim()
        .optional(),
    author: Joi.string()
        .required(),
    state: Joi.number()
        .default(0),
    read_count: Joi.number()
        .default(0),
    reading_time: Joi.string(),
    tags: Joi.array()
        .items(Joi.string()),
    body: Joi.string()
        .min(10)
        .trim()
        .required(),
    author_id: Joi.string()
})

const UpdateBlogSchema = Joi.object({
    title: Joi.string()
        .trim()
        .optional(),
    description: Joi.string()
        .min(10)
        .trim()
        .optional(),
    author: Joi.string()
        .optional(),
    state: Joi.number()
        .optional(),
    read_count: Joi.number()
        .default(0)
        .optional(),
    reading_time: Joi.string(),
    tags: Joi.array()
        .items(Joi.string())
        .optional(),
    body: Joi.string()
        .min(10)
        .trim()
        .optional(),
    author_id: Joi.string()
})


async function AddBlogValidatorMW(req, res, next) {
    const blogPayload = req.body

    try {
        await UpdateBlogSchema.validateAsync(blogPayload)
        next()
    } catch (err) {
        next({
            message: err.details[0].message,
            status: 400
        })
    }
}

async function UpdateBlogValidatorMW(req, res, next) {
    const blogPayload = req.body

    try {
        await UpdateBlogSchema.validateAsync(blogPayload)
        next()
    } catch (err) {
        next({
            message: err.details[0].message,
            status: 400
        })
    }
}

module.exports = { AddBlogValidatorMW, UpdateBlogValidatorMW }