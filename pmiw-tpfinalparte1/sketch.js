
//   PARTE DE IVANN: la lógica del juego    
//video parte 1
 //https://www.youtube.com/watch?v=utnrC11QaxM
       
//   escena, las opciones, los clicks y cómo se reinicia todo.       


// ============== VARIABLES GLOBALES ===


let imgMenu;           
let fuenteTitulo;    
let fuenteBotones;     
let sonidoViento;      
let sonidoTeclado;     
let sonidoLluvia;      
let botonAnterior = -1; 
let pantallaActual = "menu"; 

// Retratos de los personajes (uno por variable)

let retratoPolicia;
let retratoJohn;
let retratoGuardia;
let retratoLaura;
let retratoMartin;

let imagenCajon;      
let imagenHoja;        
let imagenSilla;       
let imagenCajaFuerte;  
let vistaObjeto = "";  

// Para saber qué objetos de la escena 3 ya fueron revisados

let revisadoCajon = false;
let revisadoSilla = false;
let revisadoCajaFuerte = false;

// Para saber a quién ya interrogamos (así el interrogatorio no da vueltas en círculo)

let lauraInterrogada = false;
let martinInterrogado = false;

// Textos de las vistas simples
let textoSilla = "Hay una mancha oscura en el respaldo... podría ser sangre. Habría que analizarla.";
let textoCajaFuerte = "Al parecer no quisieron abrir la caja fuerte... o no sabían el código.";

// Botones del menú principal (arreglos paralelos: la posición 0 de cada uno es el primer botón)

let menuTexto = ["INICIAR", "DESCRIPCIÓN", "CRÉDITOS", "SALIR"];
let menuX = [40, 40, 40, 40];
let menuY = [240, 285, 330, 375];
let menuDestino = ["intro", "descripcion", "creditos", "salir"];

// Botón de volver para pantallas secundarias

let volverTexto = ["◀ VOLVER"];
let volverX = [40];
let volverY = [390];
let volverDestino = ["menu"];

// Texto de la escena introductoria

let textoIntro = "Nueva York, 1954. Una madrugada de lluvia. John Davis recibe un llamado: Ricardo Alonso, dueño de una inmobiliaria, apareció muerto en su oficina. Un presunto suicidio que no termina de cerrar.";
let letrasIntro = 0;

// ===== DATOS DE LAS ESCENAS ============
// Cada dato de la escena i está en la posición i de cada arreglo.

// Imagen de fondo de cada escena

let archivosEscenas = [
  'escenas/pantalla1.png',        
  'escenas/policia.png',          
  'escenas/abriendopuerta.png',   
  'escenas/pantalla2.png',        
  'escenas/guardia.png',          
  'escenas/guardia.png',          
  'escenas/guardia.png',          
  'escenas/guardia.png',          
  'escenas/laura.png',            
  'escenas/laura.png',            
  'escenas/martin.png',           
  'escenas/martin.png',           
  'escenas/placar.png',          
  'escenas/baul.jpeg',            
  'escenas/finalmalo.jpeg',       
  'escenas/finalalternativo.jpeg',
  'escenas/finalbueno.jpeg'       
];

// Texto que se escribe en cada escena

