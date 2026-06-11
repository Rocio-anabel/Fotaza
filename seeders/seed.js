import sequelize from '../config/database.js';
import {Usuario} from '../models/Usuario.js';
import bcrypt from 'bcrypt';

const usuarios = [
            {nombre: 'Lucía', apellido: 'Martinez', sexo: 'femenino', fechaNacimiento: '1995-03-22', email: 'lucia.fernandez@mail.com', contraseña: 'lucia1995'},
            {nombre: 'Martín', apellido: 'Acosta', sexo: 'masculino', fechaNacimiento: '1990-07-15', email: 'martin.rodriguez@mail.com', contraseña: 'martin90'},
            {nombre: 'Valentina', apellido: 'Cardozo', sexo: 'femenino', fechaNacimiento: '2000-11-08', email: 'valentina.gomez@mail.com', contraseña: 'valen2000'}
        ]

async function seed() {
    try {
        await sequelize.sync({ alter: true });
        const usuariosHasheados = await Promise.all(
            usuarios.map(async (u) => ({
                  ...u,
                  contraseña: await bcrypt.hash(u.contraseña, 10),
                }))
        );
        await Usuario.bulkCreate(usuariosHasheados);
    } catch (error) {
        console.error('Error en seed:', error);
    } finally {
        sequelize.close()
    }
}

seed()