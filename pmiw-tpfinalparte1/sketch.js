// ===================== VARIABLES GLOBALES =====================

//link al video:https://youtu.be/jlMrOCoOq2c

let imgMenu;           // Imagen de fondo del menú
let fuenteTitulo;      // Fuente Rye para títulos
let fuenteBotones;     // Fuente Oswald para textos
let sonidoViento;      // Sonido de fondo del viento
let sonidoTeclado;     // Sonido al pasar por los botones
let sonidoLluvia;      // Sonido de lluvia en la escena de la calle
let botonAnterior = -1; // Para que el sonido no se repita en cada frame
let pantallaActual = "menu"; // Estado de la pantalla
let imagenesRetratos = {}; // Objeto para guardar las imágenes de los retratos
let imagenCajon;       // Imagen del cajón abierto
let imagenHoja;        // Imagen de la carta
let vistaObjeto = null; // Indica qué objeto estamos mirando de cerca

// Para saber qué objetos de la escena 3 ya fueron revisados
let objetosRevisados = { cajon: false, silla: false, cajafuerte: false }; 

// Vistas simples (silla y caja fuerte)
let vistasSimples = {
  silla: { imagen: null, texto: "Hay una mancha oscura en el respaldo... podría ser sangre. Habría que analizarla." },
  cajafuerte: { imagen: null, texto: "Al parecer no quisieron abrir la caja fuerte... o no sabían el código." }
};

// Botones del menú principal
let botonesMenu = [
  { texto: "INICIAR",     x: 40, y: 240, destino: "intro" },
  { texto: "DESCRIPCIÓN", x: 40, y: 285, destino: "descripcion" },
  { texto: "CRÉDITOS",    x: 40, y: 330, destino: "creditos" },
  { texto: "SALIR",       x: 40, y: 375, destino: "salir" }
];

// Botón de volver para pantallas secundarias
let botonVolver = [{ texto: "◀ VOLVER", x: 40, y: 390, destino: "menu" }]; 

// Texto de la escena introductoria
let textoIntro = "Nueva York, 1954. Una madrugada de lluvia. John Davis recibe un llamado: Ricardo Alonso, dueño de una inmobiliaria, apareció muerto en su oficina. Un presunto suicidio que no termina de cerrar.";
let letrasIntro = 0; 

// Arreglo para cargar las imágenes de las escenas del juego
let imagenesEscenas = [];

