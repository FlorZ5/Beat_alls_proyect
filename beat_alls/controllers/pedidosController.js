const db = require('../config/db.js');
const {Op, sequelize, where} = require('sequelize');
const os = require('os');
const {encrypt, compare} = require('../helpers/handleBcrypt.js');
const productosModel = require('../models/productosModel.js');
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
            const productoDB = await productosModel.findByPk(producto.ID_Producto);
            if (!productoDB) {
                return res.status(400).json({ error: 'El producto no existe' });
            }
            if (productoDB.Existencias < producto.Cantidad_producto) {
                return res.status(400).json({ error: `No hay suficiente stock para el producto ${producto.Nombre_producto}` });
            }
        
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
        
            await productosModel.update({
                Existencias: productoDB.Existencias - producto.Cantidad_producto
            }, {
                where: {
                    ID_Producto: producto.ID_Producto
                }
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

const cancelarPedido = async (req, res) => {
    const usuarioLogueado = req.session.cliente;
    const NumPedido = req.params.id;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    try {
        const idCliente = usuarioLogueado.ID_Cliente;

        // Obtener los productos asociados al pedido
        const pedidos = await pedidosModel.findAll({
            where: {
                ID_Cliente: idCliente,
                No_pedido: NumPedido
            },
            attributes: ['No_pedido', 'ID_Cliente', 'Nombre_cliente', 'ID_Producto', 'Nombre_producto', 'Descripcion', 'Cantidad_producto', 'Precio_unitario_producto', 'Precio_total_productos', 'Ubicacion', 'Fecha', 'Estatus']
        });

        // Incrementar las existencias de cada producto cancelado en la tabla de productos
        for (const pedido of pedidos) {
            await productosModel.increment('Existencias', {
                by: pedido.Cantidad_producto,
                where: {
                    ID_Producto: pedido.ID_Producto
                }
            });
        }

        // Eliminar los registros del pedido cancelado de la tabla de pedidos
        await pedidosModel.destroy({
            where: {
                No_pedido: NumPedido
            }
        });

        // Registro en el historial de cancelación
        for (const pedido of pedidos) {
            await historialModel.create({
                No_pedido: pedido.No_pedido,
                ID_Cliente: usuarioLogueado.ID_Cliente,
                Nombre_cliente: usuarioLogueado.Nombre,
                ID_Producto: pedido.ID_Producto,
                Nombre_producto: pedido.Nombre_producto,
                Descripcion: pedido.Descripcion,
                Cantidad_producto: pedido.Cantidad_producto,
                Precio_unitario_producto: pedido.Precio_unitario_producto,
                Precio_total_productos: pedido.Precio_total_productos,
                Cantidad_pagar: pedido.Precio_total_productos,
                Fecha: pedido.Fecha,
                Estatus: 'Cancelado',
                motivo_Cancelacion: 'Cancelaste este pedido'
            });
        }

        // Registro en los logs
        const pedidoCancelado = `Se cancela el pedido número ${NumPedido} por parte del cliente`;
        await logsClienteModel.create({
            ID_Cliente: idCliente,
            Rol: usuarioLogueado.Rol,
            Nombre_cliente: usuarioLogueado.Nombre,
            Accion: 'Cancelación',
            Descripcion: pedidoCancelado,
            Fecha_hora: Date.now(),
            IP: ipAddress
        });

        // Obtener los pedidos actualizados para renderizar la vista
        const consultar_Pedidos = await pedidosModel.findAll({
            where: {
                ID_Cliente: idCliente
            },
            attributes: ['No_pedido', 'ID_Cliente', 'Nombre_cliente', 'ID_Producto', 'Nombre_producto', 'Descripcion', 'Cantidad_producto', 'Precio_unitario_producto', 'Precio_total_productos', 'Ubicacion', 'Fecha', 'Estatus']
        });

        // Calcular la cantidad a pagar por pedido
        const cantidadPagarPorPedido = {};
        consultar_Pedidos.forEach(pedido => {
            if (!cantidadPagarPorPedido[pedido.No_pedido]) {
                cantidadPagarPorPedido[pedido.No_pedido] = 0;
            }
            cantidadPagarPorPedido[pedido.No_pedido] += pedido.Precio_total_productos;
        });

        // Renderizar la vista con los pedidos actualizados
        res.render('pedidoCliente', {
            cantidadPagarPorPedido,
            consultar_Pedidos,
            titulo: 'Mis pedidos',
            enc: 'Mis pedidos'
        });
    } catch (error) {
        console.error('Error al cancelar el pedido:', error);
        res.status(500).send('Error interno del servidor');
    }
};


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

module.exports = {
    crearPedido,
    pedidosEnCurso,
    visualizarPedido,
    actualizacionPedido,
    actualizarPedido,
    cancelarPedido,
    pedidosFinalizados
}