const nodemailer= require('nodemailer');
/////////////////////////////////////////////////////////
const transporter = nodemailer.createTransport({
  service:'Gmail',
  auth:{
    user:'globaldorado78@gmail.com',
    pass:'fauthesukyadpjmv'
}
});
//tablas
const apartamentos = require('../models/apartamentos.js');
const facturas = require('../models/facturas.js');
const pagos = require('../models/pagos.js');
const reportes = require('../models/reportes.js');
const usuarios = require('../models/usuarios.js');

// Definir relaciones
usuarios.hasMany(facturas, { foreignKey: 'usuarioId' });
facturas.belongsTo(usuarios, { foreignKey: 'usuarioId' });

apartamentos.hasMany(facturas, { foreignKey: 'apartamentoId' });
facturas.belongsTo(apartamentos, { foreignKey: 'apartamentoId' });

usuarios.hasMany(pagos, { foreignKey: 'usuarioId' });
pagos.belongsTo(usuarios, { foreignKey: 'usuarioId' });

pagos.hasMany(facturas, { foreignKey: 'pagoId' });
facturas.belongsTo(pagos, { foreignKey: 'pagoId' });

apartamentos.hasMany(usuarios, { foreignKey: 'apartamentoId' });
usuarios.belongsTo(apartamentos, { foreignKey: 'apartamentoId' });

apartamentos.hasMany(reportes, { foreignKey: 'apartamentoId' }); // Cambiado de 'apartamento' a 'apartamentoId'
reportes.belongsTo(apartamentos, { foreignKey: 'apartamentoId' }); // Cambiado de 'apartamento' a 'apartamentoId'



const index = (req,res)=>{
    try{
        res.render('index');
    }catch{
        console.error(e.message);
    };
}
const bienvenidos = (req,res)=>{
    try{
        res.render('bienvenido');
    }catch{
        console.error(e.message);
    };
}
const ejecutivo_II = (req,res)=>{
    try{
        res.render('ejecutivo_II');
    }catch{
        console.error(e.message);
    };
}
const perfilUsuario = (req,res)=>{
    try{
        res.render('perfilUsuario');
    }catch{
        console.error(e.message);
    };
}
const gestion_de_pagos = (req,res)=>{
    try{
        res.render('gestionpagos');
    }catch{
        console.error(e.message);
    };
}
const viewAdmin = (req,res)=>{
    try{
        res.render('viewAdmin');
    }catch{
        console.error(e.message);
    };
}
const sugerencias = (req,res)=>{
    try{
        res.render('sugerencias');
    }catch{
        console.error(e.message);
    };
}
/////////////////////////////////////////////////////////////////
const loginPost = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const data = await usuarios.findOne({where:{email,password}});
        if(data){
            req.session.isAdmin =true;// Establecer propiedad en la sesión
            req.session.id = data.id;
            res.json({status:true});
        }else{
            res.json({status:false});
        }
    }catch(error){
        console.error(error.message);
        res.status(500).json({status:'X',error:error.message});
    }
}
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
const crearPost = async(req,res)=>{
    try{
        const {nombre,email,telefono,password,apartamentoId,deudaActual,deudaPendiente} = req.body;
        let portada;
        if (req.file){
      // Si se sube una imagen
            portada = `/uploads/${req.file.filename}`;
            await usuarios.create({nombre,email,telefono,password,imgPerfil:portada,apartamentoId,deudaActual,deudaPendiente});
        }
        res.redirect('/usuarios');
    }catch(error){
        console.error(error.message);
        res.status(500).json({error:error.message});
    }
}
    /////////////////////////////////////////////////////////////