let textosEscenas = [
  "Sos John Davis. Llegás bajo la lluvia al edificio donde apareció muerto Ricardo Alonso, un empresario. Un policía te espera en la puerta.", 
  "El cuerpo está en el noveno piso, detective. Ya está todo despejado, puede subir a investigar.",                                          
  "Llegás a la puerta de la oficina de Ricardo Alonso. Está entreabierta.",                                                                
  "Entrás a la oficina. La policía ya marcó la escena: el contorno de tiza en el piso señala dónde encontraron a Ricardo Alonso. Carteles numerados marcan distintos puntos de interés.", 
  "Bajás a la recepción a hablar con el guardia nocturno. Es el único que estuvo en el edificio toda la noche.",                            
  "¿Usted no vio nada, señor? Alguien entrando o saliendo esa noche, lo que sea.",                                                           
  "¡Está bien, habla! Vi a Laura discutiendo con Ricardo horas antes de que se escuchara el disparo...",                                   
  "Bueno, mire... vi a Martín salir con apuro de la oficina esa misma noche, parecía muy alterado.",                                         
  "Laura, ¿Cuándo fue la última vez que lo vio al señor Ricardo?",                                                                         
  "Vi a Ricardo por última vez en la oficina de Martín, hablando de negocios.",                                                              
  "Martín, ¿Qué sabe usted del señor Ricardo?",                                                                                              
  "Fui el último en ver a Ricardo. Pidió una reunión para cerrar unos asuntos laborales.",                                                   
  "El pañuelo parece ser de Laura.",                                                                                                         
  "Encontrás el baúl de Martín con el pañuelo rojo con sangre.",                                                                             
  "Acusaste a Laura de que ella mató a Ricardo Alonso.",                                                                                     
  "Martín se escapó y al final él era el asesino.",                                                                                          
  "Acusaste a Martín de haber asesinado a Ricardo Alonso."                                                                                   
];

// ¿Suena la lluvia en esa escena?


let lluviaEscenas = [
  true,  
  true,  
  false, 
  false, 
  false, 
  false, 
  false, 
  false, 
  false, 
  false, 
  false, 
  false, 
  false, 
  false, 
  false, 
  false, 
  false  
];

   // Quién habla en cada escena ( nadie, no se dibuja retrato)


let hablantesEscenas = [
  "",         
  "policia",   
  "",          
  "",          
  "",          
  "johndavis", 
  "guardia",   
  "guardia",   
  "johndavis", 
  "laura",     
  "johndavis", 
  "martin",    
  "johndavis", 
  "johndavis", 
  "",          
  "",         
  ""          
];

// Arreglo para guardar las imágenes de fondo de las escenas

let imagenesEscenas = [];

// <<<< OPCIONES (botones de elegir) <<<<


// La opción número k está en la posición k de los cinco arreglos siguientes.

// opcionEscena[k] dice en qué escena aparece, y opcionSiguiente[k] a qué escena lleva.

let opcionEscena = [0, 1, 2, 4, 5, 5, 6, 7, 8, 9, 9, 10, 11, 11, 12, 12, 12, 13, 13, 14, 15, 16];
let opcionTexto = [
  "Hablar con el policía",             // escena 0
  "Entrar al edificio",                // escena 1
  "Abrir la puerta",                   // escena 2
  "Preguntarle si vio algo esa noche", // escena 4
  "Intimidar",                         // escena 5
  "Preguntarle con calma",             // escena 5
  "Ir a interrogar a Laura",           // escena 6
  "Ir a interrogar a Martín",          // escena 7
  "Siguiente",                         // escena 8
  "Inspeccionar placard de Laura",     // escena 9
  "Interrogar a Martín",               // escena 9
  "Siguiente",                         // escena 10
  "Revisar auto de Martín",            // escena 11
  "Interrogar a Laura",                // escena 11
  "Acusar a Laura",                    // escena 12
  "Interrogar a Martín",               // escena 12
  "Esperar",                           // escena 12
  "Acusar a Martín",                   // escena 13
  "Acusar a Laura",                    // escena 13
  "Volver al menú principal",          // escena 14
  "Volver al menú principal",          // escena 15
  "Volver al menú principal"           // escena 16
];
let opcionX = [520, 235, 35, 35, 235, 235, 235, 235, 235, 235, 235, 235, 235, 235, 235, 360, 520, 235, 235, 235, 235, 235];
let opcionY = [160, 390, 390, 390, 370, 400, 390, 390, 390, 370, 400, 390, 370, 400, 400, 400, 400, 370, 400, 390, 390, 390];
let opcionSiguiente = [1, 2, 3, 5, 6, 7, 8, 10, 9, 12, 10, 11, 13, 8, 14, 10, 15, 16, 14, 0, 0, 0];

