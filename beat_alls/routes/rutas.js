const express = require('express');
const router = express.Router();
const paginas = require('../controllers/paginasController.js');
const clientes = require('../controllers/clientesController.js');
const usuarios = require('../controllers/usuariosController.js');
const proveedores = require('../controllers/proveedoresController.js');
const productos = require('../controllers/productosController.js');
const pedidos = require('../controllers/pedidosController.js');
const carrito = require('../controllers/carritoController.js');
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

router.get('/reestablecerContra', paginas.reestablecerContra);

router.post('/passChange', paginas.passChange);

/*Aquí inicia el carrito*/

router.get('/visualizarCarrito', authorizationMiddleware, carrito.visualizarCarrito);

router.post('/agregarAlCarrito', authorizationMiddleware, carrito.agregarAlCarrito);

router.get('/eliminarProductoCarrito/:id', carrito.eliminarProductoCarrito);

router.get('/enviarCarrito', authorizationMiddleware, carrito.enviarCarrito);

/*Aquí finaliza el carrito*/

/*Aquí inician los pedidos*/

router.get('/crearPedido', authorizationMiddleware, pedidos.crearPedido);

router.get('/visualizarPedido', authorizationMiddleware, pedidos.visualizarPedido);

router.get('/cancelarPedido/:id', pedidos.cancelarPedido);

router.get('/PedidosEnCurso', authorizationMiddleware, pedidos.pedidosEnCurso);

router.get('/actualizacionPedido', pedidos.actualizacionPedido);

router.post('/actualizacionPedido/:id', pedidos.actualizarPedido);

/*Aquí finalizan los pedidos*/

/*Aquí inicia el historial*/

router.get('/pedidosFinalizados', authorizationMiddleware, pedidos.pedidosFinalizados);

/*Aquí finaliza el historial*/

/* Aquí inician las rutas del CRUD usuarios */
router.get("/usuariosRegistrados", authorizationMiddleware, usuarios.consultasUsuarios);

router.get("/registroUsuarios", authorizationMiddleware, usuarios.registroUsuarios);

router.post("/registroUsuarios", authorizationMiddleware, usuarios.altasUsuario);

router.get("/formularioActualizacion", authorizationMiddleware, usuarios.formularioActualizacion);

router.post("/usuariosRegistrados/:id", usuarios.actualizarUsuario);

router.get("/usuariosRegistrados/:id", usuarios.eliminarUsuario);
/* Aquí terminan las rutas del CRUD usuarios */

/* Aquí inician las rutas del CRUD clientes */
router.get("/registroClientes", clientes.registroClientes);

router.post("/registroClientes", clientes.altasClientes);

router.get("/clientesRegistrados", authorizationMiddleware, clientes.consultasClientes);

router.get("/actualizacionClientes", authorizationMiddleware, clientes.actualizacionCliente);

router.post("/clientesRegistrados/:id", clientes.actualizarCliente);

router.get("/clientesRegistrados/:id", clientes.eliminarCliente);
/* Aquí terminan las rutas del CRUD clientes */

/* Aquí inician las rutas del CRUD productos */
router.get("/registroProductos", authorizationMiddleware, productos.registroProductos);

router.post("/registroProductos", authorizationMiddleware, cargas.upload, productos.altasProductos);

router.get("/productosRegistrados", authorizationMiddleware, productos.consultasProductos);

router.get("/actualizacionProductos", authorizationMiddleware, productos.actualizacionProducto);

router.post("/productosRegistrados/:id", productos.actualizarProducto);

router.get("/productosRegistrados/:id", productos.eliminarProducto);
/* Aquí terminan las rutas del CRUD productos */

/* Aquí inician las rutas del CRUD proveedores */
router.get("/registroProveedores", authorizationMiddleware, proveedores.registroProveedores);

router.post("/registroProveedores", authorizationMiddleware, cargas.upload, proveedores.altasProveedores);

router.get("/proveedoresRegistrados", authorizationMiddleware, proveedores.consultasProveedores);

router.get("/actualizacionProveedores", authorizationMiddleware, proveedores.actualizacionProveedor);

router.post("/proveedoresRegistrados/:id", proveedores.actualizarProveedor);

router.get("/proveedoresRegistrados/:id", proveedores.eliminarProveedor);
/* Aquí terminan las rutas del CRUD proveedores */

/*Logs*/

router.get('/logsClientes', authorizationMiddleware, paginas.logsClientes);

router.get('/logsUsuarios', authorizationMiddleware, paginas.logsUsuarios);

module.exports = router;
