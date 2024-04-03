const db = require('../config/db.js');
const {Op, sequelize, where} = require('sequelize');
const {encrypt, compare} = require('../helpers/handleBcrypt.js');
const usuarioModel = require('../models/usuarioModel.js');
const clienteModel = require('../models/clienteModel.js');
const productosModel = require('../models/productosModel.js');
const proveedorModel = require('../models/proveedorModel.js');
const carritoModel = require('../models/carritoModel.js');
const pedidosModel = require('../models/pedidosModel.js');
const historialModel = require('../models/historialModel.js');



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

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }
    const idCliente = usuarioLogueado.ID_Cliente;
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
        const {Nombre, Apellido, Direccion, Edad, Fecha_nacimiento, Telefono, Correo, Rol, Nombre_usuario, Contrasena} = req.body


        const passwordHash = await encrypt(Contrasena)
        const nuevoUsuario = await usuarioModel.create({
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

        console.log('Nuevo usuario creado:', nuevoUsuario.toJSON());
        res.render('registroUsuarios',{
            titulo:'Usuarios registrados', 
            enc:'Usuarios registrados'});
    } catch (error) {
        console.error('Error al crear nuevo usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};


/*Controlador para actualización de usuarios*/
const actualizarUsuario = async (req, res) => {
    const userId = req.params.id;
    const {Nombre, Apellido, Direccion, Edad, Fecha_nacimiento, Telefono, Correo, Rol, Nombre_usuario, Contrasena} = req.body

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
            console.log('Usuario actualizado:', usuario.toJSON());
            res.redirect('/usuariosRegistrados'); // Redirigir a la página de usuarios después de actualizar
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
    const valores = req.params.id;

    try {
        const user = await usuarioModel.findByPk(valores);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        await user.destroy();
        const consultar_User = await usuarioModel.findAll();

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

        console.log('Nuevo cliente creado:', nuevoCliente.toJSON());
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
    const clienteId = req.params.id;
    const {Nombre, Apellido, Direccion, Edad, Fecha_nacimiento, Telefono, Correo, Nombre_usuario, Contrasena} = req.body;

    try {
        // Buscar el usuario existente
        const cliente = await clienteModel.findByPk(clienteId);
        const passwordHash = await encrypt(Contrasena)
        if (cliente) {
            // Actualizar los campos del usuario con los nuevos datos
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
            console.log('Cliente actualizado:', cliente.toJSON());
            res.redirect('/clientesRegistrados'); // Redirigir a la página de usuarios después de actualizar
        } else {
            res.status(404).json({ error: 'No se encontró ningún cliente para actualizar' });
        }
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const eliminarCliente = async (req, res) => {
    const valores = req.params.id;

    try {
        const cliente = await clienteModel.findByPk(valores);
        if (!cliente) {
            return res.status(404).send('Cliente no encontrado');
        }

        await cliente.destroy();
        const consultar_Cliente = await clienteModel.findAll();

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

        console.log('Nuevo producto creado:', nuevoProducto.toJSON());
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
    const productoId = req.params.id;
    console.log(productoId);
    const newData = req.body;

    try {
        // Buscar el usuario existente
        const producto = await productosModel.findByPk(productoId);

        if (producto) {
            // Actualizar los campos del usuario con los nuevos datos
            await producto.update(newData);
            console.log('Producto actualizado:', producto.toJSON());
            res.redirect('/productosRegistrados'); // Redirigir a la página de usuarios después de actualizar
        } else {
            res.status(404).json({ error: 'No se encontró ningún producto para actualizar' });
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const eliminarProducto = async (req, res) => {
    const valores = req.params.id;

    try {
        const producto = await productosModel.findByPk(valores);
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        await producto.destroy();
        const consultar_Productos = await productosModel.findAll();

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
    try {
        const datosProveedor = {
            Nombre: req.body.Nombre,
            Apellido: req.body.Apellido,
            Telefono: req.body.Telefono,
            Correo: req.body.Correo,
            Empresa: req.body.Empresa
        };

        const nuevoProveedor = await proveedorModel.create(datosProveedor);

        console.log('Nuevo proveedor registrado:', nuevoProveedor.toJSON());
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
    const proveedorId = req.params.id;
    console.log(proveedorId);
    const newData = req.body;

    try {
        // Buscar el usuario existente
        const proveedor = await proveedorModel.findByPk(proveedorId);

        if (proveedor) {
            // Actualizar los campos del usuario con los nuevos datos
            await proveedor.update(newData);
            console.log('Proveedor actualizado:', proveedor.toJSON());
            res.redirect('/proveedoresRegistrados'); // Redirigir a la página de usuarios después de actualizar
        } else {
            res.status(404).json({ error: 'No se encontró ningún proveedor para actualizar' });
        }
    } catch (error) {
        console.error('Error al actualizar el proveedor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


const eliminarProveedor = async (req, res) => {
    const valores = req.params.id;

    try {
        const proveedor = await proveedorModel.findByPk(valores);
        if (!proveedor) {
            return res.status(404).send('Proveedor no encontrado');
        }

        await proveedor.destroy();
        const consultar_Proveedor = await proveedorModel.findAll();

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
    pedidosFinalizados
}