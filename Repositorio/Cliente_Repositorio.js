const Conectar = require('../conexion/conexion');
const bcrypt = require('bcrypt');






function Consulta_Verificar_Datos_Cliente(cedula, clave){

    return new Promise((resolve,reject)=>{

        const conectar = Conectar();

        conectar.query("SELECT * FROM Cuenta WHERE Cedula = ? AND Clave = ?",[cedula,clave] ,function(err,consulta){
            
            if(err){

                reject(err);
                
            }else if(consulta.length > 0){
                
                resolve(true);

            }else{
                resolve(false);
            }
            
            conectar.end();
    
        });
    

    });

    
    
    
    
}

function Consulta_Verificar_Cliente(cedula){


    const conectar = Conectar();

    return new Promise((resolve,reject) => {

        conectar.query('SELECT * FROM cuenta_web WHERE cedula = ? ',[cedula],function(err,consulta){

            if(err){

                reject(err);

            }else if(consulta.length > 0){

                resolve(true);
            }else{
                resolve(false);
            }

            conectar.end();

        });
    
    });

    

}



async function Insert_Tabla_Cuenta_Web(usuario,clave,cedula){

    const conectar = Conectar();

    const clave_hash = await bcrypt.hash(clave,10);


    return new Promise((resolve,reject) => {

        estado = "Activo";
        intentos = 0;

        
        conectar.query('INSERT INTO cuenta_web(estado,usuario,clave,cedula,intentos) VALUES(?,?,?,?,?)',[estado,usuario,clave_hash,cedula,intentos], function (err,insert){

            if(err){

                reject(err);

            }else{
                resolve(insert);
            }   

            
            conectar.end();
        });

        

    });


}



function Consulta_Verificar_Usuario(usuario){

    const conectar = Conectar();

    return new Promise((resolve,reject) => {

    conectar.query('select * from cuenta_web WHERE Usuario = ?',[usuario],function(err,consulta){

        if(err){
        
            reject(err);
        
        
        }else if(consulta.length > 0){

            resolve(true);

        }else{
            resolve(false);
        }

        conectar.end();

    });


    });


}

function Get_Clave(usuario){

    const conectar = Conectar();

    return new Promise((resolve,reject) => {

        conectar.query('SELECT Clave FROM cuenta_web WHERE Usuario = ? ', [usuario] ,function(err,consulta){

            if(err){

                reject(err);

            }else if(consulta.length > 0){

                resolve(consulta[0].Clave);

            }else{

                resolve(false);
            }

            conectar.end();
        });


    });




}






function Get_Datos_Cliente(usuario){

    const conectar = Conectar();


    return new Promise((resolve, reject) =>{

        conectar.query('SELECT * FROM cuenta_web INNER JOIN Cliente ON cuenta_web.cedula = cliente.cedula WHERE Usuario = ?',[usuario],function(err,consulta){

            if(err){

                reject(err);

            }else if(consulta.length > 0){

                resolve(consulta);

            }else{

                resolve([]);
            }

            conectar.end();
        });

    });


}



function Get_Cedula_Transaccion(usuario){

    const bd = Conectar();

    return new Promise((resolve,reject) =>{

        bd.query('SELECT Cedula FROM cuenta_web WHERE Usuario = ?',[usuario],function(err,consulta){

            if(err){
                reject(err);

            }else if(consulta.length > 0){
                
                resolve(consulta);

            }else{
                resolve([]);
            }

            bd.end();

        });




    });


}


function Get_Numero_Cuenta(cedula){

    const bd = Conectar();

    return new Promise((resolve,reject) =>{

        bd.query('SELECT Numero_cuenta FROM cuenta WHERE Cedula = ?',[cedula],function(err,consulta){

            if(err){
                reject(err);
            }else if(consulta.length > 0){
                
                resolve(consulta);

            }else{
                resolve([]);
            }

            bd.end();

        });




    });


}

function Consulta_Verificar_Cuenta(cuenta, nombres){

    const bd = Conectar();

    return new Promise((resolve,reject) =>{


        bd.query('SELECT * FROM cuenta INNER JOIN cliente ON cuenta.Cedula = cliente.Cedula WHERE cuenta.Numero_cuenta = ? AND cliente.Nombres = ?',[cuenta,nombres],function(err,consulta){

            if(err){
                reject(err);
            }else if(consulta.length > 0){

                resolve(true);
            }else{
                resolve(false);
            }

            bd.end();

        });

    });

}

function Get_Saldo(cuenta){

    const bd = Conectar();

    return new Promise((resolve,reject) =>{

        bd.query('SELECT Saldo FROM cuenta WHERE Numero_cuenta = ?',[cuenta],function(err,consulta){

            if(err){
                reject(err);
            }else if(consulta.length > 0){

                resolve(consulta[0].Saldo);

            }else{
                resolve([])
            }

            bd.end();

        });

    });

}


function Insert_Tabla_Transferencia(cantidad,cue_dep,cue_ben){

    const bd = Conectar();

    return new Promise((resolve,reject) =>{

       

        bd.query("INSERT INTO transaccion(fecha_tra,Hora_tra,Cantidad,Cuenta_rem,Cuenta_ben) VALUES(Current_Date,Current_Time,?,?,?)", [cantidad,cue_dep,cue_ben] ,function(err,insert){

            if(err){

                reject(err);

            }else{


                resolve(insert.insertId);
            }

            bd.end();

        });

    });


}


function Execute_Transferencia(cue_dep, cue_ben, cantidad){


    const bd = Conectar();

    return new Promise((resolve,reject) => {

        bd.query('CALL Transferir(?,?,?)',[cue_dep,cue_ben,cantidad],function(err,ejecutar){

            if(err){

                reject(err);
            
            }else{

                resolve(ejecutar);
            }


        });



    });

}


function Mostrar_Datos_Estado_Cliente(){

    const bd = Conectar();

    return new Promise((resolve, reject) =>{

    bd.query("SELECT transaccion.Id_tra ,transaccion.fecha_tra, transaccion.Hora_tra, transaccion.Cantidad , cli_rem.Nombres AS 'Remitente' , transaccion.Cuenta_rem, cli_ben.Nombres AS 'Beneficiario' , transaccion.Cuenta_ben FROM transaccion INNER JOIN cuenta AS cue_rem ON transaccion.Cuenta_rem = cue_rem.Numero_cuenta INNER JOIN cliente AS cli_rem ON cue_rem.Cedula = cli_rem.Cedula INNER JOIN cuenta AS cue_ben ON transaccion.Cuenta_ben = cue_ben.Numero_cuenta INNER JOIN cliente AS cli_ben ON cue_ben.Cedula = cli_ben.Cedula;",function(err,consulta){

        if(err){
            reject(err);
        }else{
            resolve(consulta);
        }

        bd.end();
    });


    });


}


module.exports = { Consulta_Verificar_Datos_Cliente, Insert_Tabla_Cuenta_Web, Consulta_Verificar_Cliente, Consulta_Verificar_Usuario, Get_Clave, Get_Datos_Cliente, Get_Cedula_Transaccion, Get_Numero_Cuenta, Consulta_Verificar_Cuenta, Get_Saldo, Insert_Tabla_Transferencia, Execute_Transferencia, Mostrar_Datos_Estado_Cliente };

