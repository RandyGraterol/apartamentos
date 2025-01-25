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
        res.render('gestionPagos');
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
export {
    index,
    ejecutivo_II,
    viewAdmin,
    gestion_de_pagos,
    bienvenidos,
    perfilUsuario,
    sugerencias
}