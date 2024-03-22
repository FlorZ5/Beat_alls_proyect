const {Sequelize, DataTypes}  = require('sequelize'); //trae el squelize
const db = require('../config/db.js');//trae la conexion con la bd

const clienteModel = db.define('cliente', {//usuarios corresponde a la tabala con la que se va a trabajar
    ID_Cliente:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    Nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Apellido:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Direccion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Edad:{
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    Fecha_nacimiento:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Telefono:{
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false
    },
    Correo:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    Nombre_usuario: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    Contrasena:{
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    tableName: 'cliente',
    timestamps: false
}
);

module.exports = clienteModel;