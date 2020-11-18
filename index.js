const express = require('express')
const exphbs  = require('express-handlebars')

const app = express()

const port = 2000

app.engine('handlebars', exphbs()) //le digo cual es el motor de plantillas
app.set('view engine', 'handlebars') // le digo al servidor quien administra las plantillas. Le dice que las plantillas van a tener sintaxis handlebar

app.listen(port)





// MIDDLEWARE ----
app.use(express.static('public')) //<--- PRIMERO SE BUSCA SI LA RESPUESTA SE PUEDE OBTTENER DE PUBLIC, sino vuelve a la aplicación
// MIDDLEWARE ----


app.get('/:seccion', (req, res) => {

    const{ seccion } = req.params

    res.render( 'home' )
})