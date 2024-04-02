const {Sequelize, DataTypes}  = require('sequelize');
const db = require('../config/db.js');

const historialModel = db.define('historial', {
    Entrada:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    No_pedido:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false
    },
    ID_Cliente:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false
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
    Fecha:{
        type: DataTypes.DATE,
        allowNull: true
    },
    Estatus:{
        type: DataTypes.STRING,
        allowNull: false
    },
    motivo_Cancelacion:{
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    tableName: 'historial',
    timestamps: false
}
)

module.exports = historialModel;