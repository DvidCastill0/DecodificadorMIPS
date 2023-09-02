//diccionario de instrucciones
let codigosInstrucciones = new Map();
codigosInstrucciones.set("add","100000");
codigosInstrucciones.set("sub","100010");
codigosInstrucciones.set("mult","011000");
codigosInstrucciones.set("div","011010");
codigosInstrucciones.set("and","100100");
codigosInstrucciones.set("or","100101");
codigosInstrucciones.set("slt","101010");
codigosInstrucciones.set("nop","000000");
codigosInstrucciones.set("addi","001000");
codigosInstrucciones.set("andi","001100");
codigosInstrucciones.set("ori","001101");
codigosInstrucciones.set("slti","001010");
codigosInstrucciones.set("lw","100011");
codigosInstrucciones.set("sw","101011");
codigosInstrucciones.set("beq","000100");
codigosInstrucciones.set("bgtz","000111");
codigosInstrucciones.set("bne","000101");
codigosInstrucciones.set("j","000010");

var datosBinario;
var errores=new Object();

function decodificar(){
    var lineas = document.getElementsByClassName("numeroLinea");
    datosBinario="";
    var codigo = document.getElementById("informacionEnsamblador").value;
    var instrucciones = codigo.split("\n");
    //console.log(instrucciones);
    if(encontrarErrores()==false){
        for (var i = 0; i < instrucciones.length; i++){
            var instruccion = instrucciones[i].split(" ");
           // console.log(instruccion);
            var tipoInstruccion = TDI(instruccion[0].toLowerCase(),i+1);
    
            if(tipoInstruccion !=3){
               
                if(tipoInstruccion == 0){
                    var codeOP = "000000"; // op code de Tipo R
                    codeOP+= completar0Registros(instruccion[1]);//rs
                    codeOP+= completar0Registros(instruccion[2]);//rt
                    codeOP+= completar0Registros(instruccion[3]);//rd
                    codeOP+= "00000";//shampt
                    codeOP+= codigosInstrucciones.get(instruccion[0]);//function
                    datosBinario+= codeOP.substr(0,8)+"\n";
                    datosBinario+= codeOP.substr(8,8)+"\n";
                    datosBinario+= codeOP.substr(16,8)+"\n";
                    datosBinario+= codeOP.substr(24,8)+"\n";
                    console.log( datosBinario);
                }else if(tipoInstruccion == 1){
                    // hacer variante para sw y lw
                    if(instruccion[0]=="sw" || instruccion[0]=="lw"){
                        var instruccionSw_LW = instruccion[2].split("(");
                        console.log(instruccionSw_LW);
                        instruccionSw_LW[1] = instruccionSw_LW[1].replace("$","");
                        instruccionSw_LW[1] = instruccionSw_LW[1].replace(")","");
                        var codeOP = codigosInstrucciones.get(instruccion[0]);//op code tipo I
                        codeOP+= completar0Registros(instruccionSw_LW[1]);//base
                        codeOP+= completar0Registros(instruccion[1]);//rt
                        codeOP+= completar0Const(instruccionSw_LW[0]);//const
                        datosBinario+= codeOP.substr(0,8)+"\n";
                        datosBinario+= codeOP.substr(8,8)+"\n";
                        datosBinario+= codeOP.substr(16,8)+"\n";
                        datosBinario+= codeOP.substr(24,8)+"\n";
                    }else{
                        var codeOP = codigosInstrucciones.get(instruccion[0]);//op code tipo I
                        codeOP+= completar0Registros(instruccion[1]);//rs
                        codeOP+= completar0Registros(instruccion[2]);//rt
                        codeOP+= completar0Const(instruccion[3]);//const
                        datosBinario+= codeOP.substr(0,8)+"\n";
                        datosBinario+= codeOP.substr(8,8)+"\n";
                        datosBinario+= codeOP.substr(16,8)+"\n";
                        datosBinario+= codeOP.substr(24,8)+"\n";
                    }
        
                }else if(tipoInstruccion == 2){
                    var codeOP = codigosInstrucciones.get(instruccion[0]);//op code tipo J
                    codeOP+= completar0ConstJ(instruccion[1]);//const J
                    datosBinario+= codeOP.substr(0,8)+"\n";
                    datosBinario+= codeOP.substr(8,8)+"\n";
                    datosBinario+= codeOP.substr(16,8)+"\n";
                    datosBinario+= codeOP.substr(24,8)+"\n";
                }
            }
    
        }
    }

    //console.log( datosBinario);
    if(encontrarErrores()==false){
        document.getElementById("informacionBinaria").value=datosBinario;
        console.log(datosBinario);
        document.getElementById("descargarTXT").disabled=false;
        alert("Decodificacion Exitosa!\n");
    }else{
        var errorMensaje = "Errores encontrados:\n";
        for(i=0; i<Object.keys(errores).length;i++){
            errorMensaje+= errores[Object.keys(errores)[i]]+"\n";
        }
        alert("Hubo un  error en la decodificacion porfavor verifica tu codigo ensamblador.\n\n"+errorMensaje);
    }
    
    
}

