import { Model, DataTypes } from "sequelize";
import sequelize from '../config/database.js';

export class Usuario extends Model {}

Usuario.init(
    {
        idUsuario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sexo:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        fechaNacimiento: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        contraseña: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bio: {
            type: DataTypes.TEXT,
        },
        avatar: {
            type: DataTypes.BLOB,
        },
        esModerador: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: 'Usuario',
        modelName: 'Usuario',
        underscored: true,
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion',
        paranoid: true,
        deletedAt: 'fecha_borrado'
    }
)