// <<<< OBJETOS PARA REVISAR (escena 3) <<<<

    // El objeto número k está en la posición k de los cuatro arreglos.



let objetoTexto = ["Revisar escritorio", "Revisar la silla", "Revisar la caja fuerte"];
let objetoX = [100, 550, 610];
let objetoY = [200, 260, 180];
let objetoAbre = ["cajon", "silla", "cajafuerte"];

let escenaActual = 0;
let letrasMostradas = 0;

// ====== PRELOAD Y SETUP ==========

function preload() {

        // Carga de imágenes principales y fuentes

  imgMenu = loadImage('escenas/menuinicial.png');
  fuenteTitulo = loadFont('fuentes/Rye-Regular.ttf');
  fuenteBotones = loadFont('fuentes/Oswald-VariableFont_wght.ttf');
  sonidoViento = loadSound('sonidos/viento.wav');
  sonidoTeclado = loadSound('sonidos/teclado.wav');
  sonidoLluvia = loadSound('sonidos/lluvia.mp3');

  // Retratos
  retratoPolicia = loadImage('escenas/policiamsj.png');
  retratoJohn = loadImage('escenas/john.png');
  retratoGuardia = loadImage('escenas/guardiamsj.png');
  retratoLaura = loadImage('escenas/lauramsj.png');
  retratoMartin = loadImage('escenas/martinmsj.png');

      // Inspecciones de la escena del crimen


  imagenCajon = loadImage('escenas/cajon.png');
  imagenHoja = loadImage('escenas/hojavacia.jpeg');
  imagenSilla = loadImage('escenas/silla.png');
  imagenCajaFuerte = loadImage('escenas/cajafuerte.png');

     // Carga de los fondos de todas las escenas

  for (let i = 0; i < archivosEscenas.length; i++) {
    imagenesEscenas[i] = loadImage(archivosEscenas[i]);
  }
}

function setup() {
  createCanvas(800, 450);
  sonidoViento.setVolume(0.3);
  sonidoViento.loop();
  sonidoLluvia.setVolume(0.4);
}

function draw() {
  if (pantallaActual === "menu") {
    dibujarMenu();
  } else if (pantallaActual === "descripcion") {
    dibujarDescripcion();
  } else if (pantallaActual === "creditos") {
    dibujarCreditos();
  } else if (pantallaActual === "salir") {
    dibujarSalir();
  } else if (pantallaActual === "intro") {
    dibujarIntro();
  } else if (pantallaActual === "juego") {
    dibujarEscenaJuego(escenaActual);
  }
}

// <<<< ARMADO DE LA ESCENA (lógica) <<<<

function algunObjetoRevisado() {
  return revisadoCajon || revisadoSilla || revisadoCajaFuerte;
}

function todosLosObjetosRevisados() {
  return revisadoCajon && revisadoSilla && revisadoCajaFuerte;
}

// Devuelve la imagen del retrato según el nombre del hablante

function retratoDe(nombre) {
  if (nombre === "policia") {
    return retratoPolicia;
  } else if (nombre === "johndavis") {
    return retratoJohn;
  } else if (nombre === "guardia") {
    return retratoGuardia;
  } else if (nombre === "laura") {
    return retratoLaura;
  } else if (nombre === "martin") {
    return retratoMartin;
  }
  return null;
}