const recovery = (req,res)=>{
   try{
      res.render('recoveryPassword');
  }catch{
   console.error(error.message);
   res.status(500).json({error:error.message});
}
}
////////////////////////////////////////////////////////////////
const recoveryPost = async(req,res)=>{
    try{
        let id;
        const email = req.body.email;

        const data = await usuarios.findOne({where:{email}});
        if(data){
            req.session.idSesion = data.id;
            console.log(`id del session ${req.session.id}`);
            const mensaje = {
              from:'globaldorado78@gmail.com',
              to:email,
              subject:'¡Restablecer Contraseña!',
              text:`http://localhost:3500/restablecer`
          }
          transporter.sendMail(mensaje,(error,info)=>{
             if(error){
               console.log(error.message);
           }else{
              console.log(`Enlace de recuperación de password enviado ${info.response}`);
          }
      })
          res.json({status:true});
      }else{
          res.json({status:false}); 
      }
  }catch(error){
     console.error(error.message);
     res.status(500).json({status:'X',error:error.message});
 }
}

////////////////////////////////////////////////////////////////
const restablecerPasswordPost = async(req,res)=>{
 try{
    const id = req.session.idSesion;
    const {password} = req.body;
    console.log(`datos provenientes del cliente ${id} ${password}`);
    await usuarios.update({password},{where:{id}}); 
    res.json({status:true});
}catch(error){
   console.error(error.message);
   res.status(500).json({status:false,error:error.message});
}
}
////////////////////////////////////////////////////////////////
const dashboar = async(req,res)=>{
    try{
     const data = await apartamentos.findAll();
     const users = await usuarios.findAll();
     res.render('admin',{data,users});
 }catch(error){
     console.error(error.message);
     res.status(500).json({status:false,error:error.message});
 }
}
////////////////////////////////////////////////////////////////
const usUarios = async(req,res)=>{
    try{
        const data = await apartamentos.findAll();
        const users = await usuarios.findAll();
        res.render('usuarios',{data,users});
    }catch(error){
     console.error(error.message);
     res.status(500).json({status:false,error:error.message});
 }
}
///////////////////////////////////////////////////////////////
const restablecer  = (req,res)=>{
    try{
        const id = req.session.idSesion;
        console.log(`ID DE LA SESION :${id}`);
        res.render('restablecer');
    }catch(error){
     console.error(error.message);
     res.status(500).json({status:false,error:error.message});
 }
}
////////////////////////////////////////////////////////////////
const updateUsuarioGet = async(req,res)=>{
    try{
        const id = req.params.id;
        const users = await usuarios.findOne({where:{id}});
        const data = await apartamentos.findAll();
        res.render('./formularios/update',{users,data});
    }catch(error){
      console.error(error.message);
      res.status(500).json({status:false,error:error.message});
  }
}
////////////////////////////////////////////////////////////////
const updateUsuarioPost = async(req,res)=>{
    try{
       const id = req.params.id;
       const {nombre,email,telefono,password,apartamentoId,deudaActual,deudaPendiente} = req.body;
       let portada;
       if (req.file){
      // Si se sube una imagen
        portada = `/uploads/${req.file.filename}`;
        await usuarios.update({nombre,email,telefono,password,imgPerfil:portada,apartamentoId,deudaActual,deudaPendiente},{where:{id}});
    }
    res.redirect('/usuarios');
}catch(error){
  console.error(error.message);
  res.status(500).json({status:false,error:error.message});
}
}
////////////////////////////////////////////////////////////////
const deleteUsuario =async(req,res)=>{
    try{
     const id = req.params.id;
     await usuarios.destroy({where:{id}});
     res.redirect('/usuarios');
    }catch(error){
       console.error(error.message);
       res.status(500).json({status:false,error:error.message});
   }
}
////////////////////////////////////////////////////////////////
module.exports= {
    index,
    ejecutivo_II,
    viewAdmin,
    gestion_de_pagos,
    bienvenidos,
    perfilUsuario,
    sugerencias,
    loginPost,
    crearPost,
    recovery,
    recoveryPost,
    restablecerPasswordPost,
    dashboar,usUarios,restablecer,updateUsuarioGet,updateUsuarioPost,deleteUsuario
}