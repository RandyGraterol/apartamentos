const { DataTypes } = require('sequelize');
const sequelize = require('../config/conexion.js');

const Apartamentos = sequelize.define('apartamentos', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    piso:{
        type: DataTypes.STRING(10),
        allowNull: false
    },
    edificio: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    apartamento:{
        type: DataTypes.STRING(10),
        allowNull: false
    },
     usuarioId: {
        type: DataTypes.INTEGER, // Cambiado a INTEGER para que coincida con el modelo de Apartamentos
        allowNull: true,
        defaultValue:'Sin usuario',
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    status:{
        type:DataTypes.STRING(7),
        allowNull:true,
        defaultValue:'false'
    }
}, { timestamps:false});

module.exports = Apartamentos;