import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import { connectDatabase } from './models/index.js';

import publicacionRouter from './routes/publicacionRouter.js';
import authRouter from './routes/authRouter.js';
import busquedaRouter from './routes/busquedaRouter.js'
import votoRouter from './routes/votoRouter.js'
import comentarioRouter from './routes/comentarioRouter.js'
import perfilRouter from './routes/perfilRouter.js';
import seguirRouter from './routes/seguirRouter.js';
import homeRouter from './routes/homeRouter.js';


const app = express();

const PORT = process.env.PORT;


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index');
});


app.use('/publicacion', publicacionRouter);

app.use('/auth', authRouter);

app.use('/buscar', busquedaRouter)

app.use('/comentario', comentarioRouter);

app.use('/voto', votoRouter);

app.use('/perfil', perfilRouter);

app.use('/seguir', seguirRouter);

app.use('/home', homeRouter);

connectDatabase()
    .then( () => {
        app.listen(PORT, (error) => {
            if(error) {
                console.error('Error al iniciar el servidor: ', error);
                return;
            }
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch( (error) => {
        console.error('Error sincronizando con la base de datos:', error);
    });

