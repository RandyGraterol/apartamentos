const { DataTypes } = require('sequelize');
const sequelize = require('../config/conexion.js');

const Pagos = sequelize.define('pagos', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 'Sin codigo de referencia.'
    },
    comentario: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    comprobante: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'Sin comprobante.'
    },
    usuarioId: {
        type: DataTypes.INTEGER, // Cambiado a INTEGER para que coincida con el modelo de Usuarios
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    }
}, { timestamps: true });

module.exports = Pagos;