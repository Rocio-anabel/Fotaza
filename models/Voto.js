import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export class Voto extends Model{}

Voto.init(
    {
        idVoto: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        valor: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize,
        underscored: true,
        tableName: 'Voto',
        modelName: 'Voto',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion',
        paranoid: true,
        deletedAt: 'fecha_borrado',
        indexes: [
            {
                unique: true,
                fields: ['id_usuario', 'id_imagen'] 
            }
        ]
    }
)