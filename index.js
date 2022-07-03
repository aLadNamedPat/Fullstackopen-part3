const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

morgan.token('properties', function (req, res) { if (req.body ) {return req.body} })

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(tokens.properties(req,res))
  ]
.join(' ')

}))
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
const PORT = process.env.PORT || 3001

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p> Phonebook has info for ${persons.length} people</p>
                    <p>${Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  response.json(persons.find(person => person.id === id))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
    const id = Math.floor(Math.random() * 10000)
    return id
}
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({ 
        error: 'name missing' 
    })
    }

    if (!body.number) {
        return response.status(400).json({ 
        error: 'name missing' 
    })
    }

    if (persons.find(person => person.name === body.name)) {
    
        return response.status(400).json({ 
        error: 'name must be unique' 
    })
    }

    const person = {
        id : generateId(),
        name : body.name,
        number: body.number
    }

    persons.concat(person)
    response.json(person)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})