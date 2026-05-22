import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export class UsuarioSeguidor extends Model {}

UsuarioSeguidor.init(
    {
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {model: "Usuario", key: "idUsuario"},
        },
        idSeguidor: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "Usuario", key: "idUsuario"}
        }
    },
    {
        sequelize,
        underscored:true,
        indexes: [
            {
                unique: true,
                fields: ["idUsuario", "idSeguidor"]
            }
        ],
        timestamps: true,
        createdAt: "fecha_creacion",
        updatedAt: false,
        paranoid: true,
        deletedAt: "fecha_borrado"
    }
)