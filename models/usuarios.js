const { DataTypes } = require('sequelize');
const sequelize = require('../config/conexion.js');

const Usuarios = sequelize.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    telefono: {
        type: DataTypes.INTEGER(15),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    imgPerfil: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: '/img/default.png'
    },
    apartamentoId: {
        type: DataTypes.INTEGER, // Cambiado a INTEGER para que coincida con el modelo de Apartamentos
        allowNull: false,
        references: {
            model: 'apartamentos',
            key: 'id'
        }
    },
    deudaActual: {
        type: DataTypes.INTEGER(20),
        allowNull: true,
        defaultValue: 'Sin deuda actual'
    },
    deudaPendiente: {
        type: DataTypes.INTEGER(20),
        allowNull: true,
        defaultValue: 'Sin deuda pendiente'
    }
}, { timestamps: true });

module.exports = Usuarios;