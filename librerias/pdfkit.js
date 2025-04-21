const PDFDocument = require("pdfkit");





 function BuilPDF(filtro_factura,saldo,dataCallback,endCallback){

    
    
    const doc = new PDFDocument();

    doc.on('data',dataCallback);
    doc.on('end',endCallback);

    doc.text('----------Factura-----------');

    filtro_factura.forEach(e => {
        
        const fec = new Date(e.fecha);
        
        const fecha_formateada = fec.toISOString().split('T')[0];
    
    doc.text('----------------------------');    
    doc.text('Numero de factura' + e.id);
    doc.text('fecha:' + fecha_formateada);
    doc.text('hora:' + e.hora);
    doc.text('cantidad:' + e.cantidad + "$");
    doc.text('remitente:' + e.remitente);
    doc.text('cuenta del remitente:' + e.cue_rem);
    doc.text('beneficiario:' + e.beneficiario);
    doc.text('cuenta del beneficiario:' + e.cue_ben);
 
    if(saldo !== null){
      doc.text('saldo restante' + saldo);
    }
   
    
    
    
    });
    
    doc.text('----------------------------');

    doc.end();

}


module.exports = {BuilPDF};