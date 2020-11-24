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
app.use( express.static('public') ) //<--- PRIMERO SE BUSCA SI LA RESPUESTA SE PUEDE OBTTENER DE PUBLIC, sino vuelve a la aplicación
app.use( express.json() ) 
app.use (express.urlencoded({ extended : true }) )
// MIDDLEWARE ----








////////// AXIOS //////////
app.get("/test", async (req, res)=>{ 

    const { data : peliculas } = await axios.get('http://localhost:1000/api/v1/pelicula/') // me conecto a la API de la otra aplicacion y extraigo "data" y las peliculas de dicha data. 
    // extrae data y renombra la variable como "peliculas"
    
    //console.log( peliculas )
    console.table( peliculas )
    res.end("Mirá la consola a ver si hay datos de la API")
})

app.get("/panel", async (req, res) => {
    const { data : peliculas } = await axios.get('http://localhost:1000/api/v1/pelicula/') //extraigo data de la peticion
    // extrae data y renombra la variable como "peliculas"

    console.table( peliculas )
    
    res.render('panel', { titulo : "Catálogo de Películas", peliculas : peliculas }) //en el objeto defino propiedades/valores qde informacion que quiero que ingrese a panel
})

app.get("/panel/nueva", (req, res) =>{
    res.render('formulario', { accion : "Agregar"}) //RENDERIZA EL FORMULARIO DE VIEWS PARA ENVIAR PELICULAS
}) 

app.post("/panel/nueva", async (req, res) => { // POOOOOST 
    // aca habria que hacer la validacion de datos con "Joi"
    const { body : datos } = req //EXTRAIGO DE REQUEST BODY Y RENOMBRO LA VARIABLE COMO "datos"

    const { data } = await axios({ //data es la respuesta de dialogar con el servidor. Siempre que haga una operacion con axios se va a extraer la propiedad "data"
        method : "POST",
        url : 'http://localhost:1000/api/v1/pelicula/', //direccion a donde mandar el POST
        data : datos 
    })

    console.log( data )

    res.end("Mira la consolita!")
})

app.get("/panel/actualizar/:id", async (req, res) =>{

    const { id } = req.params

    

    const { data } = await axios.get(`http://localhost:1000/api/v1/pelicula/${id}`)

    console.log(data)
    if(data.ok){
        
        const pelicula = data.resultado[0] //dentro de pelicula esta el objeto pelicula con id, titulo, estreno y genero
        
        res.render('formulario', {//RENDERIZA EL FORMULARIO DE VIEWS PARA ENVIAR PELICULAS
            accion : "Actualizar", 
            ...pelicula}) //destructurador
    } else{
        res.redirect("/panel/error") //luego crear una interfaz que diga error
    }

    
}) 
///////// AXIOS //////////








// para que chrome no moleste con favicon.ico 
app.get("/favicon.ico", (req, res) => {
    res.writeHead(404, { "Content-Type" : "text/plain"})
    res.end("CHROME JA'JODÉ CON FAVICON.ICO")
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

