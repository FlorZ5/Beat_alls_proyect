const express = require('express') //exportar express y se pueda ejecutar todo lo que requier express
const app = express()//se ejecuta express
const port = 3000 //se crea un puerto, por donde sale la appp
const path = require ("path")
const rutas = require("./routes/rutas")//se importan las rutas para poder mandar llamar a nuestro contenido
const db = require('./config/db.js')//constante para importar bd
const myConnection = require('express-myconnection');
const mysql = require('mysql')
const methodOverride = require('method-override');

//middleware
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'beat_alls'
}, 'single'));
app.use(express.urlencoded({extended: true})) //Tomar los datos del formulario.

// Middleware para analizar solicitudes JSON
app.use(express.json());

// Middleware para utilizar method-override
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));//se indica que busque en la carpeta views las vistas para evitar confunfuciones, el path.join ayuda que la ruta se encuentre más rapido y lograr conversiones de diagonales en las rutas
app.set('view engine', 'ejs');//para setiar el ejs y que se corra cada que se ejecute la app

app.use(rutas);//para hacer uso de las rutas

app.listen(port, ()=>{ //contiene una funcion para escuchar el puerto, donde manda como mensaje el numero del puerto 
    console.log(`Listening on port ${port}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salio mal :(');
});