/* 
    0 = tipo R
    1 = tipo I
    2 = Tipo J
    3 = no disponible
*/ 
function TDI(Op_instruccion, numero){
    if(Op_instruccion == "add" || Op_instruccion == "sub" || Op_instruccion == "mult" || Op_instruccion == "div" || Op_instruccion == "and" || Op_instruccion == "or" || Op_instruccion == "slt" || Op_instruccion == "nop" ){
        return 0;
    }else if(Op_instruccion == "andi" || Op_instruccion == "addi" || Op_instruccion == "lw" || Op_instruccion == "sw" || Op_instruccion == "ori" || Op_instruccion == "beq" || Op_instruccion == "slti" || Op_instruccion == "bgtz" || Op_instruccion == "bne" ){
        return 1;
    }else if(Op_instruccion == "j"){
        return 2;
    }else{
        return 3;
    }
}


$('#informacionEnsamblador').scroll(function(){ 
    $('#nlTA_Ensamblador').scrollTop($(this).scrollTop());  
}) 


function numLineas(){
    var codigo = document.getElementById("informacionEnsamblador").value;
    var instrucciones = codigo.split("\n");
    var numeros="";
    var classP = document.getElementsByClassName("numeroLinea");
    for (var i = 0; i < instrucciones.length; i++){
        var i2 = i+1;
        var styleP="";
        var titleP="";
        if(classP[i]!=undefined){
            if(classP[i].title!=""){
                styleP = "color: white; background: #dc3545; margin-bottom: 0";
                titleP = classP[i].title;
            }
        }
        numeros=numeros+"<p class='numeroLinea' style='"+styleP+"' title='"+titleP+"'>"+i2+"</p>";
    }
    document.getElementById("nlTA_Ensamblador").innerHTML=numeros;
    var heighScroll = document.getElementById("informacionEnsamblador").scrollHeight;
    $('#informacionEnsamblador').scrollTop(heighScroll); 
    encontrarErrores();
}

