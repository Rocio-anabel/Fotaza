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
    foreignKey: 'idUsuario',
    otherKey: 'idSeguidor',
    as: 'seguidores'
});

Usuario.belongsTo(Usuario, {
    through: UsuarioSeguidor,
    foreignKey:'idSeguidor',
    otherKey: 'idUsuario',
    as: 'seguidos'
});

Usuario.hasMany(Publicacion);
Publicacion.belongsTo(Usuario);

Publicacion.hasMany(Imagen);
Imagen.belongsTo(Publicacion);

Publicacion.hasMany(Etiqueta);
Etiqueta.belongsTo(Publicacion);

Usuario.hasMany(Voto);
Voto.belongsTo(Usuario);

Imagen.hasMany(Voto);
Voto.belongsTo(Imagen);

Usuario.hasMany(Comentario);
Comentario.belongsTo(Usuario);

Imagen.hasMany(Comentario);
Comentario.belongsTo(Imagen);
