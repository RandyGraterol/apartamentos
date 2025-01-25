import express from 'express';
import routes from './routes/routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servicio de Archivos Estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Config del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', routes);

// Middleware de manejo de Errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Ocurrió un error en el servidor');
});

// Encender el Server
app.listen(port, () => {
    console.log(`El Servidor Está Corriendo en "http://localhost:${port}"`);
});