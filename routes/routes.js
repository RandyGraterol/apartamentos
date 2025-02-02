const express = require('express');
const upload = require('../utils/multer.js');

const verify = require('../middleware/verify.js');

const { index,ejecutivo_II,viewAdmin,gestion_de_pagos,bienvenidos,perfilUsuario,sugerencias,loginPost,crearGet,crearPost,recovery,recoveryPost,restablecerPasswordPost,dashboar,usUarios,restablecer,updateGet,updatePost,deleteUsuario,adminPagos,aPartamentos,crearApartamentoPost,crearPagoPost,repor,crearReporte,fActuras,crearFactura,descargarPDF,pagar} = require('../controllers/controllers.js');

const routes = express.Router();

// Rutas
routes.get('/', index);
routes.get('/bienvenidos',verify,bienvenidos);
routes.get('/gestionPagos',verify, gestion_de_pagos);
routes.get('/perfilUsuario',verify, perfilUsuario);
routes.get('/sugerencias',verify, sugerencias);
routes.get('/viewAdmin',verify, viewAdmin);
routes.get('/ejecutivo_II',verify, ejecutivo_II);
routes.get('/recovery',verify,recovery);
routes.get('/dashboar',verify,dashboar);
routes.get('/usuarios',verify,usUarios);
routes.get('/apartamentos',verify,aPartamentos);
routes.get('/adminPagos',verify,adminPagos);
routes.get('/reportes',verify,repor);
routes.get('/facturas',verify,fActuras);
routes.get('/restablecer',verify,restablecer);
routes.get('/updateUsuarioGet/:id/:tabla',verify,updateGet);
routes.get('/descargarPDF/:id',verify,descargarPDF);
routes.get('/pagar',verify,pagar);
//////////////////////////////////////////////////////////
//metodo post
routes.post('/loginPost',loginPost);

routes.post('/crearUsuarioPost',upload.single('imgPerfil'),crearPost);
routes.post('/crearApartamentoPost',crearApartamentoPost);
routes.post('/crearPagoPost/:id',upload.single('comprobante'),crearPagoPost);
routes.post('/crearReporte/:role',crearReporte);
routes.post('/crearFactura',crearFactura);

routes.post('/recoveryPost',recoveryPost);
routes.post('/restablecerPasswordPost',restablecerPasswordPost);
routes.post('/updatePost/:id/:tabla',upload.single('comprobante'),updatePost);
/////////////////////////////////////////////////////////
//borrar
routes.get('/deleteUsuario/:id/:tabla',deleteUsuario);

module.exports = routes;