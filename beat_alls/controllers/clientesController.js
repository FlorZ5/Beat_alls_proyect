const db = require('../config/db.js');
const {Op, sequelize, where} = require('sequelize');
const os = require('os');
const {encrypt, compare} = require('../helpers/handleBcrypt.js');
const usuarioModel = require('../models/usuarioModel.js');
const clienteModel = require('../models/clienteModel.js');
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

module.exports = {
    registroClientes,
    altasClientes , 
    consultasClientes, 
    actualizacionCliente,
    actualizarCliente,
    eliminarCliente
}