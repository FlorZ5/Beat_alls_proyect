const db = require('../config/db.js');
const {Op, sequelize, where} = require('sequelize');
const os = require('os');
const {encrypt, compare} = require('../helpers/handleBcrypt.js');
const productosModel = require('../models/productosModel.js');
const carritoModel = require('../models/carritoModel.js');
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

const agregarAlCarrito = async (req, res) => {
    const usuarioLogueado = req.session.cliente;

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    const idCliente = usuarioLogueado.ID_Cliente;
    const idProducto = req.body.ID_Producto;
    let cantidadPiezas = parseInt(req.body.cantidadPiezas) || 1;

    const producto = await productosModel.findByPk(idProducto);
        const stockDisponible = producto.Existencias;

        if (cantidadPiezas > stockDisponible) {
            return res.status(400).json({ error: 'No hay suficiente stock para agregar la cantidad deseada al carrito' });
        }

    let carritoProducto = await carritoModel.findOne({
        where: {
            ID_Cliente: idCliente,
            ID_Producto: idProducto
        }
    });

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

    if (!usuarioLogueado) {
        return res.redirect('/login');
    }

    const idCliente = usuarioLogueado.ID_Cliente;

    const consultar_Carrito = await carritoModel.findAll({ where: { ID_Cliente: idCliente } });

    if (consultar_Carrito.length === 0) {
        return res.redirect('/productos');
    }

    const totalPagar = consultar_Carrito.reduce((total, carrito) => total + carrito.Precio_total_productos, 0);

    res.render('crearPedido', {
        totalPagar,
        consultar_Carrito,
        titulo: "Pedido generado",
        enc: "Tu pedido"
    });
};

module.exports = {
    agregarAlCarrito,
    visualizarCarrito,
    eliminarProductoCarrito,
    enviarCarrito
}