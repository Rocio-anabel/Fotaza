import { Usuario } from "../models/Usuario.js";


export const renderizarLogin = (req, res) => {

    if(req.session.user){
        return res.redirect('/');
    }

    res.render('login');

}

export const login = async (req, res) => {

    try {
        
        const { email, password } = req.body;
        const mail = email.trim();
        const pass = password.trim();

        if(!mail || !pass ){
            /*res.status(400).render('auth/login', {
            alert: {
                    status: "error",
                    text: "Complete todos los campos"
                    },
            formValues: req.body
            }) */
            return
        } 

        const user = await Usuario.findOne({
          where: {
            email: mail
          }
        });
        if(!user){
          /*res.status(400).render('auth/login', {
            alert: {
              status: "error",
              text: "Usuario o contrasena incorrecta."
            },
            formValues: req.body
          })*/
          return;
        }

        const isValidated = await user.validatePassword(pass);

        if(!isValidated){
          /*res.status(400).render('auth/login', {
            alert: {
              status: "error",
              text: "Usuario o contrasena incorrecta."
            },
            formValues: req.body
          })*/
          return;
        }
    
        req.session.user = {
          id: user.idUsuario,
        };

        res.redirect('/home');
        
    } catch (error) {

        console.log('Error al inicar sesion: ', error);
        res.status(500).json({message: 'Ha ocurrido un error al iniciar sesión'});
    }

}

export const renderizarSignup = (req, res) => {
    if(req.session.user){
        return res.redirect('/');
    }

    res.render('signup');
}

export const registrarse = async (req, res) => {
    try {
        const {nombre, apellido, email, password, fechaNacimiento, sexo, bio} = req.body;

        let avatar;

        if (req.file) {
            avatar = req.file.buffer;
        }

        const user = await Usuario.create(
            {
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                email: email.trim(),
                contraseña: password,
                fechaNacimiento: fechaNacimiento,
                sexo: sexo,
                bio: bio,
                avatar: avatar
            }
        )
        req.session.user = {
            id: user.idUsuario,
        };

        res.redirect('/home');
    } catch (error) {
        console.error('Error al registrar un usuario: ', error);
        res.status(500).json({message: 'Error al registrar un usuario'});
    }
}

export const logout = async (req, res) => {
     if(req.session){
        await req.session.destroy();
        res.redirect('/auth/login');
        return;
  }
}