var express = require('express');
var router = express.Router();



const {Verficar_Datos_Cliente,Verificar_Usuario_Clave_Crear_Cliente} = require('../middleware/registro_middleware');
const Cliente = require('../Modelo/cliente');




router.get('/registro',function(req,res,next){

  
  res.render('Vista_Registro/Registro',{mensaje: null});
  
  



});


router.post('/registro', Verficar_Datos_Cliente, (req, res) => {

  


    req.session.cedula = req.cedula;

    return res.redirect('/clientes/registro/crear-cuenta');
  
  

 

});




router.get('/registro/crear-cuenta',function(req,res,next){



  res.render('Vista_Registro/Registro_CrearCuenta',{mensaje:null});

});



router.get('/registro/registro-exitoso', function(req,res,next) {

    res.render('Vista_Registro/Registro_RegistroExitoso');




});


router.post('/registro/crear-cuenta', Verificar_Usuario_Clave_Crear_Cliente ,(req,res) => {

  


  

  const ced = req.session.cedula;
 

  

    const Nuevo_Cliente = new Cliente(req.usu,req.cla,ced);
    Nuevo_Cliente.Crear_Cliente();
  
    return res.redirect('/clientes/registro/registro-exitoso');

  
  

});








module.exports = router;
