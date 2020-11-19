const express = require('express')
const exphbs  = require('express-handlebars')
const axios = require('axios') 

const app = express()

const port = 2000

app.engine('handlebars', exphbs()) //le digo a mi aplicacion que motor de plantillas utilizar, en este caso es el primer parametro 'handlebars'; tiene que seguir las reglas/configuraciones que tienen configuradas express-handlebars (segundo parámetro)
app.set('view engine', 'handlebars') // le digo al servidor quien administra las plantillas. Le dice que las plantillas van a tener sintaxis handlebar
// el primer parametro  es el motor de plantillas, el segundo es quien administra las vistas y le dice al servidor que las plantillas van a tener sintaxis handlebars

app.listen(port)



// MIDDLEWARE ----
app.use(express.static('public')) //<--- PRIMERO SE BUSCA SI LA RESPUESTA SE PUEDE OBTTENER DE PUBLIC, sino vuelve a la aplicación
// MIDDLEWARE ----


app.get("/test", async (req, res)=>{ 

    const { data : peliculas } = await axios.get('http://localhost:1000/api/v1/pelicula/') //extraigo data de la peticion
    // extrae data y renombra la variable como "peliculas"
    
    //console.log( peliculas )
    console.table( peliculas )
    res.end("Mirá la consola a ver si hay datos de la API")
})

app.get('/:seccion?', (req, res) => { //seccion es como el parametro :id --- al poner '?' se ultizia para que si no pongo ninguna ruta en el navegador, seccion quedará vacío y arroja/devuelve "undefined"

    const{ seccion } = req.params //extraigo el parametro seccion enviado por la peticion http

    //vista es la seccion que quiere ingresar la persona
    const vista = seccion || 'home' //con esto le digo que si seccion es undefined entonces renderize "home". Vista va a tener el contenido de seccion y si es undefined, el de home
    
    

    const titulo = vista.charAt(0).toUpperCase() + vista.slice(1) //agarro la primer letra del string en la posicion 0 y la paso a mayuscula ; con slice corto el texto de seccion a partir de la posicion 1 entonces quedaria "ontacto"
    

    //console.log( titulo )
    
    res.render( vista, { titulo : titulo } ) // titulo se lo paso como objeto 

    //al pedir que me renderize el primer parametro, el motor va a buscar en views si hay una vista con nombre que coincida. Si existe toma el contenido y va hacia el layout main y lo imprime sobre body, luego toma todo el main y lo devuelve al navegador.
}) 

