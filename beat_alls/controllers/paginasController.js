const db = require('../config/db.js');
const {Op, sequelize, where} = require('sequelize');
const os = require('os');
const {encrypt, compare} = require('../helpers/handleBcrypt.js');
const usuarioModel = require('../models/usuarioModel.js');
const clienteModel = require('../models/clienteModel.js');
const productosModel = require('../models/productosModel.js');
const proveedorModel = require('../models/proveedorModel.js');
const carritoModel = require('../models/carritoModel.js');
const pedidosModel = require('../models/pedidosModel.js');
const historialModel = require('../models/historialModel.js');
const logsUsuarioModel = require('../models/logsUsuarioModel.js');
const logsClienteModel = require('../models/logsClienteModel.js');

const interfaces = os.networkInterfaces();
let ipAddress;

Object.keys(interfaces).forEach((interfaceName) => {
    const interfaceInfo = interfaces[interfaceName];
    interfaceInfo.forEach((info) => {
        if (!info.internal && info.family === 'IPv4') {
            ipAddress = info.address;
        }
    });
});

const index = async (req, res) => {

    try {
        res.render('menuPrincipal')
    } catch (error) {
        console.error('Error al ingresar al sitio:', error);
        res.status(500).send('Error interno del servidor');
    }
}

const productos = async (req, res) => {
        const consultar_Productos = await productosModel.findAll();

        res.render('productos', {
            consultar_Productos,
            titulo: "Tienda",
            enc: "Productos"
        })
}

const panelNavegacion = async (req, res) => {
    const clienteLogueado = req.session.cliente;
    const usuarioLogueado = req.session.usuario;
    const rol = req.session.userRole;

    if (!usuarioLogueado && !clienteLogueado) {
        return res.redirect('/login');
    }

    try {        
        if (usuarioLogueado && rol == "Administrador") {
                const nombre = usuarioLogueado.Nombre
                res.render('panelAdministrador', {
                    nombre
                });
            }

            if (usuarioLogueado && rol == "Empleado") {
                const nombre = usuarioLogueado.Nombre
                res.render('panelEmpleado', {
                    nombre
                });
            }

            if (clienteLogueado && rol == "Cliente") {
                const nombre = clienteLogueado.Nombre
                res.render('panelCliente', {
                    nombre
                });
            }     

        res.render('login', {
            titulo: "Login",
            enc: "Inicio de sesión"
        });
    } catch (error) {
        console.error('Error al consultar:', error);
        res.status(500).send('Error interno del servidor');
    }
}
/*Controladores generales*/
/*Controlador para acceder al login*/
const Login = (req, res) => {
    res.render('login', {
        titulo: "Login",
        enc: "Inicia Sesión"
    });
}

const inicioSesion = async (req, res) => {
    try {
        const { Login, Contrasena } = req.body;
        const usuario = await usuarioModel.findOne({ where: { 
            [Op.or]: [{Nombre_usuario: Login}, {Correo: Login}] 
        }});

        const cliente = await clienteModel.findOne({ where: {
            [Op.or]: [{Nombre_usuario: Login}, {Correo: Login}]
        }});


        if (!usuario && !cliente) {
            return res.status(404).render('login', {
                titulo: "Login",
                enc: "Inicio de sesión"
            });
        }          

        if (usuario) {
            const validarContraUsuario = await compare(Contrasena, usuario.Contrasena);
            if (validarContraUsuario) {
                if(usuario.dataValues.Rol == "Administrador")
                {
                req.session.userRole = 'Administrador';
                req.session.usuario = usuario;
                const usuarioLogueado = req.session.usuario;
                const nombre = usuarioLogueado.Nombre


                await logsUsuarioModel.create({
                ID_Usuario: usuarioLogueado.ID_Usuario,
                Rol: usuarioLogueado.Rol,
                Nombre_usuario: usuarioLogueado.Nombre,
                Accion: "Login",
                Descripcion: ("Inicio de sesión en administrador: " + usuarioLogueado.Nombre_usuario),
                Fecha_hora: Date.now(),
                IP: ipAddress
    })
                res.render('panelAdministrador', {
                    nombre
                });
            }

                if(usuario.dataValues.Rol == "Empleado")
                {
                    req.session.userRole = 'Empleado';
                    req.session.usuario = usuario;
                    const usuarioLogueado = req.session.usuario;
                    const nombre = usuarioLogueado.Nombre

                    await logsUsuarioModel.create({
                    ID_Usuario: usuarioLogueado.ID_Usuario,
                    Rol: usuarioLogueado.Rol,
                    Nombre_usuario: usuarioLogueado.Nombre,
                    Accion: "Login",
                    Descripcion: ("Inicio de sesión en empleado: " + usuarioLogueado.Nombre_usuario),
                    Fecha_hora: Date.now(),
                    IP: ipAddress
            })

                    res.render('panelEmpleado', {
                        nombre
                    });
                }
            }
        }

        if (cliente) {
            const validarContraCliente = await compare(Contrasena, cliente.Contrasena);
                if (validarContraCliente) {
                    req.session.userRole = 'Cliente';
                    req.session.cliente = cliente;
                    const usuarioLogueado = req.session.cliente;
                    const nombre = usuarioLogueado.Nombre

                    await logsClienteModel.create({
                    ID_Cliente: usuarioLogueado.ID_Cliente,
                    Rol: usuarioLogueado.Rol,
                    Nombre_cliente: usuarioLogueado.Nombre,
                    Accion: "Login",
                    Descripcion: ("Inicio de sesión en empleado: " + usuarioLogueado.Nombre_usuario),
                    Fecha_hora: Date.now(),
                    IP: ipAddress
            })

                            res.render('panelCliente', {
                                nombre
                            });
                        }
                    }      

        res.render('login', {
            titulo: "Login",
            enc: "Inicio de sesión"
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const logOut = async (req, res) => {

    const usuarioLogueado = req.session.usuario;
    const clienteLogueado = req.session.cliente;
    if(usuarioLogueado) {
    await logsUsuarioModel.create({
        ID_Usuario: usuarioLogueado.ID_Usuario,
        Rol: usuarioLogueado.Rol,
        Nombre_usuario: usuarioLogueado.Nombre,
        Accion: "Logout",
        Descripcion: ("Cierre de sesión de usuario: " + usuarioLogueado.Nombre_usuario),
        Fecha_hora: Date.now(),
        IP: ipAddress
    })
}   

    if(clienteLogueado) {
        await logsClienteModel.create({
            ID_Cliente: clienteLogueado.ID_Cliente,
            Rol: clienteLogueado.Rol,
            Nombre_cliente: clienteLogueado.Nombre,
            Accion: "Logout",
            Descripcion: ("Cierre de sesión de cliente: " + clienteLogueado.Nombre_usuario),
            Fecha_hora: Date.now(),
            IP: ipAddress
        })
    }

    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        res.status(500).send('Error al cerrar sesión');
      } else {
        res.render('login', {
            titulo: "Login",
            enc: "Inicio de sesión"
        })
      }
    });
  };

/*                                           Fin de controladores generales                                     */

/*                                           Inicio de controladores para el carrito                                     */

const agregarAlCarrito = async (req, res) => {
    const usuarioLogueado = req.session.cliente;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    const idCliente = usuarioLogueado.ID_Cliente;
    const idProducto = req.body.ID_Producto;


    let carritoProducto = await carritoModel.findOne({
        where: {
            ID_Cliente: idCliente,
            ID_Producto: idProducto
        }
    });

    let cantidadPiezas = parseInt(req.body.cantidadPiezas) || 1;
    const consultar_Carrito = await carritoModel.findAll({ where: {
        ID_Cliente: idCliente 
    }});
    if (carritoProducto) {
        const valorBack =  await carritoProducto.Nombre_producto;
        carritoProducto.Cantidad_producto += cantidadPiezas;
        const publicPrice = await carritoProducto.Precio_unitario_producto;
        const totalPagar = consultar_Carrito.reduce((total, carrito) => total + carrito.Precio_total_productos, 0);

        let nuevoValor =  cantidadPiezas * publicPrice;
        carritoModel.update({ Cantidad_producto: cantidadPiezas },
            {where: { Nombre_producto: valorBack,
                      ID_Cliente: idCliente
        }})
        carritoModel.update({ Cantidad_pagar: totalPagar },
            {where: { Nombre_producto: valorBack,
                      ID_Cliente: idCliente
        }})
        carritoModel.update({ Precio_total_productos: nuevoValor },
            {where: {Nombre_producto: valorBack,
                     ID_Cliente: idCliente                            
        }})
    } else {
        const productoAgregado = await productosModel.findByPk(idProducto);
        const totalPagar = consultar_Carrito.reduce((total, carrito) => total + carrito.Precio_total_productos, 0);

        await carritoModel.create({
            ID_Cliente: idCliente,
            ID_Producto: idProducto,
            Nombre_producto: productoAgregado.Nombre_producto,
            Descripcion: productoAgregado.Descripcion,
            Cantidad_producto: cantidadPiezas,
            Precio_unitario_producto: productoAgregado.Precio_publico,
            Precio_total_productos: productoAgregado.Precio_publico * cantidadPiezas,
            Cantidad_pagar: totalPagar
        });
    }

    const totalPagar = consultar_Carrito.reduce((total, carrito) => total + carrito.Precio_total_productos, 0);
    const consultar_Productos = await productosModel.findAll();
    
    await logsClienteModel.create({
        ID_Cliente: idCliente,
        Rol: usuarioLogueado.Rol,
        Nombre_cliente: usuarioLogueado.Nombre,
        Accion: "Agregar",
        Descripcion: "Se agrega producto al carrito",
        Fecha_hora: Date.now(),
        IP: ipAddress
    })

    res.render('productos', {
        totalPagar,
        consultar_Productos,
        titulo: "Productos",
        enc: "Productos"
    });
};

const visualizarCarrito = async (req, res) => {
    const usuarioLogueado = req.session.cliente;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }
    const idCliente = usuarioLogueado.ID_Cliente;
    const consultar_Carrito = await carritoModel.findAll({ where: {
        ID_Cliente: idCliente 
    }});

    const totalPagar = consultar_Carrito.reduce((total, carrito) => total + carrito.Precio_total_productos, 0);

    res.render('carritoCliente', {
        totalPagar,
        consultar_Carrito,
        titulo: "Carrito",
        enc: "Mi carrito"
    })
};

