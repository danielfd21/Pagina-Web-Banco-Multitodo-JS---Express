
const {Insert_Tabla_Cuenta_Web} = require('../Repositorio/Cliente_Repositorio');

class Cliente{

    usuario = "";
    clave = "";
    cedula = "";

    constructor(usuario,clave,cedula){

        this.usuario = usuario;
        this.clave = clave;
        this.cedula = cedula;

    }

    Crear_Cliente(){


        
        Insert_Tabla_Cuenta_Web(this.usuario,this.clave,this.cedula);


    }
    

   
}

module.exports = Cliente;











