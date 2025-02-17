const nodemailer= require('nodemailer');
const PDFDocument = require('pdfkit');
const path = require('path');
/////////////////////////////////////////////////////////
const transporter = nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:'elrandygraterol@gmail.com',
        pass:'swkfueydbdbkesmc'
    }
});

const consulta = async()=>{
  const apartamentOs = await apartamentos.findAll();
  const paGos = await pagos.findAll();
  const users = await usuarios.findAll();
  const repoRtes = await reportes.findAll();
  const factUras = await facturas.findAll();
  // Sumar las deudas
  const totalDeudaActual = users.reduce((total, user) => {
        return total + (user.deudaActual || 0); // Asegúrate de manejar valores nulos
    }, 0);

  const totalDeudaPendiente = users.reduce((total, user) => {
        return total + (user.deudaPendiente || 0); // Asegúrate de manejar valores nulos
    }, 0);
  const activos = apartamentOs.filter(apartamento => apartamento.status === 'true').length;
  const inactivos = apartamentOs.filter(apartamento => apartamento.status === 'false').length;
  return{
   apartamentOs,paGos,users,repoRtes,factUras,activos,inactivos,totalDeudaActual,totalDeudaPendiente
}
}
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

// Definir la relación uno a uno
usuarios.hasMany(apartamentos, { foreignKey: 'usuarioId' });
apartamentos.belongsTo(usuarios, { foreignKey: 'usuarioId' });

apartamentos.hasMany(reportes, { foreignKey: 'apartamentoId' }); // Cambiado de 'apartamento' a 'apartamentoId'
reportes.belongsTo(apartamentos, { foreignKey: 'apartamentoId' }); // Cambiado de 'apartamento' a 'apartamentoId'



