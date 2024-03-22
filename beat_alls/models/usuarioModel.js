const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db.js');

const usuarioModel = db.define('usuario', {
    ID_Usuario:{
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
        type: DataTypes.STRING,
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
    Rol:{
        type: DataTypes.STRING,
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
}, {
    tableName: 'usuario',
    timestamps: false
});

module.exports = usuarioModel;