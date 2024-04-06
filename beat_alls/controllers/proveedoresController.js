const db = require('../config/db.js');
const {Op, sequelize, where} = require('sequelize');
const os = require('os');
const {encrypt, compare} = require('../helpers/handleBcrypt.js');
const proveedorModel = require('../models/proveedorModel.js');
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
                                    if (ApellidoV_character>=0) {
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
                                                            if (longitudEmpresa<3 || longitudEmpresa>20) {
                                                                console.log("El nombre de la empresa debe tener una longitud entre  y 20 caracteres");
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

                                                                        const filepath = req.file.path;
                                                                        const nuevoProveedor = await proveedorModel.create(
                                                                            {
                                                                                Nombre:NombreV,
                                                                                Apellido:ApellidoV,
                                                                                Telefono:TelefonoV, 
                                                                                Correo:CorreoV, 
                                                                                Empresa:EmpresaV,
                                                                                filepath
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

module.exports = {
    altasProveedores, 
    registroProveedores,
    consultasProveedores, 
    actualizacionProveedor,
    actualizarProveedor,
    eliminarProveedor
}