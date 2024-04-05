const express = require('express');
const router = express.Router();
const paginas = require('../controllers/paginasController.js');
const authorizationMiddleware = require('../middlewares/authorizationMiddleware.js');
const cargas = require('../controllers/upload.js')


/*Rutas naturales*/

router.get("/", paginas.index);

router.get("/productos", paginas.productos);

router.get("/panelNavegacion", authorizationMiddleware, paginas.panelNavegacion);

/* Login */
router.get("/login", paginas.Login); // Obtener el formulario de Login.

router.post("/login", paginas.inicioSesion); // Realiza el inicio de sesión

router.get('/logout', paginas.logOut);

/*Aquí inicia el carrito*/

router.get('/visualizarCarrito', authorizationMiddleware, paginas.visualizarCarrito);

router.post('/agregarAlCarrito', authorizationMiddleware, paginas.agregarAlCarrito);

router.get('/eliminarProductoCarrito/:id', authorizationMiddleware, paginas.eliminarProductoCarrito);

router.get('/enviarCarrito', authorizationMiddleware, paginas.enviarCarrito);

/*Aquí finaliza el carrito*/

/*Aquí inician los pedidos*/

router.get('/crearPedido', authorizationMiddleware, paginas.crearPedido);

router.get('/visualizarPedido', authorizationMiddleware, paginas.visualizarPedido);

router.get('/cancelarPedido/:id', paginas.cancelarPedido);

router.get('/PedidosEnCurso', authorizationMiddleware, paginas.pedidosEnCurso);

router.get('/actualizacionPedido', paginas.actualizacionPedido);

router.post('/actualizacionPedido/:id', paginas.actualizarPedido);

/*Aquí finalizan los pedidos*/

/*Aquí inicia el historial*/

router.get('/pedidosFinalizados', authorizationMiddleware, paginas.pedidosFinalizados);


/*Aquí finaliza el historial*/

/* Aquí inician las rutas del CRUD usuarios */
router.get("/usuariosRegistrados", authorizationMiddleware, paginas.consultasUsuarios);

router.get("/registroUsuarios", authorizationMiddleware, paginas.registroUsuarios);

router.post("/registroUsuarios", authorizationMiddleware, paginas.altasUsuario);

router.get("/formularioActualizacion", authorizationMiddleware, paginas.formularioActualizacion);

router.post("/usuariosRegistrados/:id", paginas.actualizarUsuario);

router.get("/usuariosRegistrados/:id", paginas.eliminarUsuario);
/* Aquí terminan las rutas del CRUD usuarios */

/* Aquí inician las rutas del CRUD clientes */
router.get("/registroClientes", paginas.registroClientes);

router.post("/registroClientes", paginas.altasClientes);

router.get("/clientesRegistrados", authorizationMiddleware, paginas.consultasClientes);

router.get("/actualizacionClientes", authorizationMiddleware, paginas.actualizacionCliente);

router.post("/clientesRegistrados/:id", paginas.actualizarCliente);

router.get("/clientesRegistrados/:id", paginas.eliminarCliente);
/* Aquí terminan las rutas del CRUD clientes */

/* Aquí inician las rutas del CRUD productos */
router.get("/registroProductos", authorizationMiddleware, paginas.registroProductos);

router.post("/registroProductos", authorizationMiddleware, cargas.upload, paginas.altasProductos);

router.get("/productosRegistrados", authorizationMiddleware, paginas.consultasProductos);

router.get("/actualizacionProductos", authorizationMiddleware, paginas.actualizacionProducto);

router.post("/productosRegistrados/:id", paginas.actualizarProducto);

router.get("/productosRegistrados/:id", paginas.eliminarProducto);
/* Aquí terminan las rutas del CRUD productos */

/* Aquí inician las rutas del CRUD proveedores */
router.get("/registroProveedores", authorizationMiddleware, paginas.registroProveedores);

router.post("/registroProveedores", authorizationMiddleware, paginas.altasProveedores);

router.get("/proveedoresRegistrados", authorizationMiddleware, paginas.consultasProveedores);

router.get("/actualizacionProveedores", authorizationMiddleware, paginas.actualizacionProveedor);

router.post("/proveedoresRegistrados/:id", paginas.actualizarProveedor);

router.get("/proveedoresRegistrados/:id", paginas.eliminarProveedor);
/* Aquí terminan las rutas del CRUD proveedores */

/*Logs*/

router.get('/logsClientes', authorizationMiddleware, paginas.logsClientes);

router.get('/logsUsuarios', authorizationMiddleware, paginas.logsUsuarios);

module.exports = router;
