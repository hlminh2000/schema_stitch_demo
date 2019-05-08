const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const { PROGRAM_SERVICE_PORT = 9002 } = process.env
const programs = require('./data.json')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/program/:queryShortname', (req, res, next) => {
    const { queryShortname } = req.params
    res.json(programs.find(({short_name}) => String(short_name) === queryShortname))
})

app.listen(PROGRAM_SERVICE_PORT,  () => {
  console.log(`program service listening on port: ${PROGRAM_SERVICE_PORT}`)
})