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

const logOut = (req, res) => {
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
        const ultimaInsercion = await pedidosModel.findAll({
            order: [['Fecha', 'DESC']],
            limit: 1,
            attributes: ['No_pedido']
        });

        if (ultimaInsercion.length > 0) {
            const ultimoNoPedido = ultimaInsercion[0].No_pedido;   

        for (const producto of carrito) {
            await pedidosModel.create({
                No_pedido: ultimoNoPedido + 1,
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
    } else {
        const primerNoPedido = 1;
    for (const producto of carrito) {
        await pedidosModel.create({
            No_pedido: primerNoPedido,
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
    }

        await carritoModel.destroy({
            where: {
                ID_Cliente: idCliente,
            }
        });

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
    const Telefono = req.query.telefono;
    const Correo = req.query.correo;
    const Rol = req.query.rol;
    const Nombre_usuario = req.query.nombreUsuario;
    const Contrasena = req.query.contrasena;

    res.render('formularioActualizacion',{
        titulo: 'Actualizar usuarios',
        ID_Usuario,
        Nombre,
        Apellido,
        Direccion,
        Edad,
        Fecha_nacimiento,
        Telefono,
        Correo,
        Rol,
        Nombre_usuario,
        Contrasena
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
    const {Nombre, Apellido, Direccion, Edad, Fecha_nacimiento, Telefono, Correo, Rol, Nombre_usuario, Contrasena} = req.body;

    try {
        const usuario = await usuarioModel.findByPk(userId);

        if (usuario) {
            const passwordHash = await encrypt(Contrasena)
            await usuario.update({
                Nombre,
                Apellido,
                Direccion,
                Edad,
                Fecha_nacimiento,
                Telefono,
                Correo,
                Rol,
                Nombre_usuario,
                Contrasena: passwordHash
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

    const {Nombre, Apellido, Direccion, Edad, Fecha_nacimiento, Telefono, Correo, Rol, Nombre_usuario, Contrasena} = req.body


        const passwordHash = await encrypt(Contrasena)
        const nuevoCliente = await clienteModel.create({
            Nombre,
            Apellido,
            Direccion,
            Edad,
            Fecha_nacimiento,
            Telefono,
            Correo,
            Rol,
            Nombre_usuario,
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

        res.render('registroClientes');
    } catch (error) {
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
    const Fecha_nacimiento = req.query.fechaNacimiento;
    const Telefono = req.query.telefono;
    const Correo = req.query.correo;
    const Nombre_usuario = req.query.nombreUsuario;
    const Contrasena = req.query.contrasena;

    res.render('actualizacionClientes',{
        titulo: 'Actualizar clientes',
        ID_Cliente,
        Nombre,
        Apellido,
        Direccion,
        Edad,
        Fecha_nacimiento,
        Telefono,
        Correo,
        Nombre_usuario,
        Contrasena
    })
};

const actualizarCliente = async (req, res) => {

    const usuarioLogueado = req.session.usuario;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    const clienteId = req.params.id;
    const {Nombre, Apellido, Direccion, Edad, Fecha_nacimiento, Telefono, Correo, Nombre_usuario, Contrasena} = req.body;

    try {
        const cliente = await clienteModel.findByPk(clienteId);
        const passwordHash = await encrypt(Contrasena)
        if (cliente) {

            await cliente.update({
                Nombre,
                Apellido,
                Direccion,
                Edad,
                Fecha_nacimiento,
                Telefono,
                Correo,
                Nombre_usuario,
                Contrasena: passwordHash
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

    try {
        const {Nombre_producto, Descripcion, Color, Talla, Material, Marca, Temporada, Precio, Existencias, ID_Proveedor} = req.body;
        const Precio_publico = Precio*2;
        const filepath = req.file.path;

        const nuevoProducto = await productosModel.create({
            Nombre_producto,
            Descripcion,
            Color,
            Talla,
            Material,
            Marca,
            Temporada,
            Precio,
            Precio_publico,
            Existencias,
            ID_Proveedor,
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
    } catch (error) {
        console.error('Error al crear nuevo prodcuto:', error);
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
        const datosProveedor = {
            Nombre: req.body.Nombre,
            Apellido: req.body.Apellido,
            Telefono: req.body.Telefono,
            Correo: req.body.Correo,
            Empresa: req.body.Empresa
        };

        const nuevoProveedor = await proveedorModel.create(datosProveedor);

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
    } catch (error) {
        console.error('Error al crear nuevo proveddor:', error);
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