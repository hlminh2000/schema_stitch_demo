const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const { USER_SERVICE_PORT = 9001 } = process.env
const users = require('./data.json')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/user/:queryId', (req, res, next) => {
    const { queryId } = req.params
    res.json(users.find(({id}) => String(id) === queryId))
})

app.listen(USER_SERVICE_PORT, () => {
    console.log(`user service listening on port: ${USER_SERVICE_PORT}`)
})