function encontrarErrores(){
    var banderaRetorno = true;
    var lineas = document.getElementsByClassName("numeroLinea");
    var codigo = document.getElementById("informacionEnsamblador").value;
    var instrucciones = codigo.split("\n");
    for (var i = 0; i < instrucciones.length; i++){
        var instruccion = instrucciones[i].split(" ");
        var tipoInstruccion = TDI(instruccion[0].toLowerCase(),i+1);
        var numeroError = i+1;
        if(tipoInstruccion ==3){
             //hubo error en la instruccion (add, ori, etc.)
             lineas[i].style = "color: white; background: #dc3545; margin-bottom: 0";
             lineas[i].title = "La instruccion en la linea: ( "+numeroError+" ) no es decodificable en este decodificador. Puede estar incorrecta o no es una de las agregadas en nuestro codigo fuente. (Ver instrucciones disponibles en la parte inferior)\n";
             errores[i]="La instruccion en la linea: ( "+numeroError+" ) no es decodificable en este decodificador. Puede estar incorrecta o no es una de las agregadas en nuestro codigo fuente. (Ver instrucciones disponibles en la parte inferior)\n";

            
           
        }else{



            if(tipoInstruccion == 0){
                if(instruccion.length<4){
                    lineas[i].style = "color: white; background: #856404; margin-bottom: 0";
                    lineas[i].title = "La instruccion de tipo R en la linea: ( "+numeroError+" ) es incorrecta debido a que le faltan elementos. Debe tener 4 siguiendo la siguiente sintaxis: instR $X, $X, $X\n";
                    errores[i]="La instruccion de tipo R en la linea: ( "+numeroError+" ) es incorrecta debido a que le faltan elementos. Debe tener 4 siguiendo la siguiente sintaxis: instR $X, $X, $X\n";
                }else if(instruccion.length>4){
                    lineas[i].style = "color: white; background: rgb(133 69 4);margin-bottom: 0";
                    lineas[i].title = "La instruccion de tipo R en la linea: ( "+numeroError+" ) es incorrecta debido a que le sobran elementos. Debe tener 4 siguiendo la siguiente sintaxis: instR $X, $X, $X\n";
                    errores[i]="La instruccion de tipo R en la linea: ( "+numeroError+" ) es incorrecta debido a que le sobran elementos. Debe tener 4 siguiendo la siguiente sintaxis: instR $X, $X, $X\n";
                }else{
                    lineas[i].style = "";
                    lineas[i].title = "";
                    if(errores[i]!=undefined){
                        delete errores[i]
                    }
                    banderaRetorno = false;
                }
                
            }else if(tipoInstruccion == 1){
                // hacer variante para sw y lw
                if(instruccion[0]=="sw" || instruccion[0]=="lw"){
                    if(instruccion.length<3){
                        lineas[i].style = "color: white; background: #856404; margin-bottom: 0";
                        lineas[i].title = "La instruccion sw o lw de tipo I en la linea: ( "+numeroError+" ) es incorrecta debido a que le faltan elementos. Debe tener 3 siguiendo la siguiente sintaxis: instI $X, CONST($X)\n";
                        errores[i]="La instruccion sw o lw de tipo I en la linea: ( "+numeroError+" ) es incorrecta debido a que le faltan elementos. Debe tener 3 siguiendo la siguiente sintaxis: instI $X, CONST($X)\n";
                    }else if(instruccion.length>3){
                        lineas[i].style = "color: white; background: rgb(133 69 4);margin-bottom: 0";
                        lineas[i].title = "La instruccion sw o lw de tipo I en la linea: ( "+numeroError+" ) es incorrecta debido a que le sobran elementos. Debe tener 3 siguiendo la siguiente sintaxis: instI $X, CONST($X)\n";
                        errores[i]="La instruccion sw o lw de tipo I en la linea: ( "+numeroError+" ) es incorrecta debido a que le sobran elementos. Debe tener 3 siguiendo la siguiente sintaxis: instI $X, CONST($X)\n";
                    }else{
                        if(instruccion[2].split("(").length!=2){
                            lineas[i].style = "color: white; background: rgb(133 69 4);margin-bottom: 0";
                            lineas[i].title = "La instruccion sw o lw de tipo I en la linea: ( "+numeroError+" ) es incorrecta debido a que el tercer elemento cuenta con menos o mas de dos elementos divididoes entre parentesis. Debe tener solo 2 siendo una la constante y la otra el numero de un registro siguiendo la siguiente sintaxis: CONST($X)\n";
                            errores[i]= "La instruccion sw o lw de tipo I en la linea: ( "+numeroError+" ) es incorrecta debido a que el tercer elemento cuenta con menos o mas de dos elementos divididoes entre parentesis. Debe tener solo 2 siendo una la constante y la otra el numero de un registro siguiendo la siguiente sintaxis: CONST($X)\n";
                        }else{
                            lineas[i].style = "";
                            lineas[i].title = "";
                            if(errores[i]!=undefined){
                                delete errores[i]
                            }
                            banderaRetorno = false;
                        }
                    }
                }else{
                    if(instruccion.length<4){
                        lineas[i].style = "color: white; background: #856404; margin-bottom: 0";
                        lineas[i].title = "La instruccion de tipo I en la linea: ( "+numeroError+" ) es incorrecta debido a que le faltan elementos. Debe tener 4 siguiendo la siguiente sintaxis: instI $X, $X, CONST\n";
                        errores[i]="La instruccion de tipo I en la linea: ( "+numeroError+" ) es incorrecta debido a que le faltan elementos. Debe tener 4 siguiendo la siguiente sintaxis: instI $X, $X, CONST\n";
                    }else if(instruccion.length>4){
                        lineas[i].style = "color: white; background: rgb(133 69 4);margin-bottom: 0";
                        lineas[i].title = "La instruccion de tipo I en la linea: ( "+numeroError+" ) es incorrecta debido a que le sobran elementos. Debe tener 4 siguiendo la siguiente sintaxis: instI $X, $X, CONST\n";
                        errores[i]="La instruccion de tipo I en la linea: ( "+numeroError+" ) es incorrecta debido a que le sobran elementos. Debe tener 4 siguiendo la siguiente sintaxis: instI $X, $X, CONST\n";
                    }else{
                        lineas[i].style = "";
                        lineas[i].title = "";
                        if(errores[i]!=undefined){
                            delete errores[i]
                        }
                        banderaRetorno = false;
                    }
                }
    
            }else if(tipoInstruccion == 2){
                if(instruccion.length<2){
                    lineas[i].style = "color: white; background: #856404; margin-bottom: 0";
                    lineas[i].title = "La instruccion de tipo J en la linea: ( "+numeroError+" ) es incorrecta debido a que le faltan elementos. Debe tener 2 siguiendo la siguiente sintaxis: instJ $X\n";
                    errores[i]="La instruccion de tipo J en la linea: ( "+numeroError+" ) es incorrecta debido a que le faltan elementos. Debe tener 2 siguiendo la siguiente sintaxis: instJ $X\n";
                }else if(instruccion.length>2){
                    lineas[i].style = "color: white; background: rgb(133 69 4);margin-bottom: 0";
                    lineas[i].title = "La instruccion de tipo J en la linea: ( "+numeroError+" ) es incorrecta debido a que le sobran elementos. Debe tener 2 siguiendo la siguiente sintaxis: instJ $X\n";
                    errores[i]="La instruccion de tipo J en la linea: ( "+numeroError+" ) es incorrecta debido a que le sobran elementos. Debe tener 2 siguiendo la siguiente sintaxis: instJ $X\n";
                }else{
                    lineas[i].style = "";
                    lineas[i].title = "";
                    if(errores[i]!=undefined){
                        delete errores[i]
                    }
                    banderaRetorno = false;
                }
            }
        }
        
    }
    if(Object.keys(errores).length>0){
        banderaRetorno=true
    }
    return banderaRetorno;
}

