import sequelize from '../config/database.js';
import { Usuario } from './Usuario.js';
import { UsuarioSeguidor } from './UsuarioSeguidor.js';
import { Publicacion } from './Publicacion.js';
import { Imagen } from './Imagen.js';
import { Etiqueta } from './Etiqueta.js';
import { Voto } from './Voto.js';
import { Comentario } from './Comentario.js';



Usuario.belongsToMany(Usuario, {
    through: UsuarioSeguidor,
    foreignKey: 'id_usuario',
    otherKey: 'id_seguidor',
    as: 'seguidores'
});

Usuario.belongsTo(Usuario, {
    through: UsuarioSeguidor,
    foreignKey:'id_seguidor',
    otherKey: 'id_usuario',
    as: 'seguidos'
});

Usuario.hasMany(Publicacion, {foreignKey: 'id_usuario'});
Publicacion.belongsTo(Usuario, {foreignKey: 'id_usuario'});

Publicacion.hasMany(Imagen, {foreignKey: 'id_publicacion'});
Imagen.belongsTo(Publicacion, {foreignKey: 'id_publicacion'});

Publicacion.hasMany(Etiqueta, {foreignKey: 'id_publicacion'});
Etiqueta.belongsTo(Publicacion, {foreignKey: 'id_publicacion'});

Usuario.hasMany(Voto, {foreignKey: 'id_usuario'});
Voto.belongsTo(Usuario, {foreignKey: 'id_usuario'});

Imagen.hasMany(Voto, {foreignKey: 'id_imagen'});
Voto.belongsTo(Imagen, {foreignKey: 'id_imagen'});

Usuario.hasMany(Comentario, {foreignKey: 'id_usuario'});
Comentario.belongsTo(Usuario, {foreignKey: 'id_usuario'});

Imagen.hasMany(Comentario, {foreignKey: 'id_imagen'});
Comentario.belongsTo(Imagen, {foreignKey: 'id_imagen'});

export async function connectDatabase() {
  try {
    await sequelize.authenticate(); 
    console.log('Conexion a base de datos establecida')

    await sequelize.sync({ alter: true });
    console.log('Sincronizacion de base de datos')
  } catch (error) {
    console.error('Error en la conexion a la base de datos', error)
    throw error
  }
}