const eliminarProductoCarrito = async (req, res) => {

    const usuarioLogueado = req.session.cliente;
    const idCliente = usuarioLogueado.ID_Cliente;
    const idProducto = req.params.id;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    try {
        const carrito = await carritoModel.findOne({
            where: {
                ID_Cliente: idCliente,
                ID_Producto: idProducto
            }
        });
        const valorBack =  await carrito.Nombre_producto;
        if (!carrito) {
            return res.status(404).send('Producto encontrado');
        }

        await carritoModel.destroy({
            where: {
                ID_Cliente: idCliente,
                Nombre_producto: valorBack,
                ID_Producto: idProducto
            }
        });
        const consultar_Carrito = await carritoModel.findAll({ where: {
            ID_Cliente: idCliente 
        }});
        const totalPagar = consultar_Carrito.reduce((total, carrito) => total + carrito.Precio_total_productos, 0);

        res.render('carritoCliente',{
            totalPagar,
            consultar_Carrito,
            titulo:'Usuarios registrados', 
            enc:'Usuarios registrados'});
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const enviarCarrito = async (req, res) => {

    const usuarioLogueado = req.session.cliente;
    const idCliente = usuarioLogueado.ID_Cliente;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }
    const consultar_Carrito = await carritoModel.findAll({ where: {
        ID_Cliente: idCliente 
    }});


    
    if (!consultar_Carrito)
    {
        res.render('visualizarCarrito')
    }
    const totalPagar = consultar_Carrito.reduce((total, carrito) => total + carrito.Precio_total_productos, 0);

    res.render('crearPedido', {
        totalPagar,
        consultar_Carrito,
        titulo: "Pedido generado",
        enc: "Tu pedido"
    })
};

/*                                           Fin de controladores para el carrito                                     */

/*                                           Inicio de controladores para los pedidos                                     */

const crearPedido = async (req, res) => {
    const usuarioLogueado = req.session.cliente;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    const idCliente = usuarioLogueado.ID_Cliente;
    const nombreCliente = usuarioLogueado.Nombre;
    const carrito = await carritoModel.findAll({
        where: {
            ID_Cliente: idCliente,
        }
    });

    try {
        let ultimoNoPedido;
        
        const ultimaInsercionPedidos = await pedidosModel.findAll({
            order: [['Fecha', 'DESC']],
            limit: 1,
            attributes: ['No_pedido']
        });

        const ultimaInsercionHistorial = await historialModel.findAll({
            order: [['Fecha', 'DESC']],
            limit: 1,
            attributes: ['No_pedido']
        });

        if (ultimaInsercionPedidos.length > 0 && ultimaInsercionHistorial.length > 0) {
            const ultimoNoPedidoPedidos = ultimaInsercionPedidos[0].No_pedido;
            const ultimoNoPedidoHistorial = ultimaInsercionHistorial[0].No_pedido;
            ultimoNoPedido = Math.max(ultimoNoPedidoPedidos, ultimoNoPedidoHistorial) + 1;
        } else if (ultimaInsercionPedidos.length > 0) {
            ultimoNoPedido = ultimaInsercionPedidos[0].No_pedido + 1;
        } else if (ultimaInsercionHistorial.length > 0) {
            ultimoNoPedido = ultimaInsercionHistorial[0].No_pedido + 1;
        } else {
            ultimoNoPedido = 1;
        }  

        for (const producto of carrito) {
            await pedidosModel.create({
                No_pedido: ultimoNoPedido,
                ID_Cliente: idCliente,
                Nombre_cliente: nombreCliente,
                ID_Producto: producto.ID_Producto,
                Nombre_producto: producto.Nombre_producto,
                Descripcion: producto.Descripcion,
                Cantidad_producto: producto.Cantidad_producto,
                Precio_unitario_producto: producto.Precio_unitario_producto,
                Precio_total_productos: producto.Precio_total_productos,
                Cantidad_pagar: producto.Cantidad_pagar,
                Ubicacion: producto.Ubicacion,
                Fecha: new Date(),
                Estatus: 'Pendiente de pago'
            }, {
                fields: ['No_pedido', 'ID_Cliente', 'Nombre_cliente', 'ID_Producto', 'Nombre_producto', 'Descripcion', 'Cantidad_producto', 'Precio_unitario_producto', 'Precio_total_productos', 'Cantidad_pagar', 'Ubicacion', 'Fecha', 'Estatus']
            });
        }

        await carritoModel.destroy({
            where: {
                ID_Cliente: idCliente,
            }
        });

        const consultar_Pedidos = await pedidosModel.findAll({ 
            where: {
                ID_Cliente: idCliente
            },
            attributes: ['No_pedido', 'ID_Cliente', 'Nombre_cliente', 'ID_Producto', 'Nombre_producto', 'Descripcion', 'Cantidad_producto', 'Precio_unitario_producto', 'Precio_total_productos', 'Cantidad_pagar', 'Ubicacion', 'Fecha', 'Estatus']
        });

        const cantidadPagarPorPedido = {};

        consultar_Pedidos.forEach(pedido => {
            if (!cantidadPagarPorPedido[pedido.No_pedido]) {
                cantidadPagarPorPedido[pedido.No_pedido] = 0;
            }
            cantidadPagarPorPedido[pedido.No_pedido] += pedido.Precio_total_productos;
        });

        await logsClienteModel.create({
            ID_Cliente: idCliente,
            Rol: usuarioLogueado.Rol,
            Nombre_cliente: usuarioLogueado.Nombre,
            Accion: "Creación",
            Descripcion: "Se envía carrito de compras a pedido",
            Fecha_hora: Date.now(),
            IP: ipAddress
        })

        res.render('pedidoCliente', {
            cantidadPagarPorPedido,
            consultar_Pedidos,
            titulo: "Mis pedidos",
            enc: "Pedidos realizados"
        });
    } catch (error) {
        console.error('Error al crear nuevo pedido:', error);
        res.status(500).send('Error interno del servidor');
    }  
};


const pedidosEnCurso = async (req, res) => {

    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }
    const consultar_Pedidos = await pedidosModel.findAll({
        attributes: ['No_pedido', 'ID_Cliente', 'Nombre_cliente', 'ID_Producto', 'Nombre_producto', 'Descripcion', 'Cantidad_producto', 'Precio_unitario_producto', 'Precio_total_productos', 'Cantidad_pagar', 'Ubicacion', 'Fecha', 'Estatus']
    });

    const cantidadPagarPorPedido = {};

    consultar_Pedidos.forEach(pedido => {
        if (!cantidadPagarPorPedido[pedido.No_pedido]) {
            cantidadPagarPorPedido[pedido.No_pedido] = 0;
        }
        cantidadPagarPorPedido[pedido.No_pedido] += pedido.Precio_total_productos;
    });

    res.render('pedidosEnCurso', {
        cantidadPagarPorPedido,
        consultar_Pedidos,
        titulo: "Pedidos",
        enc: "Pedidos realizados"
    });
}

const visualizarPedido = async (req, res) => {

    const usuarioLogueado = req.session.cliente;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }
    const idCliente = usuarioLogueado.ID_Cliente;
    const consultar_Pedidos = await pedidosModel.findAll({ where: {
        ID_Cliente: idCliente},
        attributes: ['No_pedido', 'ID_Cliente', 'Nombre_cliente', 'ID_Producto', 'Nombre_producto', 'Descripcion', 'Cantidad_producto', 'Precio_unitario_producto', 'Precio_total_productos', 'Cantidad_pagar', 'Ubicacion', 'Fecha', 'Estatus']
    });

    const cantidadPagarPorPedido = {};

    consultar_Pedidos.forEach(pedido => {
        if (!cantidadPagarPorPedido[pedido.No_pedido]) {
            cantidadPagarPorPedido[pedido.No_pedido] = 0;
        }
        cantidadPagarPorPedido[pedido.No_pedido] += pedido.Precio_total_productos;
    });

    res.render('pedidoCliente', {
        cantidadPagarPorPedido,
        consultar_Pedidos,
        titulo: "Mis pedidos",
        enc: "Pedidos realizados"
    });
};

const actualizacionPedido = (req, res) => {
    
    const No_pedido = req.query.id;
    const Ubicacion = req.query.ubicacion;
    const Estatus = req.query.Estatus;

    res.render('actualizacionPedidos',{
        titulo: 'Actualizar pedido',
        No_pedido,
        Ubicacion,
        Estatus
    })
};

