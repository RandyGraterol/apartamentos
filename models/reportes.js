const { DataTypes } = require('sequelize');
const sequelize = require('../config/conexion.js');

const Reportes = sequelize.define('reportes', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    apartamentoId: { // Cambiado de 'apartamento' a 'apartamentoId'
        type: DataTypes.INTEGER, // Cambiado a INTEGER para que coincida con el modelo de Apartamentos
        allowNull: false,
        references: {
            model: 'apartamentos',
            key: 'id'
        }
    },
    telefono: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    motivos: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
}, { timestamps: true });

module.exports = Reportes;