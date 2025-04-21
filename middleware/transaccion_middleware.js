const {Consulta_Verificar_Cuenta, Get_Saldo, Get_Datos_Cliente, Get_Cedula_Transaccion, Get_Numero_Cuenta} = require('../Repositorio/Cliente_Repositorio');


const Verificar_Cuenta_Beneficiario = async (req,res,next) => {
 
    const cue_ben = req.body.txt_cuenta_beneficiario;
    const nom_ben = req.body.txt_nombre_beneficiario;
    const cant_dep = req.body.txt_cantidad_deposito;
    const cue_dep = req.body.cb_cuenta;

    const usu = req.session.usu;


    
    const cliente = await Get_Datos_Cliente(usu);
  
  
  
    const cedula = await Get_Cedula_Transaccion(usu);

    const cedulaobj = cedula[0].Cedula;

    const cuentas = await Get_Numero_Cuenta(cedulaobj);

    let mensaje = "";


    if(cue_ben !== "" || nom_ben !== "" || cant_dep !== "" ){

    
    
    

    if(cue_ben !== cue_dep){



        const verificar_datos_beneficiario = await Consulta_Verificar_Cuenta(cue_ben,nom_ben);

        
  
  

        if(verificar_datos_beneficiario){

            const saldo = await  Get_Saldo(cue_dep);

            if(cant_dep <= saldo){


                req.session.cue_dep = cue_dep;
                req.session.cue_ben = cue_ben;
                req.session.nom_ben = nom_ben;
                req.session.cant_dep = cant_dep;
                req.session.saldo = saldo;
                

                next();

            }else{

                mensaje = "La cantidad supera el saldo permitido que posee";

              return  res.render('Vista_Transaccion/Transaccion',{cliente: cliente, cuentas: cuentas, mensaje: mensaje, saldo:null});
            }


        }else{

            mensaje = "Los datos del beneficiario son incorrectos";
            return res.render('Vista_Transaccion/Transaccion',{cliente: cliente, cuentas: cuentas, mensaje: mensaje, saldo:null});
        }

    }else{

        mensaje = "El numero de cuenta que ingreso es el mismo que el del depositante";
       return res.render('Vista_Transaccion/Transaccion',{cliente: cliente, cuentas: cuentas, mensaje: mensaje, saldo:null});
    }


    }else{

        mensaje = "Por favor llene todos los campos del beneficiario";

              return  res.render('Vista_Transaccion/Transaccion',{cliente: cliente, cuentas: cuentas, mensaje: mensaje, saldo:null});
    }
   
    
    

    

}

module.exports = {Verificar_Cuenta_Beneficiario};