import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

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
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Usuario', key: 'idUsuario'},
        },
        idImagen: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {model: 'Imagen', key: 'idImagen'},
        }
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion',
        paranoid: true,
        deletedAt: 'fecha_borrado',
        indexes: [
            {
                unique: true,
                fields: ['idUsuario', 'idImagen'] 
            }
        ]
    }
)