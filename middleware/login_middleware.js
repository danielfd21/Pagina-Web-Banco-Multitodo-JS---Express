const {Get_Clave} = require('../Repositorio/Cliente_Repositorio');
const bcrypt = require('bcrypt');

const Acceder_Login = async(req,res,next) =>{

    const usu = req.body.txt_usu;
    const cla = req.body.txt_cla;

    let mensaje = "";

    


    if(usu === "" ||  cla === ""){

        mensaje = "Por favor llene todos los campos";
        return res.render('Vista_Login/Login',{mensaje:mensaje});

        

        
    }

    const clave_obt = await Get_Clave(usu);

    if(!clave_obt){

        mensaje = "El usuario es incorrecto";
        return res.render('Vista_Login/Login',{mensaje:mensaje});



    }else{

        

        const clave_comprobada = await bcrypt.compare(cla,clave_obt);

        if(clave_comprobada){
            
            mensaje = "";
            req.session.usu = usu;
            
            next();

        }else{

            mensaje = "La clave es incorrecta";
            return res.render('Vista_Login/Login',{mensaje:mensaje});
            
        }




    }




};

module.exports = {Acceder_Login};
