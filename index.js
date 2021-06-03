const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express();

app.use(express.json())
app.use(cors())

morgan.token("postData", (req) => {
    if(req.method === "POST"){
        return JSON.stringify(req.body)
    }

    return undefined
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

let contacts = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get("/info", (req, res) => {
    const message = `<p>Phonebook has info for ${contacts.length} people</p><p>${new Date()}</p>`
    res.send(message)
})

app.get("/api/persons", (request, response) => {
    response.json(contacts);
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    if (id) {
        const contact = contacts.find(c => c.id === id)
        if (contact) {
            response.json(contact)
        }
        else {
            response.status(404).end()
        }
    }
    else {
        response.status(400).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    if (id) {
        contacts = contacts.filter(c => c.id !== id)
        response.status(200).end()
    }
    else {
        response.status(400).end()
    }
})

app.post("/api/persons", (request, response) => {
    const newContact = request.body
    if (!newContact.hasOwnProperty("name")) {
        response.status(400).end("The contact has to have a name")
        return;
    }
    if (!newContact.hasOwnProperty("number")) {
        response.status(400).end("The contact has to have a number")
        return;
    }
    if (contacts.find(c => c.name.toLowerCase() === newContact.name.toLowerCase())) {
        response.status(409).json({ error: "Name must be unique" })
        return;
    }

    const id = Math.floor(Math.random() * 10000000)
    const contact = {
        id: id,
        name: newContact.name,
        number: newContact.number,
    }
    contacts.push(contact)

    response.status(200).json(contact);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})