#  Fotaza

**Fotaza** es una plataforma web orientada a la publicación, exploración y comercialización de fotografías. Los usuarios pueden compartir sus imágenes, interactuar con otros y valorar el contenido publicado dentro de la comunidad.

---

## 🛠 Tecnologías y Librerías Utilizadas

| Librería            | Descripción                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| **bcrypt**          | Encriptación segura de contraseñas.                                                |
| **bootstrap**       | Framework CSS utilizado para el diseño visual y componentes de la interfaz.        |
| **dotenv**          | Gestión de variables de entorno.                                                   |
| **express**         | Framework para el desarrollo del servidor web.                                     |
| **express-session** | Administración de sesiones de usuario.                                             |
| **multer**          | Procesamiento y almacenamiento de imágenes enviadas mediante formularios.          |
| **pg**              | Conexión y manejo de la base de datos PostgreSQL 17.5.                             |
| **pg-hstore**       | Serialización de datos para Sequelize y PostgreSQL.                                |
| **pug**             | Motor de plantillas utilizado para renderizar vistas desde el servidor.            |
| **sequelize**       | ORM utilizado para la gestión de modelos y consultas a la base de datos.           |
| **sharp**           | Procesamiento de imágenes, extracción de metadatos y aplicación de marcas de agua. |
| **zod**             | Validación de datos mediante esquemas tipados.                                     |

---

## 🔗 Endpoints Principales

| Método     | Ruta               | Descripción                                                               |
| ---------- | ------------------ | ------------------------------------------------------------------------- |
| GET        | `/home`            | Muestra el feed principal correspondiente a la sesión actual del usuario. |
| GET        | `/publicacion/:id` | Muestra una publicación específica según su identificador.                |
| GET        | `/publicacion/crear` | Renderiza la vista para la creación de una nueva publicación.           |
| POST       | `/publicacion`     | Crea una nueva publicación.                                               |
| POST       | `/buscar`          | Busca publicaciones que coincidan con el texto ingresado por el usuario.  |
| POST       | `/seguir`          | Crea o elimina el seguimiento de un usuario.                              |
| POST       | `/comentario`      | Crea un nuevo comentario.                                                 |
| POST       | `/voto`            | Registra o actualiza la valoración de una imagen.                         |
| GET        | `/perfil/:id`      | Muestra el perfil de un usuario.                                          |
| GET / POST | `/auth/*`          | Rutas relacionadas con autenticación y gestión de sesiones.               |


## 📖 Guía de Uso

### Registro de Usuario

1. Desde la página principal (**Index**), haga clic en **Registrarse**.
2. Complete el formulario de registro.
3. Los campos obligatorios son:

   * Nombre
   * Apellido
   * Correo electrónico
   * Contraseña
   * Fecha de nacimiento
   * Sexo
4. Presione **Crear Cuenta**.

### Inicio de Sesión

1. Desde la página principal (**Index**), haga clic en **Iniciar Sesión**.
2. Ingrese su correo electrónico y contraseña.
3. Presione **Ingresar**.

### Crear una Publicación

1. Desde la página **Home**, haga clic en el botón **+** ubicado en la esquina inferior derecha.
2. Complete el formulario de publicación.
3. Los campos obligatorios son:

   * Título
   * Imágenes
   * Etiquetas
4. Presione **Publicar**.

### Buscar una Publicación

1. Ingrese el texto de búsqueda en la barra de navegación.
2. Presione el botón **Buscar**.
3. Seleccione la publicación deseada para acceder a su contenido completo.

### Seguir a un Usuario

1. Desde una publicación o desde el inicio, acceda al perfil del usuario haciendo clic sobre su nombre o avatar.
2. Presione el botón **Seguir**.
3. Actualice la página para visualizar los cambios en la cantidad de seguidores.

### Valorar una Imagen

1. Desde una publicación, haga clic sobre la cantidad de estrellas deseada.
2. Actualice la página para visualizar la valoración actualizada.

### Comentar una Imagen

1. Abra la sección de comentarios de la publicación.
2. Escriba su comentario.
3. Presione **Publicar**.

### Cerrar Sesión

1. Haga clic sobre su avatar en la barra de navegación.
2. Seleccione **Cerrar Sesión**.

---

## 👤 Usuarios de Prueba

### Usuario 1

**Correo:** `lucia.martinez@mail.com`
**Contraseña:** `lucia95`

### Usuario 2

**Correo:** `martin.acosta@mail.com`
**Contraseña:** `martin90`

### Usuario 3

**Correo:** `valentina.cardozo@mail.com`
**Contraseña:** `valen2000`

---

## ⚠️ Aclaraciones

- Las acciones de **seguir usuarios** y **valorar imágenes** no se actualizan en tiempo real. Actualmente es necesario refrescar la página para visualizar los cambios.
- La página principal (**Index**) contiene imágenes de demostración cargadas manualmente. En futuras versiones se mostrarán fotografías reales almacenadas en la plataforma.
- El sistema de notificaciones utiliza datos de ejemplo. Próximamente se integrará con las notificaciones reales generadas por la actividad de los usuarios.
- Los botones **"Me interesa"**, **"Denunciar"** y **"Guardar"** aún no poseen funcionalidad implementada. Estas características serán incorporadas en futuras versiones.
- Salvo la opción **Cerrar Sesión**, las demás acciones disponibles en el menú de usuario de la barra de navegación aún no se encuentran implementadas.
- El proyecto se encuentra en desarrollo y algunas funcionalidades pueden sufrir modificaciones en futuras versiones.
