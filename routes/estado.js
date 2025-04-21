const express = require('express');
const router = express.Router();

const {Get_Datos_Cliente, Get_Cedula_Transaccion, Get_Numero_Cuenta, Get_Saldo,  Mostrar_Datos_Estado_Cliente} = require('../Repositorio/Cliente_Repositorio');
const { BuilPDF } = require('../librerias/pdfkit');


router.get('/', async function(req,res){

    const usu = req.session.usu;

  
  
    const cliente = await Get_Datos_Cliente(usu);


    const cedula = await Get_Cedula_Transaccion(usu);

    const cedulaobj = cedula[0].Cedula;

  
    const cuentas = await Get_Numero_Cuenta(cedulaobj);


    res.render('Vista_Estado/Estado',{cliente:cliente, cuentas: cuentas});




});

router.post('/api-estado-cuenta',async function (req, res, next) {
   

    const cuenta = req.body.cuenta;

    const estado = await Mostrar_Datos_Estado_Cliente();

    const filtro_estado = estado.filter(e => e.Cuenta_rem === cuenta).map( e => ({id: e.Id_tra, fecha: e.fecha_tra, hora: e.Hora_tra, cantidad: e.Cantidad ,remitente: e.Remitente, cue_rem: e.Cuenta_rem, beneficiario: e.Beneficiario, cue_ben: e.Cuenta_ben}));

    const filtro_estado_beneficiario = estado.filter(e => e.Cuenta_ben === cuenta).map( e => ({id: e.Id_tra, fecha: e.fecha_tra, hora: e.Hora_tra, cantidad: e.Cantidad ,remitente: e.Remitente, cue_rem: e.Cuenta_rem, beneficiario: e.Beneficiario, cue_ben: e.Cuenta_ben}));

        res.json({filtro_estado,filtro_estado_beneficiario});
    
   

    


});


router.post('/api-estado-cuenta-filtro-fecha', async function (req,res,next) {
    
    const cuenta = req.body.cuenta;
    const fecha = req.body.fecha;

  

    const estado = await Mostrar_Datos_Estado_Cliente();

    

   

    const filtro_estado = estado.filter(e =>{  let fecha_f = new Date(e.fecha_tra);  let fecha_formateada = fecha_f.toISOString().split('T')[0];   return e.Cuenta_rem === cuenta && fecha_formateada === fecha} ).map( e => ({id: e.Id_tra, fecha: e.fecha_tra, hora: e.Hora_tra, cantidad: e.Cantidad ,remitente: e.Remitente, cue_rem: e.Cuenta_rem, beneficiario: e.Beneficiario, cue_ben: e.Cuenta_ben}));

    const filtro_estado_beneficiario = estado.filter(e =>{  let fecha_f = new Date(e.fecha_tra);  let fecha_formateada = fecha_f.toISOString().split('T')[0];  return e.Cuenta_ben === cuenta && fecha_formateada === fecha} ).map( e => ({id: e.Id_tra, fecha: e.fecha_tra, hora: e.Hora_tra, cantidad: e.Cantidad ,remitente: e.Remitente, cue_rem: e.Cuenta_rem, beneficiario: e.Beneficiario, cue_ben: e.Cuenta_ben}));
    

    res.json({filtro_estado,filtro_estado_beneficiario});


})


router.post('/api-estado-cuenta-filtro-mes', async function(req,res){

    const cuenta = req.body.cuenta;
    const fecha = req.body.fecha;

    console.log("fecha desde body:" + fecha);

    const estado = await Mostrar_Datos_Estado_Cliente();

    

   

    const filtro_estado = estado.filter(e =>{  let fecha_f = new Date(e.fecha_tra);  let fecha_formateada = fecha_f.toISOString().split('T')[0].slice(0,7);   return e.Cuenta_rem === cuenta && fecha_formateada === fecha} ).map( e => ({id: e.Id_tra, fecha: e.fecha_tra, hora: e.Hora_tra, cantidad: e.Cantidad ,remitente: e.Remitente, cue_rem: e.Cuenta_rem, beneficiario: e.Beneficiario, cue_ben: e.Cuenta_ben}));
    const filtro_estado_beneficiario = estado.filter(e =>{  let fecha_f = new Date(e.fecha_tra);  let fecha_formateada = fecha_f.toISOString().split('T')[0].slice(0,7);   return e.Cuenta_ben === cuenta && fecha_formateada === fecha} ).map( e => ({id: e.Id_tra, fecha: e.fecha_tra, hora: e.Hora_tra, cantidad: e.Cantidad ,remitente: e.Remitente, cue_rem: e.Cuenta_rem, beneficiario: e.Beneficiario, cue_ben: e.Cuenta_ben}));
    

    res.json({filtro_estado,filtro_estado_beneficiario});


});

router.get('/factura', async function(req,res,next){

    const id_factura = req.session.id_factura;



    const cliente = await Mostrar_Datos_Estado_Cliente();

    

    
    const filtrar_factura = cliente.filter(c => c.Id_tra == id_factura).map(e =>({id: e.Id_tra, fecha: e.fecha_tra, hora: e.Hora_tra, cantidad: e.Cantidad ,remitente: e.Remitente, cue_rem: e.Cuenta_rem, beneficiario: e.Beneficiario, cue_ben: e.Cuenta_ben}));
    
    if (filtrar_factura.length === 0) {
        console.log('No hay datos para generar el PDF.');
    }
    const stream = res.writeHead(200,
    
    {
        'content-type':'application/pdf',
        'content-disposition':'attachment; filename=factura_repositorio.pdf'


    });

    BuilPDF(filtrar_factura,null,(data) => stream.write(data), () => stream.end());



});

router.post('/api-pdf', function (req,res,next) {
   
    
    const id = req.body.id_pdf;

   

    req.session.id_factura = id;

    res.json({ok: true});


});











module.exports = router;