// Escenas del juego (Arreglo de Objetos con ramificaciones)
let escenas = [
  { // 0
    archivo: 'escenas/pantalla1.png',
    texto: "Sos John Davis. Llegás bajo la lluvia al edificio donde apareció muerto Ricardo Alonso, un empresario. Un policía te espera en la puerta.",
    tieneLluvia: true,
    hablante: "",
    opciones: [ { texto: "Hablar con el policía", x: 520, y: 160, siguiente: 1 } ]
  },
  { // 1
    archivo: 'escenas/policia.png',
    texto: "El cuerpo está en el noveno piso, detective. Ya está todo despejado, puede subir a investigar.",
    tieneLluvia: true,
    hablante: "policia",
    opciones: [ { texto: "Entrar al edificio", x: 235, y: 390, siguiente: 2 } ]
  },
  { // 2
    archivo: 'escenas/abriendopuerta.png',
    texto: "Llegás a la puerta de la oficina de Ricardo Alonso. Está entreabierta.",
    tieneLluvia: false,
    hablante: "",
    opciones: [ { texto: "Abrir la puerta", x: 35, y: 390, siguiente: 3 } ]
  },
  { // 3
    archivo: 'escenas/pantalla2.png',
    texto: "Entrás a la oficina. La policía ya marcó la escena: el contorno de tiza en el piso señala dónde encontraron a Ricardo Alonso. Carteles numerados marcan distintos puntos de interés.",
    tieneLluvia: false,
    hablante: "",
    opciones: [], 
    objetos: [
      { texto: "Revisar escritorio", x: 100, y: 200, abre: "cajon" },
      { texto: "Revisar la silla", x: 550, y: 260, abre: "silla" },
      { texto: "Revisar la caja fuerte", x: 610, y: 180, abre: "cajafuerte" }
    ]
  },
  { // 4
    archivo: 'escenas/guardia.png',
    texto: "Bajás a la recepción a hablar con el guardia nocturno. Es el único que estuvo en el edificio toda la noche.",
    tieneLluvia: false,
    hablante: "",
    opciones: [
      { texto: "Preguntarle si vio algo esa noche", x: 35, y: 390, siguiente: 5 }
    ]
  },
  { // 5
    archivo: 'escenas/guardia.png',
    texto: "¿Usted no vio nada, señor? Alguien entrando o saliendo esa noche, lo que sea.",
    tieneLluvia: false,
    hablante: "johndavis",
    opciones: [
      { texto: "Intimidar", x: 235, y: 370, siguiente: 6 },
      { texto: "Preguntarle con calma", x: 235, y: 400, siguiente: 7 }
    ]
  },
  { // 6 - Guardia asustado (tras intimidar) -> Lleva a Laura
    archivo: 'escenas/guardia.png',
    texto: "¡Está bien, habla! Vi a Laura discutiendo con Ricardo horas antes de que se escuchara el disparo...",
    tieneLluvia: false,
    hablante: "guardia",
    opciones: [
      { texto: "Ir a interrogar a Laura", x: 235, y: 390, siguiente: 8 }
    ]
  },
  { // 7 - Guardia calmo (tras preguntar con calma) -> Lleva a Martín
    archivo: 'escenas/guardia.png',
    texto: "Bueno, mire... vi a Martín salir con apuro de la oficina esa misma noche, parecía muy alterado.",
    tieneLluvia: false,
    hablante: "guardia",
    opciones: [
      { texto: "Ir a interrogar a Martín", x: 235, y: 390, siguiente: 10 }
    ]
  },
  { // 8 - Interrogatorio Laura (Diálogo 1)
    archivo: 'escenas/laura.png',
    texto: "Laura, ¿Cuándo fue la última vez que lo vio al señor Ricardo?",
    tieneLluvia: false,
    hablante: "johndavis",
    opciones: [
      { texto: "Siguiente", x: 235, y: 390, siguiente: 9 }
    ]
  },
  { // 9 - Interrogatorio Laura (Diálogo 2)
    archivo: 'escenas/laura.png',
    texto: "Vi a Ricardo por última vez en la oficina de Martín, hablando de negocios.",
    tieneLluvia: false,
    hablante: "laura",
    opciones: [
      { texto: "Inspeccionar placard de Laura", x: 235, y: 370, siguiente: 12 },
      { texto: "Interrogar a Martín", x: 235, y: 400, siguiente: 10 }
    ]
  },
  { // 10 - Interrogatorio Martín (Diálogo 1)
    archivo: 'escenas/martin.png',
    texto: "Martín, ¿Qué sabe usted del señor Ricardo?",
    tieneLluvia: false,
    hablante: "johndavis",
    opciones: [
      { texto: "Siguiente", x: 235, y: 390, siguiente: 11 }
    ]
  },
  { // 11 - Interrogatorio Martín (Diálogo 2)
    archivo: 'escenas/martin.png',
    texto: "Fui el último en ver a Ricardo. Pidió una reunión para cerrar unos asuntos laborales.",
    tieneLluvia: false,
    hablante: "martin",
    opciones: [
      { texto: "Revisar auto de Martín", x: 235, y: 370, siguiente: 13 },
      { texto: "Interrogar a Laura", x: 235, y: 400, siguiente: 8 }
    ]
  },
  { // 12 - Placard de Laura
    archivo: 'escenas/placar.png',
    texto: "El pañuelo parece ser de Laura.",
    tieneLluvia: false,
    hablante: "johndavis",
    opciones: [
      { texto: "Acusar a Laura", x: 235, y: 400, siguiente: 14 },
      { texto: "Interrogar a Martín", x: 360, y: 400, siguiente: 10 },
      { texto: "Esperar", x: 520, y: 400, siguiente: 15 }
    ]
  },
  { // 13 - Baúl del auto de Martín
    archivo: 'escenas/baul.jpeg',
    texto: "Encontrás el baúl de Martín con el pañuelo rojo con sangre.",
    tieneLluvia: false,
    hablante: "johndavis",
    opciones: [
      { texto: "Acusar a Martín", x: 235, y: 370, siguiente: 16 },
      { texto: "Acusar a Laura", x: 235, y: 400, siguiente: 14 }
    ]
  },
  { // 14 - FINAL MALO (Acusar a Laura)
    archivo: 'escenas/finalmalo.jpeg',
    texto: "Acusaste a Laura de que ella mató a Ricardo Alonso.",
    tieneLluvia: false,
    hablante: "",
    opciones: [ { texto: "Volver al menú principal", x: 235, y: 390, siguiente: 0 } ]
  },
  { // 15 - FINAL ALTERNATIVO (Esperar en el placard)
    archivo: 'escenas/finalalternativo.jpeg',
    texto: "Martín se escapó y al final él era el asesino.",
    tieneLluvia: false,
    hablante: "",
    opciones: [ { texto: "Volver al menú principal", x: 235, y: 390, siguiente: 0 } ]
  },
  { // 16 - FINAL BUENO (Acusar a Martín)
    archivo: 'escenas/finalbueno.jpeg',
    texto: "Acusaste a Martín de haber asesinado a Ricardo Alonso.",
    tieneLluvia: false,
    hablante: "",
    opciones: [ { texto: "Volver al menú principal", x: 235, y: 390, siguiente: 0 } ]
  }
];

