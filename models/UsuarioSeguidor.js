import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export class UsuarioSeguidor extends Model {}

UsuarioSeguidor.init(
    {
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {model: "Usuario", key: "id_usuario"},
        },
        idSeguidor: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "Usuario", key: "id_usuario"}
        }
    },
    {
        sequelize,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["id_usuario", "id_seguidor"]
            }
        ],
        timestamps: true,
        tableName: 'Usuario_Seguidor',
        modelName: 'UsuarioSeguidor',
        createdAt: "fecha_creacion",
        updatedAt: false,
        paranoid: true,
        deletedAt: "fecha_borrado"
    }
)