function dibujarEscenaJuego(indice) {
  if (vistaObjeto === "cajon") {
    dibujarVistaCajon();
    return;
  }
  if (vistaObjeto === "carta") {
    dibujarVistaCarta();
    return;
  }
  if (vistaObjeto === "silla") {
    dibujarVistaSimple(imagenSilla, textoSilla);
    return;
  }
  if (vistaObjeto === "cajafuerte") {
    dibujarVistaSimple(imagenCajaFuerte, textoCajaFuerte);
    return;
  }

  image(imagenesEscenas[indice], 0, 0, 800, 450);

  manejarSonidoAmbiente(indice);
  dibujarCajaDeTexto();

  let retrato = retratoDe(hablantesEscenas[indice]);
  let anchoRetrato = 0;

  if (indice === 3) {
    if (todosLosObjetosRevisados()) {
      dibujarComentarioGuardia();
    } else if (!algunObjetoRevisado()) {
      if (retrato !== null) {
        anchoRetrato = dibujarRetrato(retrato, 30, 330);
      }
      escribirTextoProgresivo(indice, anchoRetrato);
    }
    dibujarObjetosEscena();
    return;
  }

  if (retrato !== null) {
    anchoRetrato = dibujarRetrato(retrato, 30, 330);
  }

  escribirTextoProgresivo(indice, anchoRetrato);

  if (letrasMostradas >= textosEscenas[indice].length) {
    dibujarOpcionesEscena(indice);
  }
}

// <<<   OPCIONES, OBJETOS Y RECORRIDO (lógica) <<<<

// Dice si el mouse está sobre un texto clickeable

function mouseSobreOpcion(texto, x, y) {
  textSize(16);
  let ancho = textWidth(texto) + 30;
  return mouseX > x && mouseX < x + ancho &&
         mouseY > y && mouseY < y + 30;
}

// Una opción se oculta si lleva a alguien que ya interrogamos.
// Así el jugador no puede ir y venir entre Laura y Martín para siempre.


function opcionVisible(k) {
  if (opcionSiguiente[k] === 8 && lauraInterrogada) {
    return false;
  }
  if (opcionSiguiente[k] === 10 && martinInterrogado) {
    return false;
  }
  return true;
}

function dibujarOpcionesEscena(escena) {
  for (let k = 0; k < opcionEscena.length; k++) {
    if (opcionEscena[k] === escena && opcionVisible(k)) {
      dibujarOpcionSuelta(opcionTexto[k], opcionX[k], opcionY[k]);
    }
  }
}

function revisarClickEnOpciones(escena) {
  for (let k = 0; k < opcionEscena.length; k++) {
    if (opcionEscena[k] === escena && opcionVisible(k)) {
      if (mouseSobreOpcion(opcionTexto[k], opcionX[k], opcionY[k])) {
        irAEscena(opcionSiguiente[k]);
        return;
      }
    }
  }
}

function irAEscena(siguiente) {
  if (siguiente === 0 && escenaActual >= 14) {

    // Al terminar un final se vuelve al menú y se reinicia todo

    reiniciarJuego();
    pantallaActual = "menu";
  } else {
    escenaActual = siguiente;
    letrasMostradas = 0;

    // Guardamos a quién ya interrogamos

    if (siguiente === 8) {
      lauraInterrogada = true;
    } else if (siguiente === 10) {
      martinInterrogado = true;
    }
  }
}

function reiniciarJuego() {
  escenaActual = 0;
  letrasMostradas = 0;
  letrasIntro = 0;
  vistaObjeto = "";
  revisadoCajon = false;
  revisadoSilla = false;
  revisadoCajaFuerte = false;
  lauraInterrogada = false;
  martinInterrogado = false;
}

function revisarClickEnObjetos() {
  for (let i = 0; i < objetoTexto.length; i++) {
    if (mouseSobreOpcion(objetoTexto[i], objetoX[i], objetoY[i])) {
      vistaObjeto = objetoAbre[i];
      if (objetoAbre[i] === "cajon") {
        revisadoCajon = true;
      } else if (objetoAbre[i] === "silla") {
        revisadoSilla = true;
      } else if (objetoAbre[i] === "cajafuerte") {
        revisadoCajaFuerte = true;
      }
      return true;
    }
  }
  return false;
}

function revisarClickEnVuelta(x, y) {
  return mouseX > x && mouseX < x + 150 && mouseY > y && mouseY < y + 35;
}

// <<<<<<< CLICKS   <<<

