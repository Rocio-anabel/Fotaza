import { Model, DataTypes } from "sequelize";
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

export class Usuario extends Model {
    validatePassword(password){
        return bcrypt.compare(password, this.contraseña)
  }
}

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
        deletedAt: 'fecha_borrado',
        hooks:{
            beforeSave: async (usuario) => {
                if(!usuario.contraseña) return;
                if(!usuario.changed('contraseña')) return;
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(usuario.contraseña, salt)
                usuario.contraseña = hashedPassword;

            }
        }
    }
)