function completar0Registros(instruccion){
    instruccion = instruccion.replace(",","");
    instruccion = instruccion.replace("$","");
    instruccion = parseInt(instruccion);
    instruccion = instruccion.toString(2);
    var binario="";
    if(instruccion.length<5){
        var cantidad = 5-instruccion.length;
        for (let i = 0; i < cantidad; i++) {
            binario+="0";
        }
        binario+=instruccion;
        return binario; 
    }else if(instruccion.length==5){
        return instruccion; 
    }else{
        alert("Error el registro solo puede tener valores de 5 bits");
    }
}


function completar0Const(instruccion){
    instruccion = instruccion.replace(",","");
    instruccion = instruccion.replace("$","");
    instruccion = parseInt(instruccion);
    instruccion = instruccion.toString(2);
    var binario="";
    if(instruccion.length<16){
        var cantidad = 16-instruccion.length;
        for (let i = 0; i < cantidad; i++) {
            binario+="0";
        }
        binario+=instruccion;
        return binario; 
    }else if(instruccion.length==16){
        return instruccion; 
    }else{
        alert("Error el valor de CONST solo puede tener valores de 16 bits");
    }
}


function completar0ConstJ(instruccion){
    instruccion = instruccion.replace(",","");
    instruccion = instruccion.replace("$","");
    instruccion = parseInt(instruccion);
    instruccion = instruccion.toString(2);
    var binario="";
    if(instruccion.length<26){
        var cantidad = 26-instruccion.length;
        for (let i = 0; i < cantidad; i++) {
            binario+="0";
        }
        binario+=instruccion;
        return binario; 
    }else if(instruccion.length==26){
        return instruccion; 
    }else{
        alert("Error el valor de CONST solo puede tener valores de 26 bits");
    }
}

function download(filename) {
    var element = document.createElement('a');
    var text = document.getElementById("informacionBinaria").value;
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

  function abrirIMGIns(){
      document.getElementById("contenedorIMGInstrucciones").style.setProperty("display","flex");
  }

  function cerrarIMGIns(){
    document.getElementById("contenedorIMGInstrucciones").style.setProperty("display","none");
}