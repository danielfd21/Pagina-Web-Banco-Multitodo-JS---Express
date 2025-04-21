function SetClave(boton,input,boton_con,check,cedula){

        
  
    input.value += boton;

    if(input.value.length > 0 && check.checked == true && cedula !== ''){

        boton_con.disabled = false;
        

    }else{
        boton_con.disabled = true;
    }

}


function BorrarClave(input,boton){

    if (input.value !== '') {
        input.value = input.value.slice(0, -1);
    }

   
    if (input.value.length === 0 ) {
       boton.disabled = true;
    }
    
   

}



function Expresion(exp,id){

    const idn = document.getElementById(id);

    if(exp){

        idn.classList.remove("invalido");
        idn.classList.add("valido");


    }else{
        idn.classList.remove("valido");
        idn.classList.add("invalido");

    }

}




function Conf_Usu(usu){

    const long = usu.length >= 8 && usu.length <= 16;
    const mayus =  /[A-Z]/.test(usu);
    const minus = /[a-z]/.test(usu);
    const nume = /[0-9]/.test(usu); 
    const espa = !/\s/.test(usu) && usu.length > 0 ;


    Expresion(long,"long");
    Expresion(mayus,"mayus");
    Expresion(minus,"minus");
    Expresion(nume,"nume");
    Expresion(espa,"espa");


}


function Conf_Cla(cla){

    const long = cla.length >= 8 && cla.length <= 16;
    const mayus =  /[A-Z]/.test(cla);
    const minus = /[a-z]/.test(cla);
    const nume = /[0-9]/.test(cla); 
    const cara = /[@_#-]/.test(cla);
   


    Expresion(long,"long_cl");
    Expresion(mayus,"mayus_cl");
    Expresion(minus,"minus_cl");
    Expresion(nume,"nume_cl");
    Expresion(cara,"cara_cl");


}


function Igu_Cla(cla,cla2){

    const igua = cla2 === cla &&   cla.length > 0;

    Expresion(igua,"clav");

    




}


function Mostrar(campo,boton){

    if(campo.type == 'password'){

        campo.type = 'text';
        boton.textContent = 'Ocultar';

    }else{

        campo.type = 'password';
        boton.textContent = 'Mostrar';

    }

}



function Desbloquear(check,cedula,clave,boton){ 

    if(check.checked == false  || cedula.trim() === "" || clave.length === 0){

        boton.disabled = true;
        

    }else{
        boton.disabled = false;
    }

}