let escenaActual = 0;   
let letrasMostradas = 0; 

function preload() {
  // Carga de imágenes principales y fuentes
  imgMenu = loadImage('escenas/menuinicial.png');
  fuenteTitulo = loadFont('fuentes/Rye-Regular.ttf');
  fuenteBotones = loadFont('fuentes/Oswald-VariableFont_wght.ttf');
  sonidoViento = loadSound('sonidos/viento.wav');
  sonidoTeclado = loadSound('sonidos/teclado.wav');
  sonidoLluvia = loadSound('sonidos/lluvia.mp3');

  // Retratos
  imagenesRetratos["policia"] = loadImage('escenas/policiamsj.png');
  imagenesRetratos["johndavis"] = loadImage('escenas/john.png');
  imagenesRetratos["guardia"] = loadImage('escenas/guardiamsj.png');
  imagenesRetratos["laura"] = loadImage('escenas/lauramsj.png');
  imagenesRetratos["martin"] = loadImage('escenas/martinmsj.png');

  // Inspecciones de la escena del crimen
  imagenCajon = loadImage('escenas/cajon.png');
  imagenHoja = loadImage('escenas/hojavacia.jpeg');
  vistasSimples.silla.imagen = loadImage('escenas/silla.png');
  vistasSimples.cajafuerte.imagen = loadImage('escenas/cajafuerte.png');

  // Carga de los fondos de todas las escenas
  for (let i = 0; i < escenas.length; i++) {
    imagenesEscenas[i] = loadImage(escenas[i].archivo);
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

function dibujarMenu() {
  image(imgMenu, 0, 0, 800, 450);
  textFont(fuenteTitulo);
  fill(230, 220, 200);
  textAlign(LEFT, TOP);
  textSize(48);
  text("SILENCIO", 40, 50);
  text("ROJO", 40, 100);
  dibujarBotones(botonesMenu);
}

function dibujarBotones(lista) {
  textFont(fuenteBotones);
  textSize(22);
  let indiceEncima = -1;
  for (let i = 0; i < lista.length; i++) {
    let boton = lista[i];
    let mouseEncima = mouseX > boton.x && mouseX < boton.x + 260 &&
                      mouseY > boton.y && mouseY < boton.y + 35;
    if (mouseEncima) {
      indiceEncima = i;
      fill(242, 163, 58);
      text("▶ " + boton.texto, boton.x, boton.y);
    } else {
      fill(255, 255, 255);
      text(boton.texto, boton.x, boton.y);
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

  dibujarBotones(botonVolver);
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
                      "Docente a cargo: Matias Jauregui Lorda de la comision 2\n\n" +
                      "Generación de imágenes: ChatGPT\n\n" +
                      "¡Gracias por jugar!", 400, 110);

  textAlign(LEFT, TOP);
  dibujarBotones(botonVolver);
}

function dibujarSalir() {
  background(10, 15, 18);
  textFont(fuenteTitulo);
  fill(230, 220, 200);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("Gracias por jugar", 400, 200);
  textAlign(LEFT, TOP);
  dibujarBotones(botonVolver);
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

function algunObjetoRevisado() {
  return objetosRevisados.cajon || objetosRevisados.silla || objetosRevisados.cajafuerte;
}

function todosLosObjetosRevisados() {
  return objetosRevisados.cajon && objetosRevisados.silla && objetosRevisados.cajafuerte;
}

function dibujarEscenaJuego(indice) {
  let datos = escenas[indice];

  if (vistaObjeto === "cajon") {
    dibujarVistaCajon();
    return;
  }
  if (vistaObjeto === "carta") {
    dibujarVistaCarta();
    return;
  }
  if (vistaObjeto === "silla" || vistaObjeto === "cajafuerte") {
    dibujarVistaSimple(vistasSimples[vistaObjeto]);
    return;
  }

  image(imagenesEscenas[indice], 0, 0, 800, 450);

  manejarSonidoAmbiente(datos);
  dibujarCajaDeTexto();          

  if (indice === 3) {
    if (todosLosObjetosRevisados()) {
      dibujarComentarioGuardia();
    } else if (!algunObjetoRevisado()) {
      let anchoRetrato = 0;
      if (datos.hablante && imagenesRetratos[datos.hablante]) {
        anchoRetrato = dibujarRetrato(imagenesRetratos[datos.hablante], 30, 330);
      }
      escribirTextoProgresivo(datos, anchoRetrato);
    }
    dibujarObjetosEscena(datos);
    return;
  }

  let anchoRetrato = 0;
  if (datos.hablante && imagenesRetratos[datos.hablante]) {
    anchoRetrato = dibujarRetrato(imagenesRetratos[datos.hablante], 30, 330);
  }

  escribirTextoProgresivo(datos, anchoRetrato);

  if (letrasMostradas >= datos.texto.length) {
    dibujarOpcionesEscena(datos.opciones);
    dibujarObjetosEscena(datos);
  }
}

function manejarSonidoAmbiente(datos) {
  if (datos.tieneLluvia && !sonidoLluvia.isPlaying()) {
    sonidoLluvia.loop();
  } else if (!datos.tieneLluvia && sonidoLluvia.isPlaying()) {
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

function escribirTextoProgresivo(datos, anchoRetrato) {
  if (frameCount % 2 === 0 && letrasMostradas < datos.texto.length) {
    letrasMostradas++;
  }
  let textoVisible = datos.texto.substring(0, letrasMostradas);
  let xTexto = anchoRetrato > 0 ? (30 + anchoRetrato + 20) : 35;
  let anchoTexto = 780 - xTexto;
  textFont(fuenteBotones);
  fill(230, 220, 200);
  textAlign(LEFT, TOP);
  textSize(16);
  text(textoVisible, xTexto, 345, anchoTexto, 100);
}

function dibujarOpcionesEscena(opciones) {
  textFont(fuenteBotones);
  textSize(16);
  for (let i = 0; i < opciones.length; i++) {
    let opcion = opciones[i];
    let ancho = textWidth(opcion.texto) + 30;
    let mouseEncima = mouseX > opcion.x && mouseX < opcion.x + ancho &&
                       mouseY > opcion.y && mouseY < opcion.y + 30;
    fill(mouseEncima ? color(242, 163, 58) : color(255, 255, 255));
    text((mouseEncima ? "▶ " : "   ") + opcion.texto, opcion.x, opcion.y);
  }
}

function dibujarComentarioGuardia() {
  let anchoRetrato = dibujarRetrato(imagenesRetratos["johndavis"], 30, 330);
  textFont(fuenteBotones);
  fill(230, 220, 200);
  textAlign(LEFT, TOP);
  textSize(16);
  text("Capaz el guardia tendrá algo que decir... habrá visto algo esa noche.", 30 + anchoRetrato + 20, 345, 780 - (30 + anchoRetrato + 20), 40);
  dibujarOpcionesEscena([ { texto: "Hablar con el guardia", x: 30 + anchoRetrato + 20, y: 390, siguiente: 4 } ]);
}

function dibujarObjetosEscena(datos) {
  if (!datos.objetos) return;
  textFont(fuenteBotones);
  textSize(16);
  for (let i = 0; i < datos.objetos.length; i++) {
    let objeto = datos.objetos[i];
    let ancho = textWidth(objeto.texto) + 30;
    let mouseEncima = mouseX > objeto.x && mouseX < objeto.x + ancho &&
                       mouseY > objeto.y && mouseY < objeto.y + 30;
    fill(mouseEncima ? color(242, 163, 58) : color(255, 255, 255));
    text((mouseEncima ? "▶ " : "   ") + objeto.texto, objeto.x, objeto.y);
  }
}

function revisarClickEnObjetos(datos) {
  if (!datos.objetos) return false;
  textSize(16);
  for (let i = 0; i < datos.objetos.length; i++) {
    let objeto = datos.objetos[i];
    let ancho = textWidth(objeto.texto) + 30;
    let dentro = mouseX > objeto.x && mouseX < objeto.x + ancho &&
                 mouseY > objeto.y && mouseY < objeto.y + 30;
    if (dentro) {
      vistaObjeto = objeto.abre;
      if (objetosRevisados.hasOwnProperty(objeto.abre)) {
        objetosRevisados[objeto.abre] = true;
      }
      return true;
    }
  }
  return false;
}

function dibujarVistaCajon() {
  image(imagenCajon, 0, 0, 800, 450);
  dibujarCajaDeTexto();
  let anchoRetrato = dibujarRetrato(imagenesRetratos["johndavis"], 30, 330);
  textFont(fuenteBotones);
  fill(230, 220, 200);
  textAlign(LEFT, TOP);
  textSize(16);
  text("Entre los papeles hay una carta que llama la atención.", 30 + anchoRetrato + 20, 345, 780 - (30 + anchoRetrato + 20), 40);

  dibujarOpcionesEscena([ { texto: "Ver carta", x: 235, y: 390 } ]);
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

  
  dibujarBotonVolverVista();
}

function dibujarVistaSimple(datosVista) {
  image(datosVista.imagen, 0, 0, 800, 450);
  dibujarCajaDeTexto();
  let anchoRetrato = dibujarRetrato(imagenesRetratos["johndavis"], 30, 330);
  textFont(fuenteBotones);
  fill(230, 220, 200);
  textAlign(LEFT, TOP);
  textSize(16);
  text(datosVista.texto, 30 + anchoRetrato + 20, 345, 780 - (30 + anchoRetrato + 20), 100);
  dibujarBotonVolverVista(620, 400);
}

function dibujarBotonVolverVista(x, y) {
  if (x === undefined) x = 30;
  if (y === undefined) y = 400;
  textFont(fuenteBotones);
  textSize(18);
  let mouseEncima = mouseX > x && mouseX < x + 150 && mouseY > y && mouseY < y + 35;
  fill(mouseEncima ? color(242, 163, 58) : color(255, 255, 255));
  text((mouseEncima ? "◀ " : "  ") + "Volver", x, y);
}

function revisarClickEnVuelta(x, y) {
  if (x === undefined) x = 30;
  if (y === undefined) y = 400;
  return mouseX > x && mouseX < x + 150 && mouseY > y && mouseY < y + 35;
}

function mousePressed() {
  if (pantallaActual === "menu") {
    revisarClick(botonesMenu);
  } else if (pantallaActual === "descripcion" || pantallaActual === "creditos" || pantallaActual === "salir") {
    revisarClick(botonVolver);
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
      textSize(16);
      let anchoBoton = textWidth("Ver carta") + 30;
      let mouseEncimaBoton = mouseX > 235 && mouseX < 235 + anchoBoton && mouseY > 390 && mouseY < 420;
      if (mouseEncimaBoton) {
        vistaObjeto = "carta";
      } else if (revisarClickEnVuelta(620, 400)) {
        vistaObjeto = null;
      }
      return;
    }
    if (vistaObjeto === "carta") {
      if (revisarClickEnVuelta()) {
        vistaObjeto = "cajon";
      }
      return;
    }
    if (vistaObjeto === "silla" || vistaObjeto === "cajafuerte") {
      if (revisarClickEnVuelta(620, 400)) {
        vistaObjeto = null;
      }
      return;
    }

    let datos = escenas[escenaActual];
    if (letrasMostradas < datos.texto.length) {
      letrasMostradas = datos.texto.length;
    } else {
      let tocoObjeto = revisarClickEnObjetos(datos);
      if (!tocoObjeto) {
        if (escenaActual === 3 && todosLosObjetosRevisados()) {
          let anchoRetrato = calcularAnchoRetrato(imagenesRetratos["johndavis"]);
          revisarClickEnOpciones([ { texto: "Hablar con el guardia", x: 30 + anchoRetrato + 20, y: 390, siguiente: 4 } ]);
        } else {
          revisarClickEnOpciones(datos.opciones);
        }
      }
    }
  }
}

function revisarClick(lista) {
  for (let i = 0; i < lista.length; i++) {
    let boton = lista[i];
    let dentro = mouseX > boton.x && mouseX < boton.x + 260 &&
                 mouseY > boton.y && mouseY < boton.y + 35;
    if (dentro) {
      if (boton.destino === "menu") {
        escenaActual = 0;
        letrasMostradas = 0;
        objetosRevisados = { cajon: false, silla: false, cajafuerte: false };
      }
      pantallaActual = boton.destino;
    }
  }
}

function revisarClickEnOpciones(opciones) {
  textSize(16);
  for (let i = 0; i < opciones.length; i++) {
    let opcion = opciones[i];
    let ancho = textWidth(opcion.texto) + 30;
    let dentro = mouseX > opcion.x && mouseX < opcion.x + ancho &&
                 mouseY > opcion.y && mouseY < opcion.y + 30;
    if (dentro) {
      if (opcion.siguiente === 0) {
        pantallaActual = "menu";
        escenaActual = 0;
        letrasMostradas = 0;
        objetosRevisados = { cajon: false, silla: false, cajafuerte: false };
      } else {
        escenaActual = opcion.siguiente;
        letrasMostradas = 0;
      }
    }
  }
}