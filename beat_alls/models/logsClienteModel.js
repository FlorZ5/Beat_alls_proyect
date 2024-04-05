const {Sequelize, DataTypes, STRING}  = require('sequelize'); //trae el squelize
const db = require('../config/db.js');//trae la conexion con la bd

const logsClienteModel = db.define('logs_cliente', {
    ID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    ID_Cliente:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Rol:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Nombre_cliente:{
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
    tableName: 'logs_cliente',
    timestamps: false
}
)
module.exports = logsClienteModel;