const actualizarPedido = async (req, res) => {

    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    const {ubicacion, estatus} = req.body;
    const noPedido = req.params.id;
    console.log("No pedido: ", noPedido, "Ubicacion: ", ubicacion, "Estatus: ", estatus)

    try {
            await pedidosModel.update({
                Ubicacion: ubicacion,
                Estatus: estatus
            }, {where: {
                No_pedido: noPedido
            }});

            const consultar_Pedidos = await pedidosModel.findAll({
                attributes: ['No_pedido', 'ID_Cliente', 'Nombre_cliente', 'ID_Producto', 'Nombre_producto', 'Descripcion', 'Cantidad_producto', 'Precio_unitario_producto', 'Precio_total_productos', 'Ubicacion', 'Fecha', 'Estatus']
            });

            const cantidadPagarPorPedido = {};

            consultar_Pedidos.forEach(pedido => {
                if (!cantidadPagarPorPedido[pedido.No_pedido]) {
                    cantidadPagarPorPedido[pedido.No_pedido] = 0;
                }
                cantidadPagarPorPedido[pedido.No_pedido] += pedido.Precio_total_productos;
            });

            await logsUsuarioModel.create({
                ID_Usuario: usuarioLogueado.ID_Usuario,
                Rol: usuarioLogueado.Rol,
                Nombre_usuario: usuarioLogueado.Nombre,
                Accion: "Actualización",
                Descripcion: ("Se actualiza pedido número: " + noPedido),
                Fecha_hora: Date.now(),
                IP: ipAddress
            })

            res.render('pedidosEnCurso', {
                consultar_Pedidos,
                cantidadPagarPorPedido,
                titulo: "Pedidos"
            });
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const cancelarPedido = async (req, res) =>  {

    const usuarioLogueado = req.session.cliente;
    const NumPedido = req.params.id
    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    try
    {
    const idCliente = usuarioLogueado.ID_Cliente;

    
    const pedidos = await pedidosModel.findAll({ where: {
        ID_Cliente: idCliente,
        No_pedido: NumPedido
    },
        attributes: ['No_pedido', 'ID_Cliente', 'Nombre_cliente', 'ID_Producto', 'Nombre_producto', 'Descripcion', 'Cantidad_producto', 'Precio_unitario_producto', 'Precio_total_productos', 'Fecha', 'Estatus']
    });

    const cantidadPagarPorPedido = {};

    pedidos.forEach(pedido => {
        if (!cantidadPagarPorPedido[pedido.No_pedido]) {
            cantidadPagarPorPedido[pedido.No_pedido] = 0;
        }
        cantidadPagarPorPedido[pedido.No_pedido] += pedido.Precio_total_productos;
    });

    for (const historial of pedidos) {
        await historialModel.create({
        No_pedido: historial.No_pedido,
        ID_Cliente: usuarioLogueado.ID_Cliente,
        Nombre_cliente: historial.Nombre_cliente,
        ID_Producto: historial.ID_Producto,
        Nombre_producto: historial.Nombre_producto,
        Descripcion: historial.Descripcion,
        Cantidad_producto: historial.Cantidad_producto,
        Precio_unitario_producto: historial.Precio_unitario_producto,
        Precio_total_productos: historial.Precio_total_productos,
        Cantidad_pagar: cantidadPagarPorPedido,
        Fecha: historial.Fecha,
        Estatus: "Cancelado",
        motivo_Cancelacion: "Cancelaste este pedido"
    })
    }

    await pedidosModel.destroy({
        where: {
            No_pedido: NumPedido
        }
    })

    const consultar_Pedidos = await pedidosModel.findAll({ where: {
        ID_Cliente: idCliente},
        attributes: ['No_pedido', 'ID_Cliente', 'Nombre_cliente', 'ID_Producto', 'Nombre_producto', 'Descripcion', 'Cantidad_producto', 'Precio_unitario_producto', 'Precio_total_productos', 'Ubicacion', 'Fecha', 'Estatus']
    });

    var pedidoCancelado = ("Se cancela pedido número " + NumPedido + " por parte del cliente");

    await logsClienteModel.create({
        ID_Cliente: idCliente,
        Rol: usuarioLogueado.Rol,
        Nombre_cliente: usuarioLogueado.Nombre,
        Accion: "Cancelación",
        Descripcion: pedidoCancelado,
        Fecha_hora: Date.now(),
        IP: ipAddress
    })

    res.render('pedidoCliente', {
        cantidadPagarPorPedido,
        consultar_Pedidos,
        titulo: "Mis pedidos",
        enc: "Mis pedidos"
    })
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        res.status(500).send('Error interno del servidor');
    } 
}

/*                                           Fin de controladores para los pedidos                                     */

/*                                           Inicio de controladores para el historial                                     */

const pedidosFinalizados = async (req, res) => {
    const userLogueado = req.session.usuario;
    const usuarioLogueado = req.session.cliente;
    const rol = req.session.userRole;

    if (!usuarioLogueado && !userLogueado) {
        return res.redirect('/login');
    }

    try {

    if(usuarioLogueado)
    {
    const idCliente = usuarioLogueado.ID_Cliente;
    const consultar_Historial = await historialModel.findAll({ where: {
        ID_Cliente: idCliente
    },
    });

    const cantidadPagarPorPedido = {};

    consultar_Historial.forEach(pedido => {
        if (!cantidadPagarPorPedido[pedido.No_pedido]) {
            cantidadPagarPorPedido[pedido.No_pedido] = 0;
        }
        cantidadPagarPorPedido[pedido.No_pedido] += pedido.Precio_total_productos;
    });

    res.render('pedidosFinalizados', {
        cantidadPagarPorPedido,
        consultar_Historial,
        titulo: "Historial",
        enc: "Historial de pedidos"
    });
    }


    if(userLogueado && (rol == "Empleado" || rol == "Administrador"))
    {
        const consultar_Historial = await historialModel.findAll();
        const cantidadPagarPorPedido = {};

        consultar_Historial.forEach(pedido => {
        if (!cantidadPagarPorPedido[pedido.No_pedido]) {
            cantidadPagarPorPedido[pedido.No_pedido] = 0;
        }
        cantidadPagarPorPedido[pedido.No_pedido] += pedido.Precio_total_productos;
    });

    res.render('pedidosFinalizados', {
        cantidadPagarPorPedido,
        consultar_Historial,
        titulo: "Historial",
        enc: "Historial de pedidos"
    });
    }
} catch (error) {
    console.error('Error al consultar el historial:', error);
    res.status(500).send('Error interno del servidor');
}
}

/*                                           CRUD Usuarios                                     */
/*Ingreso al formulario para registro de usuarios*/
const registroUsuarios = (req, res)=>{
    res.render('registroUsuarios', 
    {titulo:'Registro de usuarios', 
    enc:'Registro de usuarios', 
    desc:'Complete el siguiente formulario para llevar a cabo su registro'});//no pone la ruta al estar cargado el EJS desde views, para que el elemento dentro de las llaves se debe mandar llamar desde el EJS
}

/*Controlador para acceder al formulario de actualización*/
const formularioActualizacion = (req, res) => {
    const ID_Usuario = req.query.id;
    const Nombre = req.query.nombre;
    const Apellido = req.query.apellido;
    const Direccion = req.query.direccion;
    const Edad = req.query.edad;
    const Fecha_nacimiento = req.query.fechaNacimiento;
    const Rol = req.query.rol;

    res.render('formularioActualizacion',{
        titulo: 'Actualizar usuarios',
        ID_Usuario,
        Nombre,
        Apellido,
        Direccion,
        Edad,
        Fecha_nacimiento,
        Rol
    })
};

/*Controlador para creación de usuarios*/
const altasUsuario = async (req, res) => {
    try {

            const usuarioLogueado = req.session.usuario;

        if (!usuarioLogueado) {
            return res.redirect('/login');
        }

        const idCliente = usuarioLogueado.ID_Cliente;

        const {Nombre, Apellido, Direccion, Edad, Fecha_nacimiento, Telefono, Correo, Rol, Nombre_usuario, Contrasena} = req.body;
        const stringCharacter = ["'","-","`","~","!","¡","@","#","$","%","^","&","*","(",")","_","=","-","{","}","[","]","?","<",">",".",",","/","*","-","+",":",";",'"', "´", "°"] ;
        const stringNumber ="0, 1, 2, 3, 4, 5, 6, 7, 8, 9";
        const stringCharacterD = ["'","-","`","~","!","¡","@","#","$","%","^","&","*","(",")","_","=","-","{","}","[","]","?","<",">",".","/","*","-","+",":",";",'"', "´", "°"] ;
        const stringCharacterC = ["'","-","`","~","!","¡","#","$","%","^","&","*","(",")","=","-","{","}","[","]","?","<",">",",","/","*","-","+",":",";",'"', "´", "°"] ;
        const numberLetter= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        let NombreV;
        let ApellidoV;
        let DireccionV;
        let EdadV;
        let TelefonoV;
        let CorreoV;
        let Nombre_usuarioV;
        let ContrasenaV
        NombreV=Nombre.trim();
        ApellidoV=Apellido.trim();
        DireccionV=Direccion.trim();
        EdadV=Edad.trim();
        TelefonoV=Telefono.trim();
        CorreoV=Correo.trim();
        Nombre_usuarioV=Nombre_usuario.trim();
        ContrasenaV=Contrasena.trim();
        longitudNombre=NombreV.length;
        longitudApellido=ApellidoV.length;
        longitudDireccion=DireccionV.length;
        longitudEdad=EdadV.length;
        longitudTelefono=TelefonoV.length;
        longitudCorreo=CorreoV.length; 
        longitudNombre_Usuario=Nombre_usuarioV.length; 
        longitudContrasena=ContrasenaV.length;
            if (NombreV==="" || ApellidoV=="" || DireccionV=="" || EdadV=="" || TelefonoV=="" || CorreoV=="" || Nombre_usuarioV=="" || ContrasenaV=="") {
                console.log("Complete todos los campos");
                res.render('registroUsuarios',{
                    titulo:'Usuarios registrados', 
                    enc:'Usuarios registrados'});
            }
            else{  
                if (longitudNombre<4 || longitudNombre>30) {
                    console.log("El nombre solo debe tener una longitud entre 4 y 30 caracteres");
                    res.render('registroUsuarios',{
                        titulo:'Usuarios registrados', 
                        enc:'Usuarios registrados'});
                }
                else
                {
                    for (let index = 0; index < NombreV.length; index++) {
                        extraeNombre=NombreV.charAt(index);
                        console.log(extraeNombre); 
                        NombreV_numbers=stringNumber.indexOf(extraeNombre);
                        NombreV_character=stringCharacter.indexOf(extraeNombre);
                        console.log(NombreV_numbers);  
                        console.log(NombreV_character);   
                        }
                    if (NombreV_numbers>=0) {
                        console.log("El nombre no debe contener números");
                        res.render('registroUsuarios',{
                            titulo:'Usuarios registrados', 
                            enc:'Usuarios registrados'});
     
                    }
                    else
                        { 
                            if (NombreV_character>=0) {
                                console.log("El nombre no debe contener caracteres");
                                res.render('registroUsuarios',{
                                    titulo:'Usuarios registrados', 
                                    enc:'Usuarios registrados'});
                            }
                            else
                            {
                                if (longitudApellido<4 || longitudApellido>30) {
                                    console.log("El apellido solo debe tener una longitud entre 4 y 30 caracteres");
                                    res.render('registroUsuarios',{
                                    titulo:'Usuarios registrados', 
                                    enc:'Usuarios registrados'});
                                }
                                else
                                {
                                    for (let index = 0; index < ApellidoV.length; index++) {
                                        extraeApellido=ApellidoV.charAt(index);
                                        console.log(extraeApellido); 
                                        ApellidoV_numbers=stringNumber.indexOf(extraeApellido);
                                        ApellidoV_character=stringCharacter.indexOf(extraeApellido);
                                        console.log(ApellidoV_numbers);  
                                        console.log(ApellidoV_character);   
                                    }
                                        if (ApellidoV_numbers>=0) {
                                            console.log("El apellido no debe contener números");
                                            res.render('registroUsuarios',{
                                            titulo:'Usuarios registrados', 
                                            enc:'Usuarios registrados'});
                                        }
                                        else
                                        { 
                                            if (ApellidoV_character>=0) {
                                                console.log("El apellido no debe contener caracteres");
                                                res.render('registroUsuarios',{
                                                titulo:'Usuarios registrados', 
                                                enc:'Usuarios registrados'});
                                            }
                                            else
                                            {
                                                if (longitudDireccion<20 || longitudDireccion>75) {     
                                                    console.log("La dirección debe tener una longitud entre 20 y 75 caracteres");
                                                    res.render('registroUsuarios',{
                                                    titulo:'Usuarios registrados', 
                                                    enc:'Usuarios registrados'});  
                                                }
                                                else
                                                {
                                                    for (let index = 0; index < DireccionV.length; index++) {
                                                        extraeDireccion=DireccionV.charAt(index);
                                                        console.log(extraeDireccion); 
                                                        DireccionV_character=stringCharacterD.indexOf(extraeDireccion);
                                                        console.log(DireccionV_character);   
                                                    }
                                                    if (DireccionV_character>=0) {
                                                        console.log("La direccion no debe contener caracteres especiales");
                                                        res.render('registroUsuarios',{
                                                        titulo:'Usuarios registrados', 
                                                        enc:'Usuarios registrados'});
                                                    }
                                                    else
                                                    {
                                                        if (longitudEdad!=2) {
                                                            console.log("La edad debe ser de dos digitos");
                                                            res.render('registroUsuarios',{
                                                            titulo:'Usuarios registrados', 
                                                            enc:'Usuarios registrados'});
                                                        }
                                                        else
                                                        {
                                                            for (let index = 0; index < EdadV.length; index++) {
                                                                extraeEdad=EdadV.charAt(index);
                                                                console.log(extraeEdad); 
                                                                EdadV_letters=numberLetter.indexOf(extraeEdad);
                                                                EdadV_character=stringCharacter.indexOf(extraeEdad);
                                                                console.log(EdadV_letters);  
                                                                console.log(EdadV_character);   
                                                            }
                                                            if (EdadV_letters>=0) {
                                                                console.log("La edad debe ser numerica");
                                                                res.render('registroUsuarios',{
                                                                titulo:'Usuarios registrados', 
                                                                enc:'Usuarios registrados'});
                                                            }
                                                            else
                                                            {
                                                                if (EdadV_character>=0) {
                                                                    console.log("La edad no debe contener caracteres especiales");
                                                                    res.render('registroUsuarios',{
                                                                    titulo:'Usuarios registrados', 
                                                                    enc:'Usuarios registrados'});
                                                                }
                                                                else
                                                                {
                                                                    if (longitudTelefono!=10) {
                                                                        console.log("La longitud del telefono debe ser de 10 numéros");
                                                                        res.render('registroUsuarios',{
                                                                        titulo:'Usuarios registrados', 
                                                                        enc:'Usuarios registrados'});
                                                                    }
                                                                    else
                                                                    {
                                                                        for (let index = 0; index < TelefonoV.length; index++) {
                                                                            extraeTelefono=TelefonoV.charAt(index);
                                                                            console.log(extraeTelefono); 
                                                                            TelefonoV_letters=numberLetter.indexOf(extraeTelefono);
                                                                            TelefonoV_character=stringCharacter.indexOf(extraeTelefono);
                                                                            console.log(EdadV_letters);  
                                                                            console.log(EdadV_character);   
                                                                        }
                                                                        if (TelefonoV_letters>=0) {
                                                                            console.log("El telefono no debe contener letras");
                                                                            res.render('registroUsuarios',{
                                                                            titulo:'Usuarios registrados', 
                                                                            enc:'Usuarios registrados'});
                                                                        }
                                                                        else
                                                                        {
                                                                            if (TelefonoV_character>=0) {
                                                                                console.log("El telefono no debe contener caracteres especiales");
                                                                                res.render('registroUsuarios',{
                                                                                titulo:'Usuarios registrados', 
                                                                                enc:'Usuarios registrados'});
                                                                            }
                                                                            else
                                                                            {
                                                                                const nTelUser = await usuarioModel.findOne({ where: {Telefono: TelefonoV}});
                                                                                const nTelClient = await clienteModel.findOne({ where: {Telefono: TelefonoV}});
                                                                                if (nTelUser || nTelClient) {
                                                                                    console.log("Ese número de telefono ya ha sido registrado, intente con otro");
                                                                                    res.render('registroUsuarios',{
                                                                                    titulo:'Usuarios registrados', 
                                                                                    enc:'Usuarios registrados'});
                                                                                }
                                                                                else
                                                                                {
                                                                                    if (longitudCorreo<10 || longitudCorreo>30) {
                                                                                        console.log("El correo debe tener una longitud entre 10 y 30 caracteres");
                                                                                        res.render('registroUsuarios',{
                                                                                        titulo:'Usuarios registrados', 
                                                                                        enc:'Usuarios registrados'});
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        for (let index = 0; index < CorreoV.length; index++) {
                                                                                            extraeCorreo=CorreoV.charAt(index);
                                                                                            console.log(extraeCorreo); 
                                                                                            CorreoV_character=stringCharacterC.indexOf(extraeCorreo);
                                                                                            console.log(CorreoV_character);   
                                                                                        }
                                                                                        if (CorreoV_character>=0) {
                                                                                            console.log("El correo no debe contener caracteres especiales");
                                                                                            res.render('registroUsuarios',{
                                                                                            titulo:'Usuarios registrados', 
                                                                                            enc:'Usuarios registrados'});
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            const corrUser = await usuarioModel.findOne({ where: {Correo: CorreoV}});
                                                                                            const corrClient = await clienteModel.findOne({ where: {Correo: CorreoV}});
                                                                                            if (corrUser || corrClient) {
                                                                                                console.log("Ese correo ya ha sido registrado, intente con otro");
                                                                                                res.render('registroUsuarios',{
                                                                                                titulo:'Usuarios registrados', 
                                                                                                enc:'Usuarios registrados'});
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                if (longitudNombre_Usuario<8 || longitudNombre_Usuario>15) {
                                                                                                    console.log("El nombre de usuario debe tener como minino 8 caracteres y maximo 15");
                                                                                                    res.render('registroUsuarios',{
                                                                                                    titulo:'Usuarios registrados', 
                                                                                                    enc:'Usuarios registrados'});
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    for (let index = 0; index < Nombre_usuarioV.length; index++) {
                                                                                                        extraeNombreU=Nombre_usuarioV.charAt(index);
                                                                                                        console.log(extraeNombreU); 
                                                                                                        NombreUV_numbers=stringNumber.indexOf(extraeNombreU);
                                                                                                        NombreUV_character=stringCharacter.indexOf(extraeNombreU);
                                                                                                        console.log(NombreUV_numbers);  
                                                                                                        console.log(NombreUV_character);   
                                                                                                    }
                                                                                                    if (NombreUV_numbers>=0) {
                                                                                                        console.log("El nombre de usuario no debe contener numeros");
                                                                                                        res.render('registroUsuarios',{
                                                                                                        titulo:'Usuarios registrados', 
                                                                                                        enc:'Usuarios registrados'});
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        if (NombreUV_character>=0) {
                                                                                                            console.log("El nombre de usuario no debe contener caracteres especiales");
                                                                                                            res.render('registroUsuarios',{
                                                                                                            titulo:'Usuarios registrados', 
                                                                                                            enc:'Usuarios registrados'});
                                                                                                        }
                                                                                                        else
                                                                                                        {
                                                                                                            const nuUser = await usuarioModel.findOne({ where: {Nombre_usuario: Nombre_usuarioV}});
                                                                                                            const nuClient = await clienteModel.findOne({ where: {Nombre_usuario: Nombre_usuarioV}});
                                                                                                            if (nuClient || nuUser) {
                                                                                                                console.log("Ese nombre de usuario ya ha sido registrado, intente con otro");
                                                                                                                res.render('registroUsuarios',{
                                                                                                                titulo:'Usuarios registrados', 
                                                                                                                enc:'Usuarios registrados'});
                                                                                                            }
                                                                                                            else
                                                                                                            {
                                                                                                                if (longitudContrasena!=8) {
                                                                                                                    console.log("La contraseña debe de tener una longitud de 8 letras y numeros");
                                                                                                                    res.render('registroUsuarios',{
                                                                                                                    titulo:'Usuarios registrados', 
                                                                                                                    enc:'Usuarios registrados'});
                                                                                                                }
                                                                                                                else
                                                                                                                {
                                                                                                                    for (let index = 0; index < ContrasenaV.length; index++) {
                                                                                                                        extraeContrasena=ContrasenaV.charAt(index);
                                                                                                                        console.log(extraeContrasena); 
                                                                                                                        ContrasenaV_letters=numberLetter.indexOf(extraeContrasena);
                                                                                                                        ContrasenaV_character=stringCharacter.indexOf(extraeContrasena);
                                                                                                                        ContrasenaV_numbers=stringNumber.indexOf(extraeContrasena);
                                                                                                                        console.log(ContrasenaV_letters);  
                                                                                                                        console.log(ContrasenaV_character);  
                                                                                                                        console.log(ContrasenaV_numbers);  
                                                                                                                    }
                                                                                                                    if (ContrasenaV_character>=0) {
                                                                                                                        console.log("La contraseña no debe contener caracteres especiales");
                                                                                                                        res.render('registroUsuarios',{
                                                                                                                        titulo:'Usuarios registrados', 
                                                                                                                        enc:'Usuarios registrados'});
                                                                                                                    }
                                                                                                                        else
                                                                                                                        {
                                                                                                                            const passwordHash = await encrypt(ContrasenaV)
                                                                                                                            const nuevoUsuario = await usuarioModel.create({
                                                                                                                            Nombre:NombreV,
                                                                                                                            Apellido:ApellidoV,
                                                                                                                            Direccion:DireccionV,
                                                                                                                            Edad:EdadV,
                                                                                                                            Fecha_nacimiento,
                                                                                                                            Telefono:TelefonoV,
                                                                                                                            Correo:CorreoV,
                                                                                                                            Rol,
                                                                                                                            Nombre_usuario:Nombre_usuarioV,
                                                                                                                            Contrasena: passwordHash
                                                                                                                            });
                                                                                                                            
                                                                                                                            await logsUsuarioModel.create({
                                                                                                                                ID_Usuario: usuarioLogueado.ID_Usuario,
                                                                                                                                Rol: usuarioLogueado.Rol,
                                                                                                                                Nombre_usuario: usuarioLogueado.Nombre_usuario,
                                                                                                                                Accion: "Creación",
                                                                                                                                Descripcion: "Se crea un nuevo empleado",
                                                                                                                                Fecha_hora: Date.now(),
                                                                                                                                IP: ipAddress
                                                                                                                            })

                                                                                                                            res.render('registroUsuarios',{
                                                                                                                            titulo:'Usuarios registrados', 
                                                                                                                            enc:'Usuarios registrados'});
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                }
                            }
                        }
                }
            }
        catch (error) {
        console.error('Error al crear nuevo usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};


/*Controlador para actualización de usuarios*/
const actualizarUsuario = async (req, res) => {

    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    const userId = req.params.id;
    const {Nombre, Apellido, Direccion, Edad, Fecha_nacimiento, Rol} = req.body;

    try {
        const usuario = await usuarioModel.findByPk(userId);

        if (usuario) {
            await usuario.update({
                Nombre,
                Apellido,
                Direccion,
                Edad,
                Fecha_nacimiento,
                Rol
            });

            await logsUsuarioModel.create({
                ID_Usuario: usuarioLogueado.ID_Usuario,
                Rol: usuarioLogueado.Rol,
                Nombre_usuario: usuarioLogueado.Nombre,
                Accion: "Actualización",
                Descripcion: ("Se actualizan datos del usuario: " + userId),
                Fecha_hora: Date.now(),
                IP: ipAddress
            })

            res.redirect('/usuariosRegistrados'); 
        } else {
            res.status(404).json({ error: 'No se encontró ningún usuario para actualizar' });
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


/*Controlador para baja de usuarios*/
const eliminarUsuario = async (req, res) => {

    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }
    const valores = req.params.id;

    try {
        const user = await usuarioModel.findByPk(valores);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        await user.destroy();
        const consultar_User = await usuarioModel.findAll();

        await logsUsuarioModel.create({
            ID_Usuario: usuarioLogueado.ID_Usuario,
            Rol: usuarioLogueado.Rol,
            Nombre_usuario: usuarioLogueado.Nombre,
            Accion: "Eliminación",
            Descripcion: ("Se elimina el usuario: " + valores),
            Fecha_hora: Date.now(),
            IP: ipAddress
        })

        res.render('usuariosRegistrados',
            {consultar_User,
            titulo:'Usuarios registrados', 
            enc:'Usuarios registrados'});
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

/*Controlador para consulta de usuarios*/
const consultasUsuarios = async (req, res) => {
    const consultar_User = await usuarioModel.findAll();
    console.log(consultar_User);
    res.render('usuariosRegistrados',
    {consultar_User,
    titulo:'Usuarios registrados', 
    enc:'Usuarios registrados'});
}

/*                                            Fin CRUD Usuarios                                         */

/*                                           CRUD Clientes                                     */
const registroClientes = (req, res)=>{
    res.render('registroClientes', 
    {titulo:'Registro de clientes', 
    enc:'Registro de clientes', 
    desc:'Complete el siguiente formulario para llevar a cabo su registro'});//no pone la ruta al estar cargado el EJS desde views, para que el elemento dentro de las llaves se debe mandar llamar desde el EJS
}

const altasClientes = async (req, res) => {
    try {
        const {Nombre, Apellido, Direccion, Edad, Fecha_nacimiento, Telefono, Correo, Rol, Nombre_usuario, Contrasena} = req.body;
        const stringCharacter = ["'","-","`","~","!","¡","@","#","$","%","^","&","*","(",")","_","=","-","{","}","[","]","?","<",">",".",",","/","*","-","+",":",";",'"', "´", "°"] ;
        const stringNumber ="0, 1, 2, 3, 4, 5, 6, 7, 8, 9";
        const stringCharacterD = ["'","-","`","~","!","¡","@","#","$","%","^","&","*","(",")","_","=","-","{","}","[","]","?","<",">",".","/","*","-","+",":",";",'"', "´", "°"] ;
        const stringCharacterC = ["'","-","`","~","!","¡","#","$","%","^","&","*","(",")","=","-","{","}","[","]","?","<",">",",","/","*","-","+",":",";",'"', "´", "°"] ;
        const numberLetter= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        let NombreV;
        let ApellidoV;
        let DireccionV;
        let EdadV;
        let TelefonoV;
        let CorreoV;
        let Nombre_usuarioV;
        let ContrasenaV
        NombreV=Nombre.trim();
        ApellidoV=Apellido.trim();
        DireccionV=Direccion.trim();
        EdadV=Edad.trim();
        TelefonoV=Telefono.trim();
        CorreoV=Correo.trim();
        Nombre_usuarioV=Nombre_usuario.trim();
        ContrasenaV=Contrasena.trim();
        longitudNombre=NombreV.length;
        longitudApellido=ApellidoV.length;
        longitudDireccion=DireccionV.length;
        longitudEdad=EdadV.length;
        longitudTelefono=TelefonoV.length;
        longitudCorreo=CorreoV.length; 
        longitudNombre_Usuario=Nombre_usuarioV.length; 
        longitudContrasena=ContrasenaV.length;
            if (NombreV==="" || ApellidoV=="" || DireccionV=="" || EdadV=="" || TelefonoV=="" || CorreoV=="" || Nombre_usuarioV=="" || ContrasenaV=="") {
                console.log("Complete todos los campos");
                res.render('registroClientes', 
                {titulo:'Registro de clientes', 
                enc:'Registro de clientes', 
                desc:'Complete el siguiente formulario para llevar a cabo su registro'});
            }
            else{  
                if (longitudNombre<4 || longitudNombre>30) {
                    console.log("El nombre solo debe tener una longitud entre 4 y 30 caracteres");
                    res.render('registroClientes', 
                    {titulo:'Registro de clientes', 
                    enc:'Registro de clientes', 
                    desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                }
                else
                {
                    for (let index = 0; index < NombreV.length; index++) {
                        extraeNombre=NombreV.charAt(index);
                        console.log(extraeNombre); 
                        NombreV_numbers=stringNumber.indexOf(extraeNombre);
                        NombreV_character=stringCharacter.indexOf(extraeNombre);
                        console.log(NombreV_numbers);  
                        console.log(NombreV_character);   
                        }
                    if (NombreV_numbers>=0) {
                        console.log("El nombre no debe contener números");
                        res.render('registroClientes', 
                        {titulo:'Registro de clientes', 
                        enc:'Registro de clientes', 
                        desc:'Complete el siguiente formulario para llevar a cabo su registro'});     
                    }
                    else
                        { 
                            if (NombreV_character>=0) {
                                console.log("El nombre no debe contener caracteres");
                                res.render('registroClientes', 
                                {titulo:'Registro de clientes', 
                                enc:'Registro de clientes', 
                                desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                            }
                            else
                            {
                                if (longitudApellido<4 || longitudApellido>30) {
                                    console.log("El apellido solo debe tener una longitud entre 4 y 30 caracteres");
                                    res.render('registroClientes', 
                                    {titulo:'Registro de clientes', 
                                    enc:'Registro de clientes', 
                                    desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                }
                                else
                                {
                                    for (let index = 0; index < ApellidoV.length; index++) {
                                        extraeApellido=ApellidoV.charAt(index);
                                        console.log(extraeApellido); 
                                        ApellidoV_numbers=stringNumber.indexOf(extraeApellido);
                                        ApellidoV_character=stringCharacter.indexOf(extraeApellido);
                                        console.log(ApellidoV_numbers);  
                                        console.log(ApellidoV_character);   
                                    }
                                        if (ApellidoV_numbers>=0) {
                                            console.log("El apellido no debe contener números");
                                            res.render('registroClientes', 
                                            {titulo:'Registro de clientes', 
                                            enc:'Registro de clientes', 
                                            desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                        }
                                        else
                                        { 
                                            if (ApellidoV_character>=0) {
                                                console.log("El apellido no debe contener caracteres");
                                                res.render('registroClientes', 
                                                {titulo:'Registro de clientes', 
                                                enc:'Registro de clientes', 
                                                desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                            }
                                            else
                                            {
                                                if (longitudDireccion<20 || longitudDireccion>75) {     
                                                    console.log("La dirección debe tener una longitud entre 20 y 75 caracteres");
                                                    res.render('registroClientes', 
                                                    {titulo:'Registro de clientes', 
                                                    enc:'Registro de clientes', 
                                                    desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                }
                                                else
                                                {
                                                    for (let index = 0; index < DireccionV.length; index++) {
                                                        extraeDireccion=DireccionV.charAt(index);
                                                        console.log(extraeDireccion); 
                                                        DireccionV_character=stringCharacterD.indexOf(extraeDireccion);
                                                        console.log(DireccionV_character);   
                                                    }
                                                    if (DireccionV_character>=0) {
                                                        console.log("La direccion no debe contener caracteres especiales");
                                                        res.render('registroClientes', 
                                                        {titulo:'Registro de clientes', 
                                                        enc:'Registro de clientes', 
                                                        desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                    }
                                                    else
                                                    {
                                                        if (longitudEdad!=2) {
                                                            console.log("La edad debe ser de dos digitos");
                                                            res.render('registroClientes', 
                                                            {titulo:'Registro de clientes', 
                                                            enc:'Registro de clientes', 
                                                            desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                        }
                                                        else
                                                        {
                                                            for (let index = 0; index < EdadV.length; index++) {
                                                                extraeEdad=EdadV.charAt(index);
                                                                console.log(extraeEdad); 
                                                                EdadV_letters=numberLetter.indexOf(extraeEdad);
                                                                EdadV_character=stringCharacter.indexOf(extraeEdad);
                                                                console.log(EdadV_letters);  
                                                                console.log(EdadV_character);   
                                                            }
                                                            if (EdadV_letters>=0) {
                                                                console.log("La edad debe ser numerica");
                                                                res.render('registroClientes', 
                                                                {titulo:'Registro de clientes', 
                                                                enc:'Registro de clientes', 
                                                                desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                            }
                                                            else
                                                            {
                                                                if (EdadV_character>=0) {
                                                                    console.log("La edad no debe contener caracteres especiales");
                                                                    res.render('registroClientes', 
                                                                    {titulo:'Registro de clientes', 
                                                                    enc:'Registro de clientes', 
                                                                    desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                }
                                                                else
                                                                {
                                                                    if (longitudTelefono!=10) {
                                                                        console.log("La longitud del telefono debe ser de 10 numéros");
                                                                        res.render('registroClientes', 
                                                                        {titulo:'Registro de clientes', 
                                                                        enc:'Registro de clientes', 
                                                                        desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                    }
                                                                    else
                                                                    {
                                                                        for (let index = 0; index < TelefonoV.length; index++) {
                                                                            extraeTelefono=TelefonoV.charAt(index);
                                                                            console.log(extraeTelefono); 
                                                                            TelefonoV_letters=numberLetter.indexOf(extraeTelefono);
                                                                            TelefonoV_character=stringCharacter.indexOf(extraeTelefono);
                                                                            console.log(EdadV_letters);  
                                                                            console.log(EdadV_character);   
                                                                        }
                                                                        if (TelefonoV_letters>=0) {
                                                                            console.log("El telefono no debe contener letras");
                                                                            res.render('registroClientes', 
                                                                            {titulo:'Registro de clientes', 
                                                                            enc:'Registro de clientes', 
                                                                            desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                        }
                                                                        else
                                                                        {
                                                                            if (TelefonoV_character>=0) {
                                                                                console.log("El telefono no debe contener caracteres especiales");
                                                                                res.render('registroClientes', 
                                                                                {titulo:'Registro de clientes', 
                                                                                enc:'Registro de clientes', 
                                                                                desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                            }
                                                                            else
                                                                            {
                                                                                const nTelUser = await usuarioModel.findOne({ where: {Telefono: TelefonoV}});
                                                                                const nTelClient = await clienteModel.findOne({ where: {Telefono: TelefonoV}});
                                                                                if (nTelUser || nTelClient) {
                                                                                    console.log("Ese número de telefono ya ha sido registrado, intente con otro");
                                                                                    res.render('registroClientes', 
                                                                                    {titulo:'Registro de clientes', 
                                                                                    enc:'Registro de clientes', 
                                                                                    desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                                }
                                                                                else
                                                                                {
                                                                                    if (longitudCorreo<10 || longitudCorreo>30) {
                                                                                        console.log("El correo debe tener una longitud entre 10 y 30 caracteres");
                                                                                        res.render('registroClientes', 
                                                                                        {titulo:'Registro de clientes', 
                                                                                        enc:'Registro de clientes', 
                                                                                        desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        for (let index = 0; index < CorreoV.length; index++) {
                                                                                            extraeCorreo=CorreoV.charAt(index);
                                                                                            console.log(extraeCorreo); 
                                                                                            CorreoV_character=stringCharacterC.indexOf(extraeCorreo);
                                                                                            console.log(CorreoV_character);   
                                                                                        }
                                                                                        if (CorreoV_character>=0) {
                                                                                            console.log("El correo no debe contener caracteres especiales");
                                                                                            res.render('registroClientes', 
                                                                                            {titulo:'Registro de clientes', 
                                                                                            enc:'Registro de clientes', 
                                                                                            desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            const corrUser = await usuarioModel.findOne({ where: {Correo: CorreoV}});
                                                                                            const corrClient = await clienteModel.findOne({ where: {Correo: CorreoV}});
                                                                                            if (corrUser || corrClient) {
                                                                                                console.log("Ese correo ya ha sido registrado, intente con otro");
                                                                                                res.render('registroClientes', 
                                                                                                {titulo:'Registro de clientes', 
                                                                                                enc:'Registro de clientes', 
                                                                                                desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                if (longitudNombre_Usuario<8 || longitudNombre_Usuario>15) {
                                                                                                    console.log("El nombre de usuario debe tener como minino 8 caracteres y maximo 15");
                                                                                                    res.render('registroClientes', 
                                                                                                    {titulo:'Registro de clientes', 
                                                                                                    enc:'Registro de clientes', 
                                                                                                    desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    for (let index = 0; index < Nombre_usuarioV.length; index++) {
                                                                                                        extraeNombreU=Nombre_usuarioV.charAt(index);
                                                                                                        console.log(extraeNombreU); 
                                                                                                        NombreUV_numbers=stringNumber.indexOf(extraeNombreU);
                                                                                                        NombreUV_character=stringCharacter.indexOf(extraeNombreU);
                                                                                                        console.log(NombreUV_numbers);  
                                                                                                        console.log(NombreUV_character);   
                                                                                                    }
                                                                                                    if (NombreUV_numbers>=0) {
                                                                                                        console.log("El nombre de usuario no debe contener numeros");
                                                                                                        res.render('registroClientes', 
                                                                                                        {titulo:'Registro de clientes', 
                                                                                                        enc:'Registro de clientes', 
                                                                                                        desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        if (NombreUV_character>=0) {
                                                                                                            console.log("El nombre de usuario no debe contener caracteres especiales");
                                                                                                            res.render('registroClientes', 
                                                                                                            {titulo:'Registro de clientes', 
                                                                                                            enc:'Registro de clientes', 
                                                                                                            desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                                                        }
                                                                                                        else
                                                                                                        {
                                                                                                            const nuUser = await usuarioModel.findOne({ where: {Nombre_usuario: Nombre_usuarioV}});
                                                                                                            const nuClient = await clienteModel.findOne({ where: {Nombre_usuario: Nombre_usuarioV}});
                                                                                                            if (nuClient || nuUser) {
                                                                                                                console.log("Ese nombre de usuario ya ha sido registrado, intente con otro");
                                                                                                                res.render('registroClientes', 
                                                                                                                {titulo:'Registro de clientes', 
                                                                                                                enc:'Registro de clientes', 
                                                                                                                desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                                                            }
                                                                                                            else
                                                                                                            {
                                                                                                                if (longitudContrasena!=8) {
                                                                                                                    console.log("La contraseña debe de tener una longitud de 8 letras y numeros");
                                                                                                                    res.render('registroClientes', 
                                                                                                                    {titulo:'Registro de clientes', 
                                                                                                                    enc:'Registro de clientes', 
                                                                                                                    desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                                                                }
                                                                                                                else
                                                                                                                {
                                                                                                                    for (let index = 0; index < ContrasenaV.length; index++) {
                                                                                                                        extraeContrasena=ContrasenaV.charAt(index);
                                                                                                                        console.log(extraeContrasena); 
                                                                                                                        ContrasenaV_letters=numberLetter.indexOf(extraeContrasena);
                                                                                                                        ContrasenaV_character=stringCharacter.indexOf(extraeContrasena);
                                                                                                                        ContrasenaV_numbers=stringNumber.indexOf(extraeContrasena);
                                                                                                                        console.log(ContrasenaV_letters);  
                                                                                                                        console.log(ContrasenaV_character);  
                                                                                                                        console.log(ContrasenaV_numbers);  
                                                                                                                    }
                                                                                                                    if (ContrasenaV_character>=0) {
                                                                                                                        console.log("La contraseña no debe contener caracteres especiales");
                                                                                                                        res.render('registroClientes', 
                                                                                                                        {titulo:'Registro de clientes', 
                                                                                                                        enc:'Registro de clientes', 
                                                                                                                        desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                                                                    }
                                                                                                                        else
                                                                                                                        {
                                                                                                                            const passwordHash = await encrypt(ContrasenaV)
                                                                                                                            const nuevoCliente = await clienteModel.create({
                                                                                                                            Nombre:NombreV,
                                                                                                                            Apellido:ApellidoV,
                                                                                                                            Direccion:DireccionV,
                                                                                                                            Edad:EdadV,
                                                                                                                            Fecha_nacimiento,
                                                                                                                            Telefono:TelefonoV,
                                                                                                                            Correo:CorreoV,
                                                                                                                            Rol,
                                                                                                                            Nombre_usuario:Nombre_usuarioV,
                                                                                                                            Contrasena: passwordHash
                                                                                                                            });

                                                                                                                            await logsClienteModel.create({
                                                                                                                                ID_Cliente: nuevoCliente.ID_Cliente,
                                                                                                                                Rol: "Cliente",
                                                                                                                                Nombre_cliente: nuevoCliente.Nombre,
                                                                                                                                Accion: "Registro",
                                                                                                                                Descripcion: "Se registra nuevo cliente",
                                                                                                                                Fecha_hora: Date.now(),
                                                                                                                                IP: ipAddress
                                                                                                                            })

                                                                                                                            res.render('registroClientes', 
                                                                                                                            {titulo:'Registro de clientes', 
                                                                                                                            enc:'Registro de clientes', 
                                                                                                                            desc:'Complete el siguiente formulario para llevar a cabo su registro'});
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                }
                            }
                        }
                }
            } 
        catch (error) {
        console.error('Error al crear nuevo cliente:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const consultasClientes = async (req, res) => {
    const consultar_Cliente = await clienteModel.findAll();
    console.log(consultar_Cliente);
    res.render('clientesRegistrados',
    {consultar_Cliente,
    titulo:'Clientes registrados', 
    enc:'Clientes registrados'});
}

const actualizacionCliente = (req, res) => {
    const ID_Cliente = req.query.id;
    const Nombre = req.query.nombre;
    const Apellido = req.query.apellido;
    const Direccion = req.query.direccion;
    const Edad = req.query.edad;
    const Fecha_nacimiento = req.query.Fecha_nacimiento;


    res.render('actualizacionClientes',{
        titulo: 'Actualizar clientes',
        ID_Cliente,
        Nombre,
        Apellido,
        Direccion,
        Edad,
        Fecha_nacimiento
    })
};

const actualizarCliente = async (req, res) => {

    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    const clienteId = req.params.id;
    const {Nombre, Apellido, Direccion, Edad, Fecha_nacimiento} = req.body;

    try {
        const cliente = await clienteModel.findByPk(clienteId);
        if (cliente) {

            await cliente.update({
                Nombre,
                Apellido,
                Direccion,
                Edad,
                Fecha_nacimiento
            });

            await logsUsuarioModel.create({
                ID_Usuario: usuarioLogueado.ID_Usuario,
                Rol: usuarioLogueado.Rol,
                Nombre_usuario: usuarioLogueado.Nombre,
                Accion: "Actualización",
                Descripcion: ("Se actualizan datos de cliente : " + clienteId),
                Fecha_hora: Date.now(),
                IP: ipAddress
            })

            res.redirect('/clientesRegistrados');
        } else {
            res.status(404).json({ error: 'No se encontró ningún cliente para actualizar' });
        }
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


const eliminarCliente = async (req, res) => {

    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }
    const valores = req.params.id;

    try {
        const cliente = await clienteModel.findByPk(valores);
        if (!cliente) {
            return res.status(404).send('Cliente no encontrado');
        }

        await cliente.destroy();
        const consultar_Cliente = await clienteModel.findAll();

        await logsUsuarioModel.create({
            ID_Usuario: usuarioLogueado.ID_Usuario,
            Rol: usuarioLogueado.Rol,
            Nombre_usuario: usuarioLogueado.Nombre,
            Accion: "Eliminación",
            Descripcion: ("Se elimina el cliente número: " + valores),
            Fecha_hora: Date.now(),
            IP: ipAddress
        })

        res.render('clientesRegistrados',
            {consultar_Cliente,
            titulo:'Clientes registrados', 
            enc:'Clientes registrados'});
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        res.status(500).send('Error interno del servidor');
    }
};
/*                                           Fin CRUD Clientes                                     */

/*                                           CRUD Productos                                     */
const registroProductos = (req, res)=>{//cada que se ponga la ruta raiz responde el router/para poder usar dicha ruta raiz se debe exportar
    res.render('registroProductos', 
    {titulo:'Registro de productos', 
    enc:'Registro de productos', 
    desc:'Complete el siguiente formulario para llevar a cabo el registro de los productos'});//no pone la ruta al estar cargado el EJS desde views, para que el elemento dentro de las llaves se debe mandar llamar desde el EJS
}

const altasProductos = async (req, res) => {

    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    try 
    {
        const {Nombre_producto, Descripcion, Color, Talla, Material, Marca, Temporada, Precio, Existencias, ID_Proveedor} = req.body;
        const stringCharacter = ["'","-","`","~","!","¡","@","#","$","%","^","&","*","(",")","_","=","-","{","}","[","]","?","<",">",".",",","/","*","-","+",":",";",'"', "´", "°"] ;
        const stringNumber ="0, 1, 2, 3, 4, 5, 6, 7, 8, 9";
        const numberLetter= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let Nombre_productoV;
        let DescripcionV;
        let ColorV;
        let TallaV;
        let MaterialV;
        let MarcaV;
        let TemporadaV;
        let PrecioV;
        let ExistenciasV;
        let ID_ProveedorV;
        Nombre_productoV=Nombre_producto.trim();
        DescripcionV=Descripcion.trim();
        ColorV=Color.trim();
        TallaV=Talla.trim();
        MarcaV=Marca.trim();
        MaterialV=Material.trim();
        TemporadaV=Temporada.trim();
        PrecioV=Precio.trim();
        ExistenciasV=Existencias.trim();
        ID_ProveedorV=ID_Proveedor.trim();
        longitudNombre_producto=Nombre_productoV.length;
        longitudDescripcion=DescripcionV.length;
        longitudColor=ColorV.length;
        longitudTalla=TallaV.length;
        longitudMaterial=MaterialV.length;
        longitudMarca=MarcaV.length;
        longitudTemporada=TemporadaV.length;
        longitudPrecio=PrecioV.length;
        longitudExistencias=ExistenciasV.length;
        longitudID_Proveedor=ID_ProveedorV.length;

        if (Nombre_productoV==="" || DescripcionV==="" || ColorV==="" || TallaV==="" || MaterialV==="" || MarcaV==="" || TemporadaV==="" || PrecioV==="" || ExistenciasV==="" ||ID_ProveedorV==="") {
            console.log("Complete todos los campos");
            res.render('registroProductos',{
            titulo:'Porductos registrados', 
            enc:'Productos registrados'});

        }
        else
        {
            if (longitudNombre_producto>4 || longitudNombre_producto>30) {
                console.log("El nombre del producto debe tener una longitud entre 4 y 30 caracteres");
                res.render('registroProductos',{
                titulo:'Porductos registrados', 
                enc:'Productos registrados'});
            }
            else
            {
                for (let index = 0; index < Nombre_productoV.length; index++) {
                    extraeNombre=NombreV.charAt(index);
                    console.log(extraeNombre); 
                    Nombre_ProductoV_numbers=stringNumber.indexOf(extraeNombre);
                    Nombre_ProductoV_character=stringCharacter.indexOf(extraeNombre);
                    console.log(Nombre_ProductoV_numbers);  
                    console.log(Nombre_ProductoV_character);   
                    }
                if (Nombre_ProductoV_character>=0) {
                    console.log("El nombre del producto no debe contener caracteres");
                    res.render('registroProductos',{
                    titulo:'Porductos registrados', 
                    enc:'Productos registrados'});
                }
                else
                {
                    if (Nombre_ProductoV_numbers>=0) {
                        console.log("El nombre del producto no debe contener numeros");
                        res.render('registroProductos',{
                        titulo:'Porductos registrados', 
                        enc:'Productos registrados'});
                    }
                    else
                    {
                        if (longitudDescripcion<10 || longitudDescripcion>50) {
                            console.log("La descripcion del producto debe tener una longitud entre 10 y 50 caracteres");
                            res.render('registroProductos',{
                            titulo:'Porductos registrados', 
                            enc:'Productos registrados'}); 
                        }
                        else
                        {
                            for (let index = 0; index < DescripcionV.length; index++) {
                                extraeDescripcion=DescripcionV.charAt(index);
                                console.log(extraeDescripcion); 
                                DescripcionV_numbers=stringNumber.indexOf(extraeDescripcion);
                                DescripcionV_character=stringCharacter.indexOf(extraeDescripcion);
                                console.log(DescripcionV_numbers);  
                                console.log(DescripcionV_character);   
                                }
                            if (DescripcionV_numbers>=0) {
                                console.log("La descripcion del producto no debe contener numeros");
                                res.render('registroProductos',{
                                titulo:'Porductos registrados', 
                                enc:'Productos registrados'});
                            }
                            else
                            {
                                if (DescripcionV_character>=0) {
                                    console.log("La descripcion del producto no debe contener caracteres");
                                    res.render('registroProductos',{
                                    titulo:'Porductos registrados', 
                                    enc:'Productos registrados'});  
                                }
                                else
                                {
                                    if (longitudColor<4 || longitudColor>15) {
                                        console.log("La longitud del color debe ser entre 4 y 15 caracteres");
                                        res.render('registroProductos',{
                                        titulo:'Porductos registrados', 
                                        enc:'Productos registrados'});
                                    }
                                    else
                                    {
                                        for (let index = 0; index < ColorV.length; index++) {
                                            extraeColor=ColorV.charAt(index);
                                            console.log(extraeColor); 
                                            ColorV_numbers=stringNumber.indexOf(extraeColor);
                                            ColorV_character=stringCharacter.indexOf(extraeColor);
                                            console.log(ColorV_numbers);  
                                            console.log(ColorV_character);   
                                        }
                                        if (ColorV_numbers>=0) {
                                            console.log("El color no debe contener numeros");
                                            res.render('registroProductos',{
                                            titulo:'Porductos registrados', 
                                            enc:'Productos registrados'});
                                        }
                                        else
                                        {
                                            if (ColorV_character>=0) {
                                                console.log("El color no debe contener caracteres");
                                                res.render('registroProductos',{
                                                titulo:'Porductos registrados', 
                                                enc:'Productos registrados'});
                                            }
                                            else
                                            {
                                                if (longitudTalla<2 || longitudTalla>20) {
                                                    console.log("La talla debe tener una longitud entre 2 y 20 caracteres");
                                                    res.render('registroProductos',{
                                                    titulo:'Porductos registrados', 
                                                    enc:'Productos registrados'});
                                                }
                                                else
                                                {
                                                    for (let index = 0; index < TallaV.length; index++) {
                                                        extraeTalla=TallaV.charAt(index);
                                                        console.log(extraeTalla); 
                                                        TallaV_numbers=stringNumber.indexOf(extraeTalla);
                                                        TallaV_character=stringCharacter.indexOf(extraeTalla);
                                                        console.log(TallaV_numbers);  
                                                        console.log(TallaV_character);   
                                                    }
                                                    if (TallaV_character>=0) {
                                                        console.log("La talla no debe contener caracteres especiales");
                                                        res.render('registroProductos',{
                                                        titulo:'Porductos registrados', 
                                                        enc:'Productos registrados'});
                                                    }
                                                    else
                                                    {
                                                        if (TallaV_numbers>=0) {
                                                            console.log("La talla no debe contener numeros");
                                                            res.render('registroProductos',{
                                                            titulo:'Porductos registrados', 
                                                            enc:'Productos registrados'});
                                                        }
                                                        else
                                                        {
                                                            if (longitudMaterial<5 || longitudMaterial>15) {
                                                                console.log("La longitud del material debe estar ente los 5 y 15 caracteres");
                                                                res.render('registroProductos',{
                                                                titulo:'Porductos registrados', 
                                                                enc:'Productos registrados'});
                                                            }
                                                            else
                                                            {
                                                                for (let index = 0; index < MaterialV.length; index++) {
                                                                    extraeMaterial=MaterialV.charAt(index);
                                                                    console.log(extraeMaterial); 
                                                                    MaterialV_numbers=stringNumber.indexOf(extraeMaterial);
                                                                    MaterialV_character=stringCharacter.indexOf(extraeMaterial);
                                                                    console.log(MaterialV_numbers);  
                                                                    console.log(MaterialV_character);   
                                                                }
                                                                if (MaterialV_numbers>=0) {
                                                                    console.log("El material no debe contener numeros");
                                                                    res.render('registroProductos',{
                                                                    titulo:'Porductos registrados', 
                                                                    enc:'Productos registrados'});
                                                                }
                                                                else
                                                                {
                                                                    if (MaterialV_character>=0) {
                                                                        console.log("El material no debe contener caracteres especiales");
                                                                        res.render('registroProductos',{
                                                                        titulo:'Porductos registrados', 
                                                                        enc:'Productos registrados'});
                                                                    }
                                                                    else
                                                                    {
                                                                        if ( longitudMarca <4 || longitudMarca>25 ) {
                                                                            console.log("La longitud de la marca debe estar ente los 5 y 25 caracteres");
                                                                            res.render('registroProductos',{
                                                                            titulo:'Porductos registrados', 
                                                                            enc:'Productos registrados'});
                                                                        }
                                                                        else
                                                                        {
                                                                            for (let index = 0; index < MarcaV.length; index++) {
                                                                                extraeMarca=MaterialV.charAt(index);
                                                                                console.log(extraeMarca); 
                                                                                MarcaV_numbers=stringNumber.indexOf(extraeMarca);
                                                                                MarcaV_character=stringCharacter.indexOf(extraeMarca);
                                                                                console.log(MarcaV_numbers);  
                                                                                console.log(MarcaV_character);   
                                                                            }
                                                                            if (MarcaV_numbers>=0) {
                                                                                console.log("La marca no debe contener numeros");
                                                                                res.render('registroProductos',{
                                                                                titulo:'Porductos registrados', 
                                                                                enc:'Productos registrados'});
                                                                            }
                                                                            else
                                                                            {
                                                                                if (MarcaV_character>=0) {
                                                                                    console.log("La marca no debe contener caracteres especiales");
                                                                                    res.render('registroProductos',{
                                                                                    titulo:'Porductos registrados', 
                                                                                    enc:'Productos registrados'});
                                                                                }
                                                                                else
                                                                                {
                                                                                    if (longitudTemporada<5 || longitudTemporada>30) {
                                                                                        console.log("La marca debe tener una longitud entre 5 y 30 caracteres");
                                                                                        res.render('registroProductos',{
                                                                                        titulo:'Porductos registrados', 
                                                                                        enc:'Productos registrados'});
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        for (let index = 0; index < TemporadaV.length; index++) {
                                                                                            extraeTemporada=TemporadaV.charAt(index);
                                                                                            console.log(extraeTemporada); 
                                                                                            TemporadaV_numbers=stringNumber.indexOf(extraeTemporada);
                                                                                            TemporadaV_character=stringCharacter.indexOf(extraeTemporada);
                                                                                            console.log(TemporadaV_numbers);  
                                                                                            console.log(TemporadaV_character);   
                                                                                        }
                                                                                        if (TemporadaV_numbers>=0) {
                                                                                            console.log("La temporada no debe contener numeros");
                                                                                        res.render('registroProductos',{
                                                                                        titulo:'Porductos registrados', 
                                                                                        enc:'Productos registrados'});
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            if (TemporadaV_character>=0) {
                                                                                                console.log("La temporada no debe contener caracteres especiales");
                                                                                            res.render('registroProductos',{
                                                                                            titulo:'Porductos registrados', 
                                                                                            enc:'Productos registrados'});
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                if ( longitudPrecio<2 || longitudPrecio>4 ) {
                                                                                                    console.log("El precio debe tener una longitud entre 2 y 4 numeros");
                                                                                                    res.render('registroProductos',{
                                                                                                    titulo:'Porductos registrados', 
                                                                                                    enc:'Productos registrados'});
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    for (let index = 0; index < PrecioV.length; index++) {
                                                                                                        extraePrecio=PrecioV.charAt(index);
                                                                                                        console.log(extraePrecio); 
                                                                                                        TemporadaV_letters= numberLetter.indexOf(extraePrecio);
                                                                                                        TemporadaV_character=stringCharacter.indexOf(extraePrecio);
                                                                                                        console.log(TemporadaV_letters);  
                                                                                                        console.log(TemporadaV_character);   
                                                                                                    }
                                                                                                    if (TemporadaV_letters>=0) {
                                                                                                        console.log("El precio no debe contener letras");
                                                                                                        res.render('registroProductos',{
                                                                                                        titulo:'Porductos registrados', 
                                                                                                        enc:'Productos registrados'});
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        if (TemporadaV_character>=0) {
                                                                                                            console.log("El precio no debe contener caracteres especiales");
                                                                                                            res.render('registroProductos',{
                                                                                                            titulo:'Porductos registrados', 
                                                                                                            enc:'Productos registrados'});
                                                                                                        }
                                                                                                        else
                                                                                                        {
                                                                                                            if ( longitudExistencias<2 || longitudExistencias>3 ) {
                                                                                                                console.log("La longitus de las existencias debe tener entre 2  y 3 numeros");
                                                                                                                res.render('registroProductos',{
                                                                                                                titulo:'Porductos registrados', 
                                                                                                                enc:'Productos registrados'});
                                                                                                            }
                                                                                                            else
                                                                                                            {
                                                                                                                for (let index = 0; index < ExistenciasV.length; index++) {
                                                                                                                    extraeExistencia=ExistenciasV.charAt(index);
                                                                                                                    console.log(extraeExistencia); 
                                                                                                                    ExistenciasV_letters= numberLetter.indexOf(extraeExistencia);
                                                                                                                    ExistenciasV_character=stringCharacter.indexOf(extraeExistencia);
                                                                                                                    console.log(ExistenciasV_letters);  
                                                                                                                    console.log(ExistenciasV_character);   
                                                                                                                }
                                                                                                                if (ExistenciasV_letters>=0) {
                                                                                                                    console.log("Las existencias no debe contener letras");
                                                                                                                    res.render('registroProductos',{
                                                                                                                    titulo:'Porductos registrados', 
                                                                                                                    enc:'Productos registrados'});
                                                                                                                }
                                                                                                                else
                                                                                                                {
                                                                                                                    if (ExistenciasV_character>=0) {
                                                                                                                        console.log("Las existencias no debe contener caracteres especiales");
                                                                                                                        res.render('registroProductos',{
                                                                                                                        titulo:'Porductos registrados', 
                                                                                                                        enc:'Productos registrados'});
                                                                                                                    }
                                                                                                                    else
                                                                                                                    {
                                                                                                                        if (longitudID_Proveedor<2 || longitudID_Proveedor>3) {
                                                                                                                            console.log("La longitud de ID Proveedor debe ser de entre 2 y 3 cifras");
                                                                                                                            res.render('registroProductos',{
                                                                                                                            titulo:'Porductos registrados', 
                                                                                                                            enc:'Productos registrados'});
                                                                                                                        }
                                                                                                                        else
                                                                                                                        {
                                                                                                                            for (let index = 0; index < ID_ProveedorV.length; index++) {
                                                                                                                                extraeID_Proveedor=ID_ProveedorV.charAt(index);
                                                                                                                                console.log(extraeID_Proveedor); 
                                                                                                                                ID_ProveedorV_letters= numberLetter.indexOf(extraeID_Proveedor);
                                                                                                                                ID_ProveedorV_character=stringCharacter.indexOf(extraeID_Proveedor);
                                                                                                                                console.log(ID_ProveedorV_letters);  
                                                                                                                                console.log(ID_ProveedorV_character);   
                                                                                                                            }  
                                                                                                                            if (ID_ProveedorV_letters>=0) {
                                                                                                                                console.log("El ID Proveedor no debe contener letras");
                                                                                                                                res.render('registroProductos',{
                                                                                                                                titulo:'Porductos registrados', 
                                                                                                                                enc:'Productos registrados'});
                                                                                                                            } 
                                                                                                                            else
                                                                                                                            {
                                                                                                                                if (ID_ProveedorV_character>=0) {
                                                                                                                                    console.log("El ID Proveedor no debe contener caracteres especiales");
                                                                                                                                    res.render('registroProductos',{
                                                                                                                                    titulo:'Porductos registrados', 
                                                                                                                                    enc:'Productos registrados'});
                                                                                                                                }
                                                                                                                                else
                                                                                                                                {
                                                                                                                                    const proveedor = await proveedorModel.findByPk(ID_ProveedorV);
                                                                                                                                    if (!proveedor) {
                                                                                                                                        console.log("El ID Proveedor no existe");
                                                                                                                                        res.render('registroProductos',{
                                                                                                                                        titulo:'Porductos registrados', 
                                                                                                                                        enc:'Productos registrados'});
                                                                                                                                    }
                                                                                                                                    else
                                                                                                                                    {
                                                                                                                                        const Precio_publico = Precio*2;
                                                                                                                                        const filepath = req.file.path;

                                                                                                                                        const nuevoProducto = await productosModel.create({
                                                                                                                                            Nombre_producto:Nombre_productoV,
                                                                                                                                            Descripcion:DescripcionV,
                                                                                                                                            Color:ColorV,
                                                                                                                                            Talla:TallaV,
                                                                                                                                            Material:MaterialV,
                                                                                                                                            Marca:MarcaV,
                                                                                                                                            Temporada:TemporadaV,
                                                                                                                                            Precio:PrecioV,
                                                                                                                                            Precio_publico,
                                                                                                                                            Existencias:ExistenciasV,
                                                                                                                                            ID_Proveedor:ID_ProveedorV,
                                                                                                                                            filepath
                                                                                                                                        });

                                                                                                                                        await logsUsuarioModel.create({
                                                                                                                                            ID_Usuario: usuarioLogueado.ID_Usuario,
                                                                                                                                            Rol: usuarioLogueado.Rol,
                                                                                                                                            Nombre_usuario: usuarioLogueado.Nombre,
                                                                                                                                            Accion: "Creación",
                                                                                                                                            Descripcion: ("Se registra nuevo producto del proveedor: " + nuevoProducto.ID_Proveedor),
                                                                                                                                            Fecha_hora: Date.now(),
                                                                                                                                            IP: ipAddress
                                                                                                                                        })

                                                                                                                                        res.render('registroProductos');
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } 
    catch (error) {
        console.error('Error al crear nuevo producto:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const consultasProductos = async (req, res) => {
    const consultar_Productos = await productosModel.findAll();
    console.log(consultar_Productos);
    res.render('productosRegistrados',
    {consultar_Productos,
    titulo:'Productos registrados', 
    enc:'Clientes registrados'});
}

const actualizacionProducto = (req, res) => {
    const ID_Producto = req.query.id;
    const Nombre_producto = req.query.nombre_producto;
    const Descripcion = req.query.descripcion;
    const Color = req.query.color;
    const Talla = req.query.talla;
    const Material = req.query.material;
    const Marca = req.query.marca;
    const Temporada = req.query.temporada;
    const Existencias = req.query.existencias;
    const Precio = req.query.precio;

    res.render('actualizacionProductos',{
        titulo: 'Actualizar productos',
        ID_Producto,
        Nombre_producto,
        Descripcion,
        Color,
        Talla,
        Material,
        Marca,
        Temporada,
        Existencias,
        Precio
    })
};

const actualizarProducto = async (req, res) => {

    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    const productoId = req.params.id;
    const newData = req.body;

    try {
        const producto = await productosModel.findByPk(productoId);

        if (producto) {
            await producto.update(newData);

            await logsUsuarioModel.create({
                ID_Usuario: usuarioLogueado.ID_Usuario,
                Rol: usuarioLogueado.Rol,
                Nombre_usuario: usuarioLogueado.Nombre,
                Accion: "Actualización",
                Descripcion: ("Se actualiza producto con el ID: " + productoId),
                Fecha_hora: Date.now(),
                IP: ipAddress
            })

            res.redirect('/productosRegistrados');
        } else {
            res.status(404).json({ error: 'No se encontró ningún producto para actualizar' });
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const eliminarProducto = async (req, res) => {

    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }
    const valores = req.params.id;

    try {
        const producto = await productosModel.findByPk(valores);
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        await producto.destroy();
        const consultar_Productos = await productosModel.findAll();

        await logsUsuarioModel.create({
            ID_Usuario: usuarioLogueado.ID_Usuario,
            Rol: usuarioLogueado.Rol,
            Nombre_usuario: usuarioLogueado.Nombre,
            Accion: "Eliminación",
            Descripcion: ("Se elimina producto número: " + valores),
            Fecha_hora: Date.now(),
            IP: ipAddress
        })

        res.render('productosRegistrados',
            {consultar_Productos,
            titulo:'Productos registrados', 
            enc:'Productos registrados'});
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).send('Error interno del servidor');
    }
};

/*                                           Fin CRUD Productos                                     */

/*                                           CRUD Proveedores                                     */
const registroProveedores = (req, res)=>{//cada que se ponga la ruta raiz responde el router/para poder usar dicha ruta raiz se debe exportar
    res.render('registroProveedores', 
    {titulo:'Registro de proveedores', 
    enc:'Registro de proveedores', 
    desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});//no pone la ruta al estar cargado el EJS desde views, para que el elemento dentro de las llaves se debe mandar llamar desde el EJS
}

const altasProveedores = async (req, res) => {

    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    try {
        const {Nombre,Apellido,Telefono,Correo, Empresa}=req.body;
        const stringCharacter = ["'","-","`","~","!","¡","@","#","$","%","^","&","*","(",")","_","=","-","{","}","[","]","?","<",">",".",",","/","*","-","+",":",";",'"', "´", "°"] ;
        const stringNumber ="0, 1, 2, 3, 4, 5, 6, 7, 8, 9";
        const stringCharacterD = ["'","-","`","~","!","¡","@","#","$","%","^","&","*","(",")","_","=","-","{","}","[","]","?","<",">",".","/","*","-","+",":",";",'"', "´", "°"] ;
        const stringCharacterC = ["'","-","`","~","!","¡","#","$","%","^","&","*","(",")","=","-","{","}","[","]","?","<",">",",","/","*","-","+",":",";",'"', "´", "°"] ;
        const numberLetter= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        let NombreV;
        let ApellidoV;
        let TelefonoV;
        let CorreoV;
        let EmpresaV;
        NombreV = Nombre.trim();
        ApellidoV = Apellido.trim();
        TelefonoV = Telefono.trim();
        CorreoV = Correo.trim();
        EmpresaV = Empresa.trim();
        longitudNombre=NombreV.length;
        longitudApellido=ApellidoV.length;
        longitudTelefono=TelefonoV.length;
        longitudCorreo=CorreoV.length;
        longitudEmpresa=EmpresaV.length;

        if (NombreV===""|| ApellidoV==="" || TelefonoV==="" || CorreoV==="" || EmpresaV==="") {
            console.log("Comlete todos los campos");
            res.render('registroProveedores', 
            {titulo:'Registro de proveedores', 
            enc:'Registro de proveedores', 
            desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'}); 
        }
        else
        {
            if (longitudNombre<4 || longitudNombre>30) {
                console.log("El nombre solo debe tener una longitud entre 4 y 30 caracteres");
                res.render('registroProveedores', 
                {titulo:'Registro de proveedores', 
                enc:'Registro de proveedores', 
                desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});
            }
            else
            {
                for (let index = 0; index < NombreV.length; index++) {
                    extraeNombre=NombreV.charAt(index);
                    console.log(extraeNombre); 
                    NombreV_numbers=stringNumber.indexOf(extraeNombre);
                    NombreV_character=stringCharacter.indexOf(extraeNombre);
                    console.log(NombreV_numbers);  
                    console.log(NombreV_character);   
                    }
                    if (NombreV_numbers>=0) {
                        console.log("El nombre no debe contener números");
                        res.render('registroProveedores', 
                        {titulo:'Registro de proveedores', 
                        enc:'Registro de proveedores', 
                        desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});
                    }
                    else
                    {
                        if (NombreV_character>=0) {
                            console.log("El nombre no debe contener caractes especiales");
                            res.render('registroProveedores', 
                            {titulo:'Registro de proveedores', 
                            enc:'Registro de proveedores', 
                            desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});
                        }
                        else
                        {
                            if (longitudApellido<4 || longitudApellido>30) {
                                console.log("El apellido solo debe tener una longitud entre 4 y 30 caracteres");
                                res.render('registroProveedores', 
                                {titulo:'Registro de proveedores', 
                                enc:'Registro de proveedores', 
                                desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});
                            }
                            else
                            {
                                for (let index = 0; index < ApellidoV.length; index++) {
                                    extraeApellido=ApellidoV.charAt(index);
                                    console.log(extraeApellido); 
                                    ApellidoV_numbers=stringNumber.indexOf(extraeApellido);
                                    ApellidoV_character=stringCharacter.indexOf(extraeApellido);
                                    console.log(ApellidoV_numbers);  
                                    console.log(ApellidoV_character);   
                                }
                                if (ApellidoV_numbers>=0) {
                                    console.log("El apellido no debe contener numeros");
                                    res.render('registroProveedores', 
                                    {titulo:'Registro de proveedores', 
                                    enc:'Registro de proveedores', 
                                    desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});
                                }
                                else
                                {
                                    if (ApellidoV_character) {
                                        console.log("El apellido no debe contener caracteres especiales");
                                        res.render('registroProveedores', 
                                        {titulo:'Registro de proveedores', 
                                        enc:'Registro de proveedores', 
                                        desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});
                                    }
                                    else
                                    {
                                        if (longitudTelefono!=10) {
                                            console.log("El telefono debe tener una longitud de 10 numeros");
                                            res.render('registroProveedores', 
                                            {titulo:'Registro de proveedores', 
                                            enc:'Registro de proveedores', 
                                            desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});
                                        }
                                        else
                                        {
                                            for (let index = 0; index < TelefonoV.length; index++) {
                                                extraeTelefono=TelefonoV.charAt(index);
                                                console.log(extraeTelefono); 
                                                TelefonoV_letters=numberLetter.indexOf(extraeTelefono);
                                                TelefonoV_character=stringCharacter.indexOf(extraeTelefono);
                                                console.log(EdadV_letters);  
                                                console.log(EdadV_character);   
                                            }
                                            if (TelefonoV_letters>=0) {
                                                console.log("El telefono no debe contener letras");
                                                res.render('registroProveedores', 
                                                {titulo:'Registro de proveedores', 
                                                enc:'Registro de proveedores', 
                                                desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});
                                            }
                                            else
                                            {
                                                if (TelefonoV_character>=0) {
                                                    console.log("El telefono no debe contener caracteres especiales");
                                                    res.render('registroProveedores', 
                                                    {titulo:'Registro de proveedores', 
                                                    enc:'Registro de proveedores', 
                                                    desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});
                                                }
                                                else
                                                {
                                                    if (longitudCorreo<10 || longitudCorreo>30) {
                                                        console.log("El correo debe tener una longitud entre 10 y 30 caracteres");
                                                        res.render('registroProveedores', 
                                                        {titulo:'Registro de proveedores', 
                                                        enc:'Registro de proveedores', 
                                                        desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});
                                                    }
                                                    else
                                                    {
                                                        for (let index = 0; index < CorreoV.length; index++) {
                                                            extraeCorreo=CorreoV.charAt(index);
                                                            console.log(extraeCorreo); 
                                                            CorreoV_character=stringCharacterC.indexOf(extraeCorreo);
                                                            console.log(CorreoV_character);   
                                                        }
                                                        if (CorreoV_character>=0) {
                                                            console.log("El correo no debe contener caracteres especiales");
                                                            res.render('registroProveedores', 
                                                            {titulo:'Registro de proveedores', 
                                                            enc:'Registro de proveedores', 
                                                            desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});
                                                        }
                                                        else
                                                        {
                                                            if (longitudEmpesa<5 || longitudEmpesa>20) {
                                                                console.log("El nombre de la empresa debe tener una longitud entre 5 y 20 caracteres");
                                                                res.render('registroProveedores', 
                                                                {titulo:'Registro de proveedores', 
                                                                enc:'Registro de proveedores', 
                                                                desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});
                                                            }
                                                            else
                                                            {   
                                                                for (let index = 0; index < EmpresaV.length; index++) {
                                                                    extraeEmpresa=EmpresaV.charAt(index);
                                                                    console.log(extraeEmpresa); 
                                                                    EmpresaV_numbers=stringNumber.indexOf(extraeEmpresa);
                                                                    EmpresaV_character=stringCharacter.indexOf(extraeEmpresa);
                                                                    console.log(EmpresaV_numbers);  
                                                                    console.log(EmpresaV_character);   
                                                                }
                                                                if (EmpresaV_numbers>=0) {
                                                                    console.log("El nombre de la empresa no debe contener numeros");
                                                                    res.render('registroProveedores', 
                                                                    {titulo:'Registro de proveedores', 
                                                                    enc:'Registro de proveedores', 
                                                                    desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});
                                                                }
                                                                else
                                                                {
                                                                    if (EmpresaV_character>=0) {
                                                                        console.log("El nombre de la empresa no debe contener caracteres especiales");
                                                                        res.render('registroProveedores', 
                                                                        {titulo:'Registro de proveedores', 
                                                                        enc:'Registro de proveedores', 
                                                                        desc:'Complete el siguiente formulario para llevar a cabo el registro del proveedor'});
                                                                    }
                                                                        const nuevoProveedor = await proveedorModel.create(
                                                                            {
                                                                                Nombre:NombreV,
                                                                                Apellido:ApellidoV,
                                                                                Telefono:TelefonoV, 
                                                                                Correo:CorreoV, 
                                                                                Empresa:EmpresaV
                                                                            }
                                                                        );

                                                                        await logsUsuarioModel.create({
                                                                            ID_Usuario: usuarioLogueado.ID_Usuario,
                                                                            Rol: usuarioLogueado.Rol,
                                                                            Nombre_usuario: usuarioLogueado.Nombre,
                                                                            Accion: "Creación",
                                                                            Descripcion: ("Se registra nuevo proveedor: " + nuevoProveedor.Empresa),
                                                                            Fecha_hora: Date.now(),
                                                                            IP: ipAddress
                                                                        })

                                                                        res.render('registroProveedores');
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
            }
        }
    } 
    catch (error) 
    {
        console.error('Error al crear nuevo proveedor:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const consultasProveedores = async (req, res) => {
    const consultar_Proveedor = await proveedorModel.findAll();
    console.log(consultar_Proveedor);
    res.render('proveedoresRegistrados',
    {consultar_Proveedor,
    titulo:'Proveedores registrados', 
    enc:'Proveedores registrados'});
}

const actualizacionProveedor = (req, res) => {
    const ID_Proveedor = req.query.id;
    const Nombre = req.query.nombre;
    const Apellido = req.query.apellido;
    const Telefono = req.query.telefono;
    const Correo = req.query.correo;
    const Empresa = req.query.empresa;

    res.render('actualizacionProveedores',{
        titulo: 'Actualizar proveedor',
        ID_Proveedor,
        Nombre,
        Apellido,
        Telefono,
        Correo,
        Empresa
    })
};

const actualizarProveedor = async (req, res) => {

    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    const proveedorId = req.params.id;
    const newData = req.body;

    try {
        const proveedor = await proveedorModel.findByPk(proveedorId);

        if (proveedor) {
            await proveedor.update(newData);
            res.redirect('/proveedoresRegistrados');
        } else {

            await logsUsuarioModel.create({
                ID_Usuario: usuarioLogueado.ID_Usuario,
                Rol: usuarioLogueado.Rol,
                Nombre_usuario: usuarioLogueado.Nombre,
                Accion: "Actualización",
                Descripcion: ("Se actualizan datos del proveedor: " + proveedorId),
                Fecha_hora: Date.now(),
                IP: ipAddress
            })

            res.status(404).json({ error: 'No se encontró ningún proveedor para actualizar' });
        }
    } catch (error) {
        console.error('Error al actualizar el proveedor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


const eliminarProveedor = async (req, res) => {

    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }
    const valores = req.params.id;

    try {
        const proveedor = await proveedorModel.findByPk(valores);
        if (!proveedor) {
            return res.status(404).send('Proveedor no encontrado');
        }

        await proveedor.destroy();
        const consultar_Proveedor = await proveedorModel.findAll();

        await logsUsuarioModel.create({
            ID_Usuario: usuarioLogueado.ID_Usuario,
            Rol: usuarioLogueado.Rol,
            Nombre_usuario: usuarioLogueado.Nombre,
            Accion: "Eliminación",
            Descripcion: ("Se elimina el proveedor número: " + valores),
            Fecha_hora: Date.now(),
            IP: ipAddress
        })

        res.render('proveedoresRegistrados',
            {consultar_Proveedor,
            titulo:'Proveedores registrados', 
            enc:'Proveedores registrados'});
    } catch (error) {
        console.error('Error al eliminar el proveedor:', error);
        res.status(500).send('Error interno del servidor');
    }
};
/*                                           Fin CRUD Proveedores                                     */

/*                                                   LOGS                                             */

const logsClientes = async(req, res) => {
    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    const consultar_Logs = await logsClienteModel.findAll();

    res.render('logsClientes', {
        consultar_Logs,
        titulo: "Logs"
    })
}

const logsUsuarios = async(req, res) => {
    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    const consultar_Logs = await logsUsuarioModel.findAll();

    res.render('logsUsuarios', {
        consultar_Logs,
        titulo: "Logs"
    })
}

module.exports = {
    index,
    productos,
    panelNavegacion,
    inicioSesion,
    altasUsuario, 
    registroUsuarios,
    formularioActualizacion,
    actualizarUsuario,
    eliminarUsuario,
    consultasUsuarios,
    registroClientes,
    altasClientes , 
    consultasClientes, 
    actualizacionCliente,
    actualizarCliente,
    eliminarCliente, 
    registroProductos,
    altasProductos, 
    consultasProductos,
    actualizacionProducto, 
    actualizarProducto,
    eliminarProducto, 
    altasProveedores, 
    registroProveedores,
    consultasProveedores, 
    actualizacionProveedor,
    actualizarProveedor,
    eliminarProveedor,
    Login,
    logOut,
    agregarAlCarrito,
    visualizarCarrito,
    eliminarProductoCarrito,
    enviarCarrito,
    crearPedido,
    pedidosEnCurso,
    visualizarPedido,
    actualizacionPedido,
    actualizarPedido,
    cancelarPedido,
    pedidosFinalizados,
    logsClientes,
    logsUsuarios
}