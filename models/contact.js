require("dotenv").config()
const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const url = process.env.MONGODB_URI

console.log("Connecting to ", url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => { console.log("Connected to MongoDB") })
    .catch((error) => { console.log("Error connecting to MongoDB: ", error.message) })

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        unique: true
    },
    number: {
        type: String,
        minlength: 8
    }
})

contactSchema.plugin(uniqueValidator)

contactSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Contact", contactSchema)