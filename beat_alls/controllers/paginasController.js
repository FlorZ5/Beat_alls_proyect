const db = require('../config/db.js');
const {Op, sequelize, where} = require('sequelize');
const {encrypt, compare} = require('../helpers/handleBcrypt.js');
const upload = require('../app.js');
const usuarioModel = require('../models/usuarioModel.js');
const clienteModel = require('../models/clienteModel.js');
const productosModel = require('../models/productosModel.js');
const proveedorModel = require('../models/proveedorModel.js');
const { use } = require('../routes/rutas.js');



const productos = async (req, res) => {
        consultar_Productos = await productosModel.findAll();

        res.render('productos', {
            consultar_Productos,
            titulo: "Tienda",
            enc: "Productos"
        })
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
                enc: "Inicia sesión"
            });
        }          

        if (usuario) {
            const validarContraUsuario = await compare(Contrasena, usuario.Contrasena);
            const header = './layout/headerAdministrador.ejs';
            if (validarContraUsuario) {
                if(usuario.dataValues.Rol == "Administrador")
                {
                const consultar_Proveedor = await proveedorModel.findAll();
                req.session.userRole = 'Administrador';
                res.render('proveedoresRegistrados', {
                    header,
                    consultar_Proveedor,
                    titulo: "Registro de proveedores",
                    enc: "Proveedores registrados",
                });
            }

                if(usuario.dataValues.Rol == "Empleado")
                {
                    const header = './layout/header.ejs';
                    const consultar_User = await usuarioModel.findAll();
                    req.session.userRole = 'Empleado';
                    res.render('usuariosRegistrados', {
                    header,
                    consultar_User,
                    titulo: "Registro de usuarios",
                    enc: "Usuarios registrados",
                });
                }
            }
        }

        if (cliente) {
            const validarContraCliente = await compare(Contrasena, cliente.Contrasena);
                if (validarContraCliente) {
                    const header = './layout/header.ejs';
                    req.session.userRole = 'Cliente';
                            res.render('productos', {
                                header,
                                titulo: "Página principal",
                                enc: "Productos",
                            });
                        }
                    }

        res.render('login', {
            titulo: "Login",
            enc: "Inicia sesión"
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error interno del servidor');
    }
};

/*                                           Fin de controladores generales                                     */
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
        // Buscar el usuario existente
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
        const consultar_Cliente = await usuarioModel.findAll();

        res.render('clientesRegistrados',
            {consultar_Cliente,
            titulo:'Clientes registrados', 
            enc:'Clientes registrados'});
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

/*Controlador para consula de usuarios*/
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
        const consultar_Cliente = await usuarioModel.findAll();

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
        const Precio_publico = Precio*1.36;
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
    titulo:'proveedores registrados', 
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
    productos,
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
    Login
}
