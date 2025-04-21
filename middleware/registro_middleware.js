const {Consulta_Verificar_Datos_Cliente, Consulta_Verificar_Cliente, Consulta_Verificar_Usuario} = require('../Repositorio/Cliente_Repositorio');


const Verficar_Datos_Cliente = async(req,res,next) => {

  let mensaje = ""; 
 

  const ced = req.body.txt_ced;
  const cla = req.body.txt_cla;

  const verificar_cliente = await Consulta_Verificar_Cliente(ced);
  const verificar = await Consulta_Verificar_Datos_Cliente(ced,cla);

  if(ced === "" && cla === ""){ 

 
    mensaje = "Por favor llene todos los campos";

    return res.render('Vista_Registro/Registro',{mensaje: mensaje});

  }else if(verificar_cliente){


   mensaje = "El cliente ya tiene una cuentra creada previamente";

    return res.render('Vista_Registro/Registro',{mensaje: mensaje});

  }else if(!verificar){

    

   mensaje = "Los datos del cliente son incorrectos";

   return res.render('Vista_Registro/Registro',{mensaje: mensaje});


  }else{
    

    req.cedula = ced;
    next();

  }

   



   

}

function Verificar_Fuerza_Clave(clave){

  estado = false;

  const long = clave.length >= 8 && clave.length <= 16;
  const minuscula = /[a-z]/.test(clave);
  const mayuscula = /[A-Z]/.test(clave);
  const numeros = /[0-9]/.test(clave);
  const caracteres = /[@_#-]/.test(clave);
  
  if(long && minuscula && mayuscula && numeros && caracteres){

    estado = true;

  }


  return estado;


}




const Verificar_Usuario_Clave_Crear_Cliente = async(req,res,next) =>{


  const cla = req.body.txt_cla;
  const cla2 = req.body.txt_cla2;
  const usu = req.body.txt_usu;

  const verificar_usuario = await Consulta_Verificar_Usuario(usu);

  let mensaje = "";

  if(usu === "" && cla === "" && cla2 === "" ){

    mensaje = "Por favor llene todos los campos";

    return res.render('Vista_Registro/Registro_CrearCuenta',{mensaje:mensaje});


  }else if(cla !== cla2){


    mensaje  = "Las contraseñas deben ser iguales";

    return res.render('Vista_Registro/Registro_CrearCuenta', {mensaje: mensaje});


  }else if(Verificar_Fuerza_Clave(cla) === false){


    mensaje = "La contraseña debe contener como minimo entre 8 a 16 digitos con una letra en minuscula, una letra en mayuscula, un numero y un caracter no alfanumerico";

    return res.render('Vista_Registro/Registro_CrearCuenta',{mensaje:mensaje});
  
  }else if(verificar_usuario){

    mensaje = "El nombre de usuario ya se encuentra en uso";

    return res.render('Vista_Registro/Registro_CrearCuenta',{mensaje:mensaje});

  }else {

    
    mensaje = "";
    req.usu = usu;
    req.cla = cla;
    req.cla2 = cla2;
    next();

  }

}





module.exports = {Verficar_Datos_Cliente, Verificar_Usuario_Clave_Crear_Cliente};
