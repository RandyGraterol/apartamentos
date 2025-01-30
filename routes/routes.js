const express = require('express');
const upload = require('../utils/multer.js');
const { index,ejecutivo_II,viewAdmin,gestion_de_pagos,bienvenidos,perfilUsuario,sugerencias,loginPost,crearGet,crearPost,recovery,recoveryPost,restablecerPasswordPost,dashboar,usUarios,restablecer,updateUsuarioGet,updateUsuarioPost,deleteUsuario} = require('../controllers/controllers.js');

const routes = express.Router();

// Rutas
routes.get('/', index);
routes.get('/bienvenidos', bienvenidos);
routes.get('/gestionPagos', gestion_de_pagos);
routes.get('/perfilUsuario', perfilUsuario);
routes.get('/sugerencias', sugerencias);
routes.get('/viewAdmin', viewAdmin);
routes.get('/ejecutivo_II', ejecutivo_II);
routes.get('/recovery',recovery);
routes.get('/dashboar',dashboar);
routes.get('/usuarios',usUarios);
routes.get('/restablecer',restablecer);
routes.get('/updateUsuarioGet/:id',updateUsuarioGet);
//////////////////////////////////////////////////////////
//metodo post
routes.post('/loginPost',loginPost);
routes.post('/crearUsuarioPost',upload.single('imgPerfil'),crearPost);
routes.post('/recoveryPost',recoveryPost);
routes.post('/restablecerPasswordPost',restablecerPasswordPost);
routes.post('/updateUsuarioPost/:id',upload.single('imgPerfil'),updateUsuarioPost);
/////////////////////////////////////////////////////////
//borrar
routes.get('/deleteUsuario/:id',deleteUsuario);

module.exports = routes;