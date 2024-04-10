const db = require('../config/db.js');
const {Op, sequelize, where} = require('sequelize');
const os = require('os');
const escapeHtml = require('escape-html');
const {encrypt, compare} = require('../helpers/handleBcrypt.js');
const usuarioModel = require('../models/usuarioModel.js');
const clienteModel = require('../models/clienteModel.js');
const productosModel = require('../models/productosModel.js');
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

const reestablecerContra = async (req, res) => {

    res.render('reestablecerContra', {
                titulo: "Reestablecer contraseña"
    });
}

const passChange = async (req, res) => {
    const { pregunta, Contrasena } = req.body;

    try {
        const stringCharacter = ["'","-","`","~","!","¡","@","#","$","%","^","&","","(",")","_","=","-","{","}","[","]","?","<",">",".",",","/","","-","+",":",";",'"', "´", "°"] ;
        let ContrasenaV = Contrasena;
        longitudContrasena=ContrasenaV.length;

        for (let index = 0; index < ContrasenaV.length; index++) {
            extraeContrasena=ContrasenaV.charAt(index);
            console.log(extraeContrasena); 
            ContrasenaV_character=stringCharacter.indexOf(extraeContrasena);
            console.log(ContrasenaV_character);  
        }
        if (ContrasenaV_character>=0) {
            console.log("La contraseña no debe contener caracteres especiales");
            res.render('registroUsuarios',{
            titulo:'Usuarios registrados', 
            enc:'Usuarios registrados'});
        }
        if (longitudContrasena!=8) {
            console.log("La contraseña debe de tener una longitud de 8 letras y numeros");
            res.render('registroUsuarios',{
            titulo:'Usuarios registrados', 
            enc:'Usuarios registrados'});
        }

        const usuario = await usuarioModel.findOne({ where: { Nombre_usuario: pregunta } });
        if (usuario) {
            const passwordHash = await encrypt(Contrasena);
            await usuario.update({ Contrasena: passwordHash });
            return res.render('login', {
                titulo: "Login",
                enc: "Inicia Sesión"
            });
        }

        const cliente = await clienteModel.findOne({ where: { Nombre_usuario: pregunta } });
        if (cliente) {
            const passwordHash = await encrypt(Contrasena);
            await cliente.update({ Contrasena: passwordHash });
            return res.render('login', {
                titulo: "Login",
                enc: "Inicia Sesión"
            });
        }

        return res.send('No se encontró ningún usuario o cliente con ese nombre de usuario.');
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).send('Error interno del servidor');
    }
};


const inicioSesion = async (req, res) => {
    try {
        const { Login, Contrasena } = req.body;


        const nombreEscapado = escapeHtml(Login);
        const contraEscapado = escapeHtml(Contrasena);


        const usuario = await usuarioModel.findOne({ where: { 
            [Op.or]: [{Nombre_usuario: nombreEscapado}, {Correo: nombreEscapado}] 
        }});

        const cliente = await clienteModel.findOne({ where: {
            [Op.or]: [{Nombre_usuario: nombreEscapado}, {Correo: nombreEscapado}]
        }});


        if (!usuario && !cliente) {
            return res.render('login',{
                title:"Error",
                alertMessag:'Usuario no encontrado',
                icon:"warning"
            });
            
        }          

        if (usuario) {
            const validarContraUsuario = await compare(contraEscapado, usuario.Contrasena);
            if(!validarContraUsuario)
            {
                return res.render('login',{
                    title:"Error",
                    alertMessag:'Contraseña Incorrecta',
                    icon:"warning"
                });
            }
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
            const validarContraCliente = await compare(contraEscapado, cliente.Contrasena);
            if(!validarContraCliente)
            {
                return res.render('login',{
                    title:"Error",
                    alertMessag:'Contraseña Incorrecta',
                    icon:"warning"
                });
            }
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
    Login,
    logOut,
    reestablecerContra,
    passChange,
    logsClientes,
    logsUsuarios
}