const index = (req,res)=>{
    try{
        res.render('index');
    }catch(error){
        console.error(error.message);
    };
}
const bienvenidos = (req,res)=>{
    try{
        res.render('bienvenido');
    }catch(error){
        console.error(error.message);
    };
}
const ejecutivo_II = (req,res)=>{
    try{
        res.render('ejecutivo_II');
    }catch(error){
        console.error(error.message);
    };
}
const perfilUsuario = async(req,res)=>{
    try{
        const id = req.session.idAdminLogin;
        const us = await usuarios.findOne({where:{id}});
        res.render('perfilUsuario',{us});
    }catch(error){
        console.error(error.message);
    };
}
const gestion_de_pagos = async(req,res)=>{
    try{
        let id,idF;
        if(req.session.isAdmin){
            id = req.session.idAdminLogin ;
        }
        const data = await usuarios.findOne({where:{id}});
        if(data){
          idF=data.id;
      }
      const f = await facturas.findOne({where:{usuarioId:idF}});
      res.render('gestionPagos',{data,f});
  }catch(error){
    console.error(error.message);
    res.status(500).json({status:"X",error:error.message});
};
}
///////////////////////////////////////////////////////////////
const pagar = async(req,res)=>{
    try{
        const id = req.session.idAdminLogin;
        const user = await usuarios.findOne({where:{id}});
        if(user){
          console.log(`usuario ID: ${JSON.stringify(user)}`);
          return res.render('pagar',{user});   
      }
      res.status(500).send('Error al mostrar plantilla Pagar.');

  }catch(error){
   console.error(error.message);
   res.status(500).json({status:"X",error:error.message});
}
}
//////////////////////////////////////////////////////////////
const viewAdmin = (req,res)=>{
    try{
        res.render('viewAdmin');
    }catch{
        console.error(e.message);
    };
}
const sugerencias = async(req,res)=>{
    try{
        const c = await consulta();
        res.render('sugerencias',{apartamentos:c.apartamentOs});
    }catch{
        console.error(e.message);
    };
}
/////////////////////////////////////////////////////////////////
const loginPost = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const data = await usuarios.findOne({where:{email,password}});
        let role='cliente';
        if(data){
            req.session.isAdmin =true;// Establecer propiedad en la sesión
            req.session.idAdminLogin = data.id;
            if(data.id == 1){
               role='admin';
           }
           res.json({status:true,role});
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
       const {nombre,email,telefono,password,deudaActual,deudaPendiente} = req.body;
       let portada;
       if (req.file){
      // Si se sube una imagen
        portada = `/uploads/${req.file.filename}`;
        await usuarios.create({nombre,email,telefono,password,imgPerfil:portada,deudaActual,deudaPendiente});
    }
    res.redirect('/usuarios');
}catch(error){
    console.error(error.message);
    res.status(500).json({error:error.message});
}
}
/////////////////////////////////////////////////////////////
const crearApartamentoPost = async(req,res)=>{
    try{
       const {piso,edificio,apartamento,usuarioId} = req.body;
       await apartamentos.create({piso,edificio,apartamento,usuarioId,status:'true'});
       res.redirect('/apartamentos');
   }catch(error){
      console.error(error.message);
      res.status(500).json({error:error.message});
  }
}
/////////////////////////////////////////////////////////////
const crearPagoPost = async (req, res) => {
    try {
        let portada;
        const id = req.params.id;
        const { codigo, comentario, usuarioId, monto } = req.body;

        // Crear el pago
        if (req.file) {
            portada = `/uploads/${req.file.filename}`;
            await pagos.create({ codigo, comentario, comprobante: portada, usuarioId, monto });
        }

        // Obtener el usuario para actualizar su deuda
        const usuario = await usuarios.findOne({ where: { id: usuarioId } });

        if (usuario) {
            // Calcular nueva deuda actual
            const nuevaDeudaActual = Math.max(0, usuario.deudaActual - monto); // Asegúrate de que no sea negativa
            const nuevaDeudaPendiente = usuario.deudaPendiente; // Puedes ajustar esto según tu lógica

            // Actualizar el usuario
            await usuarios.update(
            {
                deudaActual: nuevaDeudaActual,
                    deudaPendiente: nuevaDeudaPendiente // Ajusta esto si necesitas cambiar la deuda pendiente
                },
                { where: { id: usuarioId } }
                );
        }

        // Redirigir según el ID
        if (id == 0) {
            res.redirect('/adminPagos');
        } else {
            res.redirect('/gestionPagos');
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ status: false });
    }
};
/////////////////////////////////////////////////////////////
const crearReporte = async(req,res)=>{
    try{
        const role = req.params.role;
        let ruta;
        const {nombre,apartamentoId,telefono,motivos,descripcion} = req.body;
        await reportes.create({nombre,apartamentoId,telefono,motivos,descripcion});
        if(role !== "cliente"){
            res.redirect('/reportes');
        }else{
            res.json({status:true});
        }
    }catch(error){
       console.error(error.message);
       res.status(500).json({status:false,error:error.message});
   }
}
/////////////////////////////////////////////////////////////
const crearFactura = async(req,res)=>{
    try{
        const {usuarioId,pagoId,apartamentoId} = req.body;
        await facturas.create({usuarioId,pagoId,apartamentoId});
        res.redirect('/facturas');
    }catch(error){
        console.error(error.message);
        res.status(500).json({status:false,error:error.message});
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
              from:'elrandygraterol@gmail.com',
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
     let data= await consulta(); 
     res.render('admin',{users:data.users,paGos:data.paGos,apartamentOs:data.apartamentOs,activos:data.activos,inactivos:data.inactivos,repoRtes:data.repoRtes,factUras:data.factUras,totalDeudaActual:data.totalDeudaActual,totalDeudaPendiente:data.totalDeudaPendiente});
 }catch(error){
     console.error(error.message);
     res.status(500).json({status:false,error:error.message});
 }
}
////////////////////////////////////////////////////////////////
const usUarios = async(req,res)=>{
    try{
        let data= await consulta(); 
        res.render('usuarios',{users:data.users,paGos:data.paGos,apartamentOs:data.apartamentOs,activos:data.activos,inactivos:data.inactivos,repoRtes:data.repoRtes,factUras:data.factUras,totalDeudaActual:data.totalDeudaActual,totalDeudaPendiente:data.totalDeudaPendiente});
    }catch(error){
     console.error(error.message);
     res.status(500).json({status:false,error:error.message});
 }
}
///////////////////////////////////////////////////////////////
const aPartamentos = async(req,res)=>{
    try{
        let data= await consulta(); 
        res.render('apartamentos',{users:data.users,paGos:data.paGos,apartamentOs:data.apartamentOs,activos:data.activos,inactivos:data.inactivos,repoRtes:data.repoRtes,factUras:data.factUras,totalDeudaActual:data.totalDeudaActual,totalDeudaPendiente:data.totalDeudaPendiente});
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
const updateGet = async (req, res) => {
    try {
        let data, u;
        const { id, tabla } = req.params;
        u= await consulta();
        if (tabla === "usuarios") {
            data = await usuarios.findOne({ where: { id } });
        } else if (tabla === 'apartamentos') {
            data = await apartamentos.findOne({ where: { id } });
            // Verificando si el apartamento fue encontrado
            if (!data) {
                return res.status(404).json({ message: 'Apartamento no encontrado' });
            }
        } else if (tabla === 'adminPagos') {
            data = await pagos.findOne({ where:{id}});
        }else if(tabla == 'reportes'){
          data = await reportes.findOne({where:{id}});
      }else{
        data = await facturas.findOne({where:{id}});
    }

        // Verificando si data es null o undefined antes de acceder a sus propiedades
    if (!data) {
        return res.status(404).json({ message: 'Registro no encontrado' });
    }
    res.render('./formularios/update', { data, tabla, usuarios: u ? u.users : 'false',apartacho:u ? u.apartamentOs : 'false',paGos:u.paGos});
} catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, error: error.message });
}
};
////////////////////////////////////////////////////////////////
const updatePost = async(req,res)=>{
    try{
       const {id,tabla} = req.params;
       if(tabla == "usuarios"){
         let {nombre,email,telefono,password,apartamentoId,deudaActual,deudaPendiente} = req.body;
         let portada;
         if (req.file){
      // Si se sube una imagen
            portada = `/uploads/${req.file.filename}`;
            await usuarios.update({nombre,email,telefono,password,imgPerfil:portada,apartamentoId,deudaActual,deudaPendiente},{where:{id}});
        }
    }else if(tabla == 'apartamentos'){
     let {piso,edificio,apartamento,usuarioId,status} = req.body;
     await apartamentos.update({piso,edificio,apartamento,usuarioId,status},{where:{id}});

 }else if(tabla == 'adminPagos'){

     let {codigo,comentario,comprobante,usuarioId,monto} = req.body;

     if(req.file){
      portada = `/uploads/${req.file.filename}`;
      await pagos.update({codigo,comentario,comprobante:portada,usuarioId,monto},{where:{id}});
  }
}else if(tabla == 'reportes'){
    const {nombre,apartamentoId,telefono,motivos,descripcion}=req.body;
    await reportes.update({nombre,apartamentoId,telefono,motivos,descripcion},{where:{id}});
}else{
    const {usuarioId,pagoId,apartamentoId} = req.body;
    await facturas.update({usuarioId,pagoId,apartamentoId},{where:{id}});
}
res.redirect(`/${tabla}`);
}catch(error){
  console.error(error.message);
  res.status(500).json({status:false,error:error.message});
}
}
////////////////////////////////////////////////////////////////
const deleteUsuario =async(req,res)=>{
    try{
     const {id,tabla} = req.params;
     if(tabla == 'usuarios'){
         await usuarios.destroy({where:{id}});  
     }else if(tabla == 'apartamentos'){
         await apartamentos.destroy({where:{id}});
     }else if(tabla == 'adminPagos'){
        await pagos.destroy({where:{id}});
    }else if(tabla == 'reportes'){
        await reportes.destroy({where:{id}});
    }else{
        await facturas.destroy({where:{id}});
    }
    res.redirect(`/${tabla}`);
}catch(error){
   console.error(error.message);
   res.status(500).json({status:false,error:error.message});
}
}
////////////////////////////////////////////////////////////////
const adminPagos = async(req,res)=>{
    try{
        const data = await consulta();
        res.render('pagos',{paGos:data.paGos,users:data.users,apartamentOs:data.apartamentOs,activos:data.activos,inactivos:data.inactivos,repoRtes:data.repoRtes,factUras:data.factUras,totalDeudaActual:data.totalDeudaActual,totalDeudaPendiente:data.totalDeudaPendiente});
    }catch(error){
     console.error(error.message);
     res.status(500).json({status:false,error:error.message});
 }
}
////////////////////////////////////////////////////////////////
const repor = async(req,res)=>{
    try{
        const data = await consulta();
        res.render('reportes',{paGos:data.paGos,users:data.users,apartamentOs:data.apartamentOs,activos:data.activos,inactivos:data.inactivos,repoRtes:data.repoRtes,factUras:data.factUras,totalDeudaActual:data.totalDeudaActual,totalDeudaPendiente:data.totalDeudaPendiente});
    }catch(error){
        console.error(error.message);
        res.status(500).json({status:false,error:error.message});
    }
}
////////////////////////////////////////////////////////////////
const fActuras = async(req,res)=>{
 try{
    const data = await consulta();
    res.render('facturas',{paGos:data.paGos,users:data.users,apartamentOs:data.apartamentOs,activos:data.activos,inactivos:data.inactivos,repoRtes:data.repoRtes,factUras:data.factUras,totalDeudaActual:data.totalDeudaActual,totalDeudaPendiente:data.totalDeudaPendiente});
}catch(error){
  console.error(error.message);
  res.status(500).json({status:false,error:error.message});
}
}
////////////////////////////////////////////////////////////////
const descargarPDF = async(req,res)=>{
    try{
 // Crear un nuevo documento PDF
        const doc = new PDFDocument();
        const id = req.params.id;

        const fac = await facturas.findOne({
            where: { id },
            include: [
                {
                    model: usuarios,
                    required: true // Asegura que se incluya el usuario asociado
                },
                {
                    model: apartamentos,
                    required: true // Asegura que se incluya el apartamento asociado
                }
            ]
        });

        if (!fac) {
            return res.status(404).json({ status: false, message: 'Factura no encontrada' });
        }
    // Configurar la respuesta para la descarga del PDF
        res.setHeader('Content-disposition', 'attachment; filename=Factura.pdf');
        res.setHeader('Content-type', 'application/pdf');

    // Pipe el documento a la respuesta
        doc.pipe(res);

      
         // Construir la ruta al archivo de imagen
        const backgroundImagePath = path.join(__dirname, '../public/fondo.jpeg');

        doc.image(backgroundImagePath, 0, 0, { width: 600, height: 800 }); // Ajusta el tamaño según sea necesario
        
        // Establecer el color del texto en blanco
        doc.fillColor('white');


    // Agregar contenido al PDF
        doc.fontSize(25).text(`Factura de : ${fac.usuario.nombre}`, 100, 80);
        doc.fontSize(12).text(`
            Identificador: ${fac.id}
            Correo: ${fac.usuario.email},
            Telefono: ${fac.usuario.telefono},
            deuda Actual: ${fac.usuario.deudaActual},
            deuda Pendiente: ${fac.usuario.deudaPendiente},
            apartamento: ${fac.apartamento.apartamento},
            piso: ${fac.apartamento.piso},
            edificio: ${fac.apartamento.edificio},
            fecha: ${fac.createdAt}
        `, 100, 120);

    // Finalizar el PDF
        doc.end();
    }catch(error){
       console.error(error.message);
       res.status(500).json({status:false,error:error.message});
   }
}
////////////////////////////////////////////////////////////////
const restartPasswordPerfil = async(req,res)=>{
    try{
        const {id,p} = req.body;
        await usuarios.update({password:p},{where:{id}});
        res.json({status:true});
    }catch(error){
        console.error(error.message);
        res.status(500).json({status:false,error:error.message}); 
    }
}
////////////////////////////////////////////////////////////////
const logout = async(req,res)=>{
try{
  req.session.destroy(err => {
        if(err) return console.error(err.message);
        res.clearCookie('connect.sid'); // Limpia la cookie de sesión
        res.redirect('/'); // Redirige a la página principal o a la página de inicio de sesión
    });
}catch(error){
console.error(error.message);
res.status(500).send('Error en el servidor');
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
    dashboar,
    usUarios,
    restablecer,
    updateGet,
    updatePost,
    deleteUsuario,adminPagos,aPartamentos,crearApartamentoPost,
    crearPagoPost,repor,crearReporte,fActuras,crearFactura,descargarPDF,pagar,restartPasswordPerfil,logout
}