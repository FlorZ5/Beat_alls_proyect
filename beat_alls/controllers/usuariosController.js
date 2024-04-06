const db = require('../config/db.js');
const {Op, sequelize, where} = require('sequelize');
const os = require('os');
const {encrypt, compare} = require('../helpers/handleBcrypt.js');
const usuarioModel = require('../models/usuarioModel.js');
const clienteModel = require('../models/clienteModel.js');
const logsUsuarioModel = require('../models/logsUsuarioModel.js');

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

module.exports = {
    altasUsuario, 
    registroUsuarios,
    formularioActualizacion,
    actualizarUsuario,
    eliminarUsuario,
    consultasUsuarios
}