function mousePressed() {
  if (pantallaActual === "menu") {
    revisarClick(menuX, menuY, menuDestino);
  } else if (pantallaActual === "descripcion" || pantallaActual === "creditos" || pantallaActual === "salir") {
    revisarClick(volverX, volverY, volverDestino);
  } else if (pantallaActual === "intro") {
    if (letrasIntro < textoIntro.length) {
      letrasIntro = textoIntro.length;
    } else {
      pantallaActual = "juego";
      escenaActual = 0;
      letrasMostradas = 0;
    }
  } else if (pantallaActual === "juego") {
    if (vistaObjeto === "cajon") {
      if (mouseSobreOpcion("Ver carta", 235, 390)) {
        vistaObjeto = "carta";
      } else if (revisarClickEnVuelta(620, 400)) {
        vistaObjeto = "";
      }
      return;
    }
    if (vistaObjeto === "carta") {
      if (revisarClickEnVuelta(30, 400)) {
        vistaObjeto = "cajon";
      }
      return;
    }
    if (vistaObjeto === "silla" || vistaObjeto === "cajafuerte") {
      if (revisarClickEnVuelta(620, 400)) {
        vistaObjeto = "";
      }
      return;
    }

    if (letrasMostradas < textosEscenas[escenaActual].length) {

      // Primer click: se completa el texto de golpe

      letrasMostradas = textosEscenas[escenaActual].length;
    } else if (escenaActual === 3) {
      let tocoObjeto = revisarClickEnObjetos();
      if (!tocoObjeto && todosLosObjetosRevisados()) {
        let anchoRetrato = calcularAnchoRetrato(retratoJohn);
        if (mouseSobreOpcion("Hablar con el guardia", 30 + anchoRetrato + 20, 390)) {
          irAEscena(4);
        }
      }
    } else {
      revisarClickEnOpciones(escenaActual);
    }
  }
}

function revisarClick(xs, ys, destinos) {
  for (let i = 0; i < destinos.length; i++) {
    let dentro = mouseX > xs[i] && mouseX < xs[i] + 260 &&
                 mouseY > ys[i] && mouseY < ys[i] + 35;
    if (dentro) {
      if (destinos[i] === "menu") {
        reiniciarJuego();
      }
      pantallaActual = destinos[i];
    }
  }
}

// FIN DE LA PARTE DE IVÁN <<<

//  PARTE DE ROCÍO: la interfaz y el ambiente                       
//   Pantallas del menú, cómo se ven los textos, retratos, botones,  
//  las vistas de cerca (cajón, carta, silla, caja fuerte) y el     
//  sonido ambiente de lluvia.                                      


// ===================== PANTALLAS DEL MENÚ =====================

function dibujarMenu() {
  image(imgMenu, 0, 0, 800, 450);
  textFont(fuenteTitulo);
  fill(230, 220, 200);
  textAlign(LEFT, TOP);
  textSize(48);
  text("SILENCIO", 40, 50);
  text("ROJO", 40, 100);
  dibujarBotones(menuTexto, menuX, menuY);
}

function dibujarBotones(textos, xs, ys) {
  textFont(fuenteBotones);
  textSize(22);
  let indiceEncima = -1;
  for (let i = 0; i < textos.length; i++) {
    let mouseEncima = mouseX > xs[i] && mouseX < xs[i] + 260 &&
                      mouseY > ys[i] && mouseY < ys[i] + 35;
    if (mouseEncima) {
      indiceEncima = i;
      fill(242, 163, 58);
      text("▶ " + textos[i], xs[i], ys[i]);
    } else {
      fill(255, 255, 255);
      text(textos[i], xs[i], ys[i]);
    }
  }
  if (indiceEncima !== -1 && indiceEncima !== botonAnterior) {
    sonidoTeclado.play();
  }
  botonAnterior = indiceEncima;
}

function dibujarDescripcion() {
  background(18, 30, 35);
  textFont(fuenteTitulo);
  fill(242, 163, 58);
  textAlign(LEFT, TOP);
  textSize(32);
  text("DESCRIPCIÓN", 40, 30);

  textFont(fuenteBotones);
  fill(230, 220, 200);
  textSize(14);
  let historia = "Sos John Davis, un detective privado que se dedica a los casos más difíciles. Ricardo Alonso apareció muerto en su oficina. ¿Vas a descubrir quién miente?\n\nCómo jugar: hacé click en las opciones o zonas interactivas para tomar decisiones.";
  text(historia, 40, 90, 720, 300);

  dibujarBotones(volverTexto, volverX, volverY);
}

function dibujarCreditos() {
  background(18, 30, 35);
  textFont(fuenteTitulo);
  fill(242, 163, 58);
  textAlign(CENTER, TOP);
  textSize(28);
  text("SILENCIO ROJO", 400, 40);

  textFont(fuenteBotones);
  fill(230, 220, 200);
  textSize(16);
  textAlign(CENTER, TOP);
  text("Aventura gráfica de misterio y cine negro.\n\n" +
       "Desarrollado por:\nIvan Lencina(122752/3) y Rocio Arcuri(125514/3)\n\n" +
       "Docente a cargo: Matias Jauregi Lorda de la comision 2\n\n" +
       "Generación de imágenes: ChatGPT\n\n" +
       "¡Gracias por jugar!", 400, 110);

  textAlign(LEFT, TOP);
  dibujarBotones(volverTexto, volverX, volverY);
}

function dibujarSalir() {
  background(10, 15, 18);
  textFont(fuenteTitulo);
  fill(230, 220, 200);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("Gracias por jugar", 400, 200);
  textAlign(LEFT, TOP);
  dibujarBotones(volverTexto, volverX, volverY);
}

function dibujarIntro() {
  background(0);

  if (frameCount % 2 === 0 && letrasIntro < textoIntro.length) {
    letrasIntro++;
  }

  textFont(fuenteBotones);
  fill(230, 220, 200);
  textAlign(CENTER, TOP);
  textSize(18);
  text(textoIntro.substring(0, letrasIntro), 100, 150, 600, 250);

  if (letrasIntro >= textoIntro.length) {
    fill(242, 163, 58);
    textSize(13);
    text("(click para continuar)", 100, 400, 600, 30);
  }
}

//  AMBIENTE Y CAJA DE TEXTO <<<<

function manejarSonidoAmbiente(indice) {
  if (lluviaEscenas[indice] && !sonidoLluvia.isPlaying()) {
    sonidoLluvia.loop();
  } else if (!lluviaEscenas[indice] && sonidoLluvia.isPlaying()) {
    sonidoLluvia.stop();
  }
}

function dibujarCajaDeTexto() {
  noStroke();
  fill(10, 15, 18, 225);
  rect(20, 330, 760, 110, 18);
}

function calcularAnchoRetrato(retrato) {
  let altoMax = 110;
  return (retrato.width / retrato.height) * altoMax;
}

function dibujarRetrato(retrato, x, yBase) {
  let altoMax = 110;
  let anchoCalculado = calcularAnchoRetrato(retrato);
  let y = yBase - 20;
  image(retrato, x, y, anchoCalculado, altoMax);
  noFill();
  stroke(242, 163, 58);
  strokeWeight(2);
  rect(x, y, anchoCalculado, altoMax, 10);
  noStroke();
  return anchoCalculado;
}

function escribirTextoProgresivo(indice, anchoRetrato) {
  let texto = textosEscenas[indice];
  if (frameCount % 2 === 0 && letrasMostradas < texto.length) {
    letrasMostradas++;
  }
  let textoVisible = texto.substring(0, letrasMostradas);
  let xTexto = anchoRetrato > 0 ? (30 + anchoRetrato + 20) : 35;
  let anchoTexto = 780 - xTexto;
  textFont(fuenteBotones);
  fill(230, 220, 200);
  textAlign(LEFT, TOP);
  textSize(16);
  text(textoVisible, xTexto, 345, anchoTexto, 100);
}

//  LO QUE SE VE DE LAS OPCIONES Y OBJETOS <<<<

