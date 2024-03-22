const {Sequelize, DataTypes}  = require('sequelize'); //trae el squelize
const db = require('../config/db.js');//trae la conexion con la bd

const productosModel = db.define('productos', {
    ID_Producto:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    Nombre_producto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Descripcion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Color:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Talla:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Material:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Marca:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Temporada:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Existencias:{
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    Precio:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    Precio_publico:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    ID_Proveedor:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
},
{
    tableName: 'productos',
    timestamps: false
}
)

module.exports = productosModel;