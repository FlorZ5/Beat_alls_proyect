const express = require('express') //exportar express y se pueda ejecutar todo lo que requier express
const app = express()//se ejecuta express
const port = 3000 //se crea un puerto, por donde sale la appp
const path = require ("path")
const rutas = require("./routes/rutas")//se importan las rutas para poder mandar llamar a nuestro contenido
const db = require('./config/db.js')//constante para importar bd
const multer = require('multer')
const myConnection = require('express-myconnection');
const methodOverride = require('method-override');
const session = require('express-session')
const { Sequelize } = require('sequelize')
/*              Middlewares         */
//Llamado de datos de los form
app.use(express.urlencoded({extended: true}));

//Analisis de solicitudes JSON
app.use(express.json());

app.use(session({
  secret: 'EdgeSlayer97', // Cambia esto por una cadena aleatoria y segura
  resave: false,
  saveUninitialized: true
}));

//Method-override para solicitudes put y delete
app.use(methodOverride('_method'));

app.use('/uploads', express.static('uploads'));

//Definición de rutas hacia la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

//Definición de rutas hacia la carpeta views
app.set('views', path.join(__dirname, 'views'));

//Define el uso del motor de plantillas EJS
app.set('view engine', 'ejs');//para setiar el ejs y que se corra cada que se ejecute la app

//Llama al archivo rutas.js
app.use(rutas);

app.listen(port, ()=>{ //contiene una funcion para escuchar el puerto, donde manda como mensaje el numero del puerto 
    console.log(`Listening on port ${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err); 
});