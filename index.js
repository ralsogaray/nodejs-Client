const express = require('express')

const app = express()

const port = 2000

app.listen(port)

// MIDDLEWARE ----
app.use(express.static('public')) //<--- PRIMERO SE BUSCA SI LA RESPUESTA SE PUEDE OBTTENER DE PUBLIC, sino vuelve a la aplicación
// MIDDLEWARE ----


app.get('/:seccion', (req, res) => {

    const{ seccion } = req.params

    res.writeHead(200,{ "Content-Type" : "text/html"})
    res.end(`<h1>Hello from seccion <u>${seccion}</u> in HTML</h1>`)
})