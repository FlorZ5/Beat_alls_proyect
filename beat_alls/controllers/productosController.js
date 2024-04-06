const db = require('../config/db.js');
const {Op, sequelize, where} = require('sequelize');
const os = require('os');
const {encrypt, compare} = require('../helpers/handleBcrypt.js');
const productosModel = require('../models/productosModel.js');
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

const registroProductos = async (req, res) => {

    const consultar_Proveedor = await proveedorModel.findAll({
        attributes: ['ID_Proveedor', 'filepath']
    })

    res.render('registroProductos', {
    consultar_Proveedor,
    titulo:'Registro de productos', 
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

        const consultar_Proveedor = await proveedorModel.findAll({
            attributes: ['ID_Proveedor', 'filepath']
        })

        if (Nombre_productoV==="" || DescripcionV==="" || ColorV==="" || TallaV==="" || MaterialV==="" || MarcaV==="" || TemporadaV==="" || PrecioV==="" || ExistenciasV==="" ||ID_ProveedorV==="") {
            console.log("Complete todos los campos");
            res.render('registroProductos',{
            consultar_Proveedor,
            titulo:'Porductos registrados', 
            enc:'Productos registrados'});

        }
        else
        {
            if (longitudNombre_producto<4 || longitudNombre_producto>30) {
                console.log("El nombre del producto debe tener una longitud entre 4 y 30 caracteres");
                res.render('registroProductos',{
                consultar_Proveedor,
                titulo:'Porductos registrados', 
                enc:'Productos registrados'});
            }
            else
            {
                for (let index = 0; index < Nombre_productoV.length; index++) {
                    extraeNombre=Nombre_productoV.charAt(index);
                    console.log(extraeNombre); 
                    Nombre_ProductoV_numbers=stringNumber.indexOf(extraeNombre);
                    Nombre_ProductoV_character=stringCharacter.indexOf(extraeNombre);
                    console.log(Nombre_ProductoV_numbers);  
                    console.log(Nombre_ProductoV_character);   
                    }
                if (Nombre_ProductoV_character>=0) {
                    console.log("El nombre del producto no debe contener caracteres");
                    res.render('registroProductos',{
                    consultar_Proveedor,
                    titulo:'Porductos registrados', 
                    enc:'Productos registrados'});
                }
                else
                {
                    if (Nombre_ProductoV_numbers>=0) {
                        console.log("El nombre del producto no debe contener numeros");
                        res.render('registroProductos',{
                        consultar_Proveedor,
                        titulo:'Porductos registrados', 
                        enc:'Productos registrados'});
                    }
                    else
                    {
                        if (longitudDescripcion<10 || longitudDescripcion>50) {
                            console.log("La descripcion del producto debe tener una longitud entre 10 y 50 caracteres");
                            res.render('registroProductos',{
                            consultar_Proveedor,
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
                                consultar_Proveedor,
                                titulo:'Porductos registrados', 
                                enc:'Productos registrados'});
                            }
                            else
                            {
                                if (DescripcionV_character>=0) {
                                    console.log("La descripcion del producto no debe contener caracteres");
                                    res.render('registroProductos',{
                                    consultar_Proveedor,
                                    titulo:'Porductos registrados', 
                                    enc:'Productos registrados'});  
                                }
                                else
                                {
                                    if (longitudColor<4 || longitudColor>15) {
                                        console.log("La longitud del color debe ser entre 4 y 15 caracteres");
                                        res.render('registroProductos',{
                                        consultar_Proveedor,
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
                                            consultar_Proveedor,
                                            titulo:'Porductos registrados', 
                                            enc:'Productos registrados'});
                                        }
                                        else
                                        {
                                            if (ColorV_character>=0) {
                                                console.log("El color no debe contener caracteres");
                                                res.render('registroProductos',{
                                                consultar_Proveedor,
                                                titulo:'Porductos registrados', 
                                                enc:'Productos registrados'});
                                            }
                                            else
                                            {
                                                if (longitudTalla<2 || longitudTalla>20) {
                                                    console.log("La talla debe tener una longitud entre 2 y 20 caracteres");
                                                    res.render('registroProductos',{
                                                    consultar_Proveedor,
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
                                                        consultar_Proveedor,
                                                        titulo:'Porductos registrados', 
                                                        enc:'Productos registrados'});
                                                    }
                                                    else
                                                    {
                                                        if (TallaV_numbers>=0) {
                                                            console.log("La talla no debe contener numeros");
                                                            res.render('registroProductos',{
                                                            consultar_Proveedor,
                                                            titulo:'Porductos registrados', 
                                                            enc:'Productos registrados'});
                                                        }
                                                        else
                                                        {
                                                            if (longitudMaterial<5 || longitudMaterial>15) {
                                                                console.log("La longitud del material debe estar ente los 5 y 15 caracteres");
                                                                res.render('registroProductos',{
                                                                consultar_Proveedor,
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
                                                                    consultar_Proveedor,
                                                                    titulo:'Porductos registrados', 
                                                                    enc:'Productos registrados'});
                                                                }
                                                                else
                                                                {
                                                                    if (MaterialV_character>=0) {
                                                                        console.log("El material no debe contener caracteres especiales");
                                                                        res.render('registroProductos',{
                                                                        consultar_Proveedor,
                                                                        titulo:'Porductos registrados', 
                                                                        enc:'Productos registrados'});
                                                                    }
                                                                    else
                                                                    {
                                                                        if ( longitudMarca <4 || longitudMarca>25 ) {
                                                                            console.log("La longitud de la marca debe estar ente los 5 y 25 caracteres");
                                                                            res.render('registroProductos',{
                                                                            consultar_Proveedor,
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
                                                                            if (MarcaV_numbers !== 0) {
                                                                                console.log("La marca no debe contener numeros");
                                                                                res.render('registroProductos',{
                                                                                consultar_Proveedor,
                                                                                titulo:'Porductos registrados', 
                                                                                enc:'Productos registrados'});
                                                                            }
                                                                            else
                                                                            {
                                                                                if (MarcaV_character>=0) {
                                                                                    console.log("La marca no debe contener caracteres especiales");
                                                                                    res.render('registroProductos',{
                                                                                    consultar_Proveedor,
                                                                                    titulo:'Porductos registrados', 
                                                                                    enc:'Productos registrados'});
                                                                                }
                                                                                else
                                                                                {
                                                                                    if (longitudTemporada<5 || longitudTemporada>30) {
                                                                                        console.log("La marca debe tener una longitud entre 5 y 30 caracteres");
                                                                                        res.render('registroProductos',{
                                                                                        consultar_Proveedor,
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
                                                                                        consultar_Proveedor,
                                                                                        titulo:'Porductos registrados', 
                                                                                        enc:'Productos registrados'});
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            if (TemporadaV_character>=0) {
                                                                                                console.log("La temporada no debe contener caracteres especiales");
                                                                                            res.render('registroProductos',{
                                                                                            consultar_Proveedor,
                                                                                            titulo:'Porductos registrados', 
                                                                                            enc:'Productos registrados'});
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                if ( longitudPrecio<2 || longitudPrecio>4 ) {
                                                                                                    console.log("El precio debe tener una longitud entre 2 y 4 numeros");
                                                                                                    res.render('registroProductos',{
                                                                                                    consultar_Proveedor,
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
                                                                                                        consultar_Proveedor,
                                                                                                        titulo:'Porductos registrados', 
                                                                                                        enc:'Productos registrados'});
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        if (TemporadaV_character>=0) {
                                                                                                            console.log("El precio no debe contener caracteres especiales");
                                                                                                            res.render('registroProductos',{
                                                                                                            consultar_Proveedor,
                                                                                                            titulo:'Porductos registrados', 
                                                                                                            enc:'Productos registrados'});
                                                                                                        }
                                                                                                        else
                                                                                                        {
                                                                                                            if ( longitudExistencias<1 || longitudExistencias>4 ) {
                                                                                                                console.log("La longitud de las existencias debe tener entre 1  y 4 digitos");
                                                                                                                res.render('registroProductos',{
                                                                                                                consultar_Proveedor,
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
                                                                                                                    consultar_Proveedor,
                                                                                                                    titulo:'Porductos registrados', 
                                                                                                                    enc:'Productos registrados'});
                                                                                                                }
                                                                                                                else
                                                                                                                {
                                                                                                                    if (ExistenciasV_character>=0) {
                                                                                                                        console.log("Las existencias no debe contener caracteres especiales");
                                                                                                                        res.render('registroProductos',{
                                                                                                                        consultar_Proveedor,
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
                                                                                                                                consultar_Proveedor,
                                                                                                                                titulo:'Porductos registrados', 
                                                                                                                                enc:'Productos registrados'});
                                                                                                                            } 
                                                                                                                            else
                                                                                                                            {
                                                                                                                                if (ID_ProveedorV_character>=0) {
                                                                                                                                    console.log("El ID Proveedor no debe contener caracteres especiales");
                                                                                                                                    res.render('registroProductos',{
                                                                                                                                    consultar_Proveedor,
                                                                                                                                    titulo:'Porductos registrados', 
                                                                                                                                    enc:'Productos registrados'});
                                                                                                                                }
                                                                                                                                else
                                                                                                                                {
                                                                                                                                    const proveedor = await proveedorModel.findByPk(ID_ProveedorV);
                                                                                                                                    if (!proveedor) {
                                                                                                                                        console.log("El ID Proveedor no existe");
                                                                                                                                        res.render('registroProductos',{
                                                                                                                                        consultar_Proveedor,
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


                                                                                                                                        res.render('registroProductos', {
                                                                                                                                            consultar_Proveedor
                                                                                                                                        });
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

module.exports = {
    registroProductos,
    altasProductos, 
    consultasProductos,
    actualizacionProducto, 
    actualizarProducto,
    eliminarProducto
}