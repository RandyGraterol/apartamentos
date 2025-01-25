import express from 'express';
import { index,ejecutivo_II,viewAdmin,gestion_de_pagos,bienvenidos,perfilUsuario,sugerencias } from '../controllers/controllers.js';
const routes = express.Router();

// Rutas
routes.get('/', index);
routes.get('/bienvenidos', bienvenidos);
routes.get('/gestionPagos', gestion_de_pagos);
routes.get('/perfilUsuario', perfilUsuario);
routes.get('/sugerencias', sugerencias);
routes.get('/viewAdmin', viewAdmin);
routes.get('/ejecutivo_II', ejecutivo_II);

export default routes;