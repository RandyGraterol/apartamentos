const { DataTypes } = require('sequelize');
const sequelize = require('../config/conexion.js');

const Facturas = sequelize.define('facturas', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    usuarioId: {
        type: DataTypes.INTEGER, // Cambiado a INTEGER para que coincida con el modelo de Usuarios
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    pagoId: {
        type: DataTypes.INTEGER, // Cambiado a INTEGER para que coincida con el modelo de Pagos
        allowNull: false,
        references: {
            model: 'pagos',
            key: 'id'
        }
    },
    apartamentoId: {
        type: DataTypes.INTEGER, // Cambiado a INTEGER para que coincida con el modelo de Apartamentos
        allowNull: false,
        references: {
            model: 'apartamentos',
            key: 'id'
        }
    }
}, { timestamps: true });

module.exports = Facturas;