import { Usuario } from "../models/Usuario.js";
import { usuarioSchema } from "../schemas/usuarioSchema.js";
import { loginSchema } from "../schemas/loginSchema.js";


export const renderizarLogin = (req, res) => {

    if(req.session.user){
        return res.redirect('/');
    }

    res.render('login', {errors: [], data: {}});

}

export const login = async (req, res) => {

    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
          return res.status(400).render('login', {
            errors: result.error.flatten().fieldErrors,
            data: req.body
          });
        }
        const { email, password } = req.body;
        const mail = email.trim();
        const pass = password.trim();

        const user = await Usuario.findOne({
          where: {
            email: mail
          }
        });
        if(!user){
          res.status(400).render('login', {
            errors: { email: [], password: ['Email o contraseña incorrecta'] }, data: req.body
          })
          return;
        }

        const isValidated = await user.validatePassword(pass);

        if(!isValidated){
          res.status(400).render('login', {
            errors: { email: [], password: ['Email o contraseña incorrecta'] }, data: req.body
          })
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

    res.render('signup', {errors: [], data: {}});
}

export const registrarse = async (req, res) => {
    try {
        
        const bodyResult = usuarioSchema.safeParse(req.body);

        if (!bodyResult.success) {
          
          const errors = bodyResult.error.flatten().fieldErrors;

          return res.render('signup', { errors, data: req.body });
        }

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