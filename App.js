const express = require('express');
const routes = require('./routes/routes.js');
const sequelize = require('./config/conexion.js');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3500;

// Servicio de Archivos Estáticos
app.use(express.static(path.join(__dirname, 'public')));

//configuracion de sesion y proteccion de rutas
app.use(session({
    secret: 'mi_secreto_seguir',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      maxAge: 1000 * 60 * 60 * 2
    }
}));

// Config del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/', routes);

// Middleware de manejo de Errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Ocurrió un error en el servidor');
});

// Probar la conexión
sequelize.sync({force:false})
    .then(() => {
        console.log('Base de datos y tablas creadas correctamente.');
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error al crear la base de datos:', error);
    });