import { Model, DataTypes } from "sequelize";
import sequelize from '../config/database.js';

export class Imagen extends Model {}

Imagen.init(
    {
        idImagen: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        foto: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        ancho: {
            type: DataTypes.DOUBLE,
        },
        altura: {
            type: DataTypes.DOUBLE,
        },
        extension: {
            type: DataTypes.STRING,
        },
        licencia: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        marcaDeAgua: {
            type: DataTypes.STRING,
        },
        comentarioClausurado:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }

    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion',
        paranoid: true,
        deletedAt: 'fecha_borrado'
    }
)