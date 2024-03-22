const express= require('express')//se importa express
const router= express.Router();//se crea el router que va a gestionar rutas
const paginas = require('../controllers/paginasController.js');

/*Rutas generales*/
/*Login*/
router.get("/login", paginas.Login); //Obtener el formulario de Login.

router.post("/inicioSesion", paginas.inicioSesion); //Enviar los datos del formulario.
/*Aquí terminan las rutas generales*/
/*Aquí inician las rutas del CRUD usuarios*/
router.get("/usuariosRegistrados", paginas.consultasUsuarios);

router.get("/registroUsuarios", paginas.registroUsuarios);

router.post("/registroUsuarios", paginas.altasUsuario);

router.get("/formularioActualizacion", paginas.formularioActualizacion);

router.post("/usuariosRegistrados/:id", paginas.actualizarUsuario);

router.get("/usuariosRegistrados/:id", paginas.eliminarUsuario);
/*Aquí terminan las rutas del CRUD usuarios*/

/*Aquí inician las rutas del CRUD clientes*/
router.get("/registroClientes", paginas.registroClientes);

router.post("/registroClientes", paginas.altasClientes);

router.get("/clientesRegistrados", paginas.consultasClientes);

router.get("/actualizacionClientes", paginas.actualizacionCliente);

router.post("/clientesRegistrados/:id", paginas.actualizarCliente);

router.get("/clientesRegistrados/:id", paginas.eliminarCliente);
/*Aquí terminan las rutas del CRUD clientes*/

/*Aquí inician las rutas del CRUD productos*/
router.get("/registroProductos", paginas.registroProductos);

router.post("/registroProductos", paginas.altasProductos);

router.get("/productosRegistrados", paginas.consultasProductos);

router.get("/actualizacionProductos", paginas.actualizacionProducto);

router.post("/productosRegistrados/:id", paginas.actualizarProducto);

router.get("/productosRegistrados/:id", paginas.eliminarProducto);
/*Aquí terminan las rutas del CRUD productos*/

/*Aquí inician las rutas del CRUD proveedores*/
router.get("/registroProveedores", paginas.registroProveedores);

router.post("/registroProveedores", paginas.altasProveedores);

router.get("/proveedoresRegistrados", paginas.consultasProveedores);

router.get("/actualizacionProveedores", paginas.actualizacionProveedor);

router.post("/proveedoresRegistrados/:id", paginas.actualizarProveedor);

router.get("/proveedoresRegistrados/:id", paginas.eliminarProveedor);
/*Aquí terminan las rutas del CRUD proveedores*/
module.exports = router;