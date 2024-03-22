const {Sequelize, DataTypes}  = require('sequelize'); //trae el squelize
const db = require('../config/db.js');//trae la conexion con la bd

const pedidosModel = db.define('pedidos', {
    No_pedido:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_Cliente:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Nombre_cliente:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ID_Producto:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Nombre_producto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Descripcion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Cantidad_producto:{
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    Precio_unitario_producto:{
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    Precio_total_productos:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Cantidad_pagar:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Ubicacion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Fecha:{
        type: DataTypes.DATE,
        allowNull: true
    },
    Estatus:{
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    tableName: 'pedidos',
    timestamps: false
}
)

module.exports = usuarioModel;