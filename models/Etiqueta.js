import { Model, DataTypes } from "sequelize";
import sequelize from '../config/database.js';

export class Etiqueta extends Model {}

Etiqueta.init(
    {
        idEtiqueta: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombreEtiqueta:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        underscored: true,
        tableName: 'Etiqueta',
        modelName: 'Etiqueta',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: false,
        paranoid: true,
        deletedAt: 'fecha_borrado'
    }
)
