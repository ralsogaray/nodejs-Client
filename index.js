const express = require('express')

const app = express()

const port = 2000

app.listen(port)

app.get('/', (req, res) => {
    res.end("Hello world from express!!")
})