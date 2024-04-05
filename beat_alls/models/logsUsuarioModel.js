const {Sequelize, DataTypes, STRING}  = require('sequelize'); //trae el squelize
const db = require('../config/db.js');//trae la conexion con la bd

const logsUsuarioModel = db.define('logs_usuario', {
    ID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    ID_Usuario:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Rol:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Nombre_usuario:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Accion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Descripcion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Fecha_hora:{
        type: DataTypes.DATE,
        allowNull: false
    },
    IP:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, 
{
    tableName: 'logs_usuario',
    timestamps: false
}
)
module.exports = logsUsuarioModel;