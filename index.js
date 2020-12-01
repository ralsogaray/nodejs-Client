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

// MOSTRANDO TODAS LAS PELICULAS
app.get("/panel", async (req, res) => {
    const { data : peliculas } = await axios.get('http://localhost:1000/api/v1/pelicula/') //extraigo data de la peticion
    // extrae data y renombra la variable como "peliculas"

    console.table( peliculas )
    
    res.render('panel', { titulo : "Catálogo de Películas", peliculas : peliculas }) //en el objeto defino propiedades/valores qde informacion que quiero que ingrese a panel
})
//////////////////////////////////


app.get("/panel/nueva", (req, res) =>{
    res.render('formulario', { accion : "Agregar", direccion : "/panel/nueva"}) //RENDERIZA EL FORMULARIO DE VIEWS PARA ENVIAR PELICULAS, { accion : "Agregar"} reemplaza a accion en el handlebar
}) 

// AGREGAR PELICULA
app.post("/panel/nueva", async (req, res) => {  
    // aca habria que hacer la validacion de datos con "Joi"
    const { body : datos } = req //EXTRAIGO DE REQUEST EL BODY Y RENOMBRO LA VARIABLE COMO "datos"

    try{
        const { data } = await axios({ //data es la respuesta de dialogar con el servidor. Siempre que haga una operacion con axios se va a extraer la propiedad "data"
            method : "POST",
            url : 'http://localhost:1000/api/v1/pelicula/', //direccion a donde mandar el POST
            data : datos 
        })
        res.redirect("/panel")
    } catch(error){
        res.end("ERROR")
    }
    
})


// ACTUALIZAR !!
app.get("/panel/actualizar/:id", async (req, res) =>{

    const { id } = req.params //extraigo el ID para pasarlo a la URL

    try{
        const { data } = await axios.get(`http://localhost:1000/api/v1/pelicula/${id}`)

        console.log(data) // data devuelve un objeto con "true "y "resultado" que es un array
        
        if(data.ok){ // es lo mismo que poner data.ok == true
            
            const pelicula = data.resultado[0] //dentro de pelicula esta el objeto pelicula con id, titulo, estreno y genero
            
            res.render('formulario', {//RENDERIZA EL FORMULARIO DE VIEWS PARA ENVIAR PELICULAS
                accion : "Actualizar",//{ accion : "Actualizar"} reemplaza a accion en el handlebar
                direccion : `/panel/actualizar/${id}`,
                ...pelicula}) //destructurador, rompo el o bjeto y libero las propiedades en variables independientes (_id, titulo, estreno y género)
        } else{
            res.redirect("/error") 
        } 
    } catch(e){
        res.end("ERROR GARRAFAL")
    }
})

app.post( "/panel/actualizar/:id" , async(req, res) =>{ // SILVIO AYUDAAAA!!
    const { id } = req.params
    
    console.log(id)
    const { body : datos } = req //extraigo el body de request y lo renombro datos
    //console.log(datos)
    try{
        const { data } = await axios({ //data es la respuesta de dialogar con el servidor. Siempre que haga una operacion con axios se va a extraer la propiedad "data"
            method : "PUT",
            url : `http://localhost:1000/api/v1/pelicula/${id}`, //direccion a donde mandar el POST
            data : datos 
            })

        return res.end("Mira la consola!")
    } catch(error) {
        res.end("ERROR!!")
    }
})
//////////////////////////////////////////

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