// Dibuja un texto clickeable (resaltado si el mouse está encima)

function dibujarOpcionSuelta(texto, x, y) {
  textFont(fuenteBotones);
  textSize(16);
  let ancho = textWidth(texto) + 30;
  let mouseEncima = mouseX > x && mouseX < x + ancho &&
                    mouseY > y && mouseY < y + 30;
  fill(mouseEncima ? color(242, 163, 58) : color(255, 255, 255));
  text((mouseEncima ? "▶ " : "   ") + texto, x, y);
}

function dibujarComentarioGuardia() {
  let anchoRetrato = dibujarRetrato(retratoJohn, 30, 330);
  textFont(fuenteBotones);
  fill(230, 220, 200);
  textAlign(LEFT, TOP);
  textSize(16);
  text("Capaz el guardia tendrá algo que decir... habrá visto algo esa noche.", 30 + anchoRetrato + 20, 345, 780 - (30 + anchoRetrato + 20), 40);
  dibujarOpcionSuelta("Hablar con el guardia", 30 + anchoRetrato + 20, 390);
}

function dibujarObjetosEscena() {
  for (let i = 0; i < objetoTexto.length; i++) {
    dibujarOpcionSuelta(objetoTexto[i], objetoX[i], objetoY[i]);
  }
}

// VISTAS DE CERCA <<<<

function dibujarVistaCajon() {
  image(imagenCajon, 0, 0, 800, 450);
  dibujarCajaDeTexto();
  let anchoRetrato = dibujarRetrato(retratoJohn, 30, 330);
  textFont(fuenteBotones);
  fill(230, 220, 200);
  textAlign(LEFT, TOP);
  textSize(16);
  text("Entre los papeles hay una carta que llama la atención.", 30 + anchoRetrato + 20, 345, 780 - (30 + anchoRetrato + 20), 40);

  dibujarOpcionSuelta("Ver carta", 235, 390);
  dibujarBotonVolverVista(620, 400);
}

function dibujarVistaCarta() {
  image(imagenCajon, 0, 0, 800, 450);
  fill(0, 0, 0, 150);
  noStroke();
  rect(0, 0, 800, 450);

  let anchoCarta = 420, altoCarta = 320;
  let xCarta = (800 - anchoCarta) / 2;
  let yCarta = (450 - altoCarta) / 2;
  image(imagenHoja, xCarta, yCarta, anchoCarta, altoCarta);

  textFont(fuenteBotones);
  fill(40, 25, 10);
  textAlign(CENTER, TOP);
  textSize(15);
  textLeading(24);
  let textoCarta = "Esta es tu última\n oportunidad.\nAceptá mi oferta\n por la empresa,\no te vas a \narrepentir.\nNo voy a \nesperar más.";
  text(textoCarta, xCarta + 40, yCarta + 75, anchoCarta - 75, altoCarta - 100);
  textAlign(LEFT, TOP);

  dibujarBotonVolverVista(30, 400);
}

function dibujarVistaSimple(imagen, texto) {
  image(imagen, 0, 0, 800, 450);
  dibujarCajaDeTexto();
  let anchoRetrato = dibujarRetrato(retratoJohn, 30, 330);
  textFont(fuenteBotones);
  fill(230, 220, 200);
  textAlign(LEFT, TOP);
  textSize(16);
  text(texto, 30 + anchoRetrato + 20, 345, 780 - (30 + anchoRetrato + 20), 100);
  dibujarBotonVolverVista(620, 400);
}

function dibujarBotonVolverVista(x, y) {
  textFont(fuenteBotones);
  textSize(18);
  let mouseEncima = mouseX > x && mouseX < x + 150 && mouseY > y && mouseY < y + 35;
  fill(mouseEncima ? color(242, 163, 58) : color(255, 255, 255));
  text((mouseEncima ? "◀ " : "  ") + "Volver", x, y);
}


//  FIN DE LA PARTE DE ROCÍO 