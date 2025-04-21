var express = require('express');
const router = express.Router();

const {Get_Datos_Cliente, Get_Cedula_Transaccion, Get_Numero_Cuenta, Insert_Tabla_Transferencia, Execute_Transferencia, Get_Saldo, Mostrar_Datos_Estado_Cliente} = require('../Repositorio/Cliente_Repositorio');
const {Verificar_Cuenta_Beneficiario} = require('../middleware/transaccion_middleware');
const {BuilPDF} = require('../librerias/pdfkit.js')

router.get('/', async function(req,res,next){

  const usu = req.session.usu;

  
  
  const cliente = await Get_Datos_Cliente(usu);


  

  const cedula = await Get_Cedula_Transaccion(usu);

  const cedulaobj = cedula[0].Cedula;

  
  const cuentas = await Get_Numero_Cuenta(cedulaobj);

  res.render('Vista_Transaccion/transaccion',{cliente: cliente, cuentas: cuentas, mensaje: null,saldo: null});
    
      

  
  
  });


  router.post('/saldo_cuenta', async function (req,res,next) {
    
    try{

     

      const cuenta = req.body.cuenta;

      console.log(cuenta);

      let saldo = "";

      saldo = await Get_Saldo(cuenta);

      if(cuenta === "SELECCIONE"){
  
        
        return res.json({exito:false, saldo:null});
      }

      return res.json({exito:true , saldo:saldo});

      

    }catch(err){

      console.log("error api saldo:" + err);
    }


  });

  router.post('/', Verificar_Cuenta_Beneficiario, async function(req,res, next){

   
    res.redirect('/transaccion/confirmar-transferencia');



  });


  router.get('/confirmar-transferencia',function(req,res){


    res.render('Vista_Transaccion/Confirmar_transaccion',{cue_dep: req.session.cue_dep, saldo: req.session.saldo, cue_ben: req.session.cue_ben, nom_ben: req.session.nom_ben, cantidad: req.session.cant_dep});


  });




  router.get('/transferencia-exitosa',function(req,res){


      res.render('Vista_Transaccion/Transaccion_exitosa');

  });


  router.post('/confirmar_transferencia', async function(req,res){

    const insertar_transferencia = await Insert_Tabla_Transferencia(req.session.cant_dep, req.session.cue_dep, req.session.cue_ben );

    if(insertar_transferencia){

      req.session.id_trans = insertar_transferencia;

      const actualizar_saldo = await Execute_Transferencia(req.session.cue_dep, req.session.cue_ben, req.session.cant_dep);

      if(actualizar_saldo){

        res.redirect('/transaccion/transferencia-exitosa');

      }

    }


  });


  router.get('/pdf',  async function(req,res){


    const id = req.session.id_trans;

    const Mostrar_Datos_Cliente = await Mostrar_Datos_Estado_Cliente();

   

    const filtro_factura = Mostrar_Datos_Cliente.filter(f => f.Id_tra === id ).map(e => ({ id: e.Id_tra, fecha: e.fecha_tra, hora: e.Hora_tra, cantidad: e.Cantidad ,remitente: e.Remitente, cue_rem: e.Cuenta_rem, beneficiario: e.Beneficiario, cue_ben: e.Cuenta_ben }));


    const cuenta_dep = filtro_factura[0].cue_rem;
    
    const saldo = await Get_Saldo(cuenta_dep);

    const stream = res.writeHead(200, 
      {

        "Content-Type" : "application/pdf",
        "content-disposition" : "attachment; filename=factura.pdf"
      }


    );

    BuilPDF(filtro_factura,saldo,(data) => stream.write(data), ()=> stream.end());


 

  });


  router.get('/imprimir-comprobante', async function(req, res){

    const id_trans = req.session.id_trans;

    const cliente = await Mostrar_Datos_Estado_Cliente();

    
    const filtro_cliente = cliente.filter( c =>  c.Id_tra === id_trans).map( e=>   {   let fec = new Date(e.fecha_tra); let fec_mod = fec.toISOString().split('T')[0];  return {id: e.Id_tra, fecha: fec_mod, hora: e.Hora_tra, cantidad: e.Cantidad ,remitente: e.Remitente, cue_rem: e.Cuenta_rem, beneficiario: e.Beneficiario, cue_ben: e.Cuenta_ben}} );


    const cuenta_dep = filtro_cliente[0].cue_rem;

  
    
    

    const saldo = await Get_Saldo(cuenta_dep);


    res.render('Vista_Comprobante/ImprimirComprobante',{filtro_cliente:filtro_cliente, saldo: saldo});



  });

  module.exports = router;