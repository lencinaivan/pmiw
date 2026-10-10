let imgMenu;
let fuenteTitulo;
let fuenteBotones;
let sonidoViento;
let sonidoTeclado;
let sonidoLluvia;
let botonAnterior = -1;
let pantallaActual = "menu";
let imagenesRetratos = {}; // diccionario: nombre del personaje (su retrato)
let imagenCajon;
let imagenHoja;
let vistaObjeto = null; // null, "cajon", "carta", "silla" o "cajafuerte": qué se está mostrando encima de la escena principal

let objetosRevisados = { cajon: false, silla: false, cajafuerte: false }; // para saber si ya revisó los 3 objetos de la escena del crimen

let vistasSimples = {
  silla: { imagen: null, texto: "Hay una mancha oscura en el respaldo... podría ser sangre. Habría que analizarla." },
  cajafuerte: { imagen: null, texto: "Al parecer no quisieron abrir la caja fuerte... o no sabían el código." }
};

let botonesMenu = [
  { texto: "INICIAR",     x: 40, y: 240, destino: "intro" },
  { texto: "DESCRIPCIÓN", x: 40, y: 285, destino: "descripcion" },
  { texto: "CRÉDITOS",    x: 40, y: 330, destino: "creditos" },
  { texto: "SALIR",       x: 40, y: 375, destino: "salir" }
];

let botonVolver = [{ texto: "◀ VOLVER", x: 40, y: 390, destino: "menu" }];

//          <<<<< PANTALLA DE INTRODUCCIÓN <<<<<

let textoIntro = "Nueva York, 1954. Una madrugada de lluvia. John Davis recibe un llamado: Ricardo Alonso, dueño de una inmobiliaria, apareció muerto en su oficina. Un presunto suicidio que no termina de cerrar.";
let letrasIntro = 0;

// <<<<< DATOS DE LAS ESCENAS DEL JUEGO (arreglo) <<<<<<<<

let imagenesEscenas = [];

let escenas = [
  {
    archivo: 'escenas/pantalla1.png',
    texto: "Sos John Davis. Llegás bajo la lluvia al edificio donde apareció muerto Ricardo Alonso, un empresario. Un policía te espera en la puerta.",
    tieneLluvia: true,
    hablante: "",
    opciones: [ { texto: "Hablar con el policía", x: 520, y: 160, siguiente: 1 } ]
  },
  {
    archivo: 'escenas/policia.png',
    texto: "El cuerpo está en el noveno piso, detective. Ya está todo despejado, puede subir a investigar.",
    tieneLluvia: true,
    hablante: "policia",
    opciones: [ { texto: "Entrar al edificio", x: 235, y: 390, siguiente: 2 } ]
  },
  {
    archivo: 'escenas/abriendopuerta.png',
    texto: "Llegás a la puerta de la oficina de Ricardo Alonso. Está entreabierta.",
    tieneLluvia: false,
    hablante: "",
    opciones: [ { texto: "Abrir la puerta", x: 35, y: 390, siguiente: 3 } ]
  },
  {
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
  {
    archivo: 'escenas/guardia.png',
    texto: "Bajás a la recepción a hablar con el guardia nocturno. Es el único que estuvo en el edificio toda la noche.",
    tieneLluvia: false,
    hablante: "",
    opciones: [
      { texto: "Preguntarle si vio algo esa noche", x: 35, y: 390, siguiente: 5 }
    ]
  },
  {
    archivo: 'escenas/guardia.png',
    texto: "¿Usted no vio nada, señor? Alguien entrando o saliendo esa noche, lo que sea.",
    tieneLluvia: false,
    hablante: "johndavis",
    opciones: [
      { texto: "Preguntarle con calma", x: 235, y: 370, siguiente: 6 },
      { texto: "Presionarlo", x: 235, y: 400, siguiente: 7 }
    ]
  },
  {
    archivo: 'escenas/guardia.png',
    texto: "Está bien... la verdad es que esa noche vi entrar a Martín Ferrer, tarde, cuando se suponía que no había nadie más en el edificio.",
    tieneLluvia: false,
    hablante: "guardia",
    opciones: [
      { texto: "Ir a interrogar a Martín Ferrer", x: 235, y: 390, siguiente: 8 } // acá va la escena de Martín (la programa tu compañera)
    ]
  },
  {
    archivo: 'escenas/guardia.png',
    texto: "¡No tengo por qué decirle nada a usted! ¡Retírese de mi vista!",
    tieneLluvia: false,
    hablante: "guardia",
    opciones: [
      { texto: "Ir a hablar con Laura Alonso", x: 235, y: 390, siguiente: 9 } // acá va el camino que lleva a sospechar de Laura (la programa tu compañera)
    ]
  }
];

let escenaActual = 0;
let letrasMostradas = 0;

function preload() {
  imgMenu = loadImage('escenas/menuinicial.png');
  fuenteTitulo = loadFont('fuentes/Rye-Regular.ttf');
  fuenteBotones = loadFont('fuentes/Oswald-VariableFont_wght.ttf');
  sonidoViento = loadSound('sonidos/viento.wav');
  sonidoTeclado = loadSound('sonidos/teclado.wav');
  sonidoLluvia = loadSound('sonidos/lluvia.mp3');

  imagenesRetratos["policia"] = loadImage('escenas/policiamsj.png');
  imagenesRetratos["johndavis"] = loadImage('escenas/john.png');
  imagenesRetratos["guardia"] = loadImage('escenas/guardiamsj.png');

  imagenCajon = loadImage('escenas/cajon.png');
  imagenHoja = loadImage('escenas/hojavacia.png');

  vistasSimples.silla.imagen = loadImage('escenas/silla.png');
  vistasSimples.cajafuerte.imagen = loadImage('escenas/cajafuerte.png');

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

// <<<<<< MENÚ <<<<

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

// <<<<< DESCRIPCIÓN <<<<<

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
  let historia = "Sos John Davis, un detective privado que se dedica a los casos más difíciles, esos que la policía deja de lado. Una noche de lluvia te llaman por uno distinto: Ricardo Alonso, dueño de una inmobiliaria, apareció muerto en su oficina, cerrada con llave por dentro. Todos dicen que fue un suicidio, pero hay una carta sin firma, una caja fuerte vacía y alguien que no quiere hablar. ¿Vas a descubrir quién miente?\n\nCómo jugar: hacé click en los botones o en las zonas marcadas de cada escena para avanzar. Tus decisiones cambian el rumbo de la historia, y hay 3 finales posibles. Al terminar, podés volver al inicio y probar otro camino.";
  text(historia, 40, 90, 720, 300);

  dibujarBotones(botonVolver);
}

// <<<<< CRÉDITOS <<<<<

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
  text("Historia y programación:nuestros nombres y las imagenes que hicimos con IA", 400, 110);

  textAlign(LEFT, TOP);
  dibujarBotones(botonVolver);
}

// <<<<< SALIR <<<<<

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

// <<<<< PANTALLA DE INTRODUCCIÓN (pantalla negra con texto) <<<<<

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

// <<<<< ESCENAS DEL JUEGO <<<<<

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

  // la escena del crimen (índice 3) tiene su propio manejo: el texto solo se escribe la primera vez
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

// función con parámetros: dibuja el retrato respetando su proporción (sin aplastarlo)<<<<

function calcularAnchoRetrato(retrato) {
  let altoMax = 110;
  return (retrato.width / retrato.height) * altoMax; // mantiene la proporción
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
  return anchoCalculado; // devuelve cuanto ocupo, para saber dónde arranca el texto
}

// función con parámetros: escribe el texto, dejando lugar al retrato si hay uno<<<<

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

// función con parámetros: dibuja cada opción en la posición que le indiquemos (x, y)<<<<

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

// <<<<< COMENTARIO DE JOHN SOBRE EL GUARDIA (aparece recién cuando revisó los 3 objetos) <<<<<

function dibujarComentarioGuardia() {
  let anchoRetrato = dibujarRetrato(imagenesRetratos["johndavis"], 30, 330);
  textFont(fuenteBotones);
  fill(230, 220, 200);
  textAlign(LEFT, TOP);
  textSize(16);
  text("Capaz el guardia tendrá algo que decir... habrá visto algo esa noche.", 30 + anchoRetrato + 20, 345, 780 - (30 + anchoRetrato + 20), 40);
  dibujarOpcionesEscena([ { texto: "Hablar con el guardia", x: 30 + anchoRetrato + 20, y: 390 } ]);
}

// <<<<< OBJETOS INTERACTIVOS DENTRO DE UNA ESCENA (cajón, carta, silla, caja fuerte) <<<<<

// función con parámetros: dibuja los objetos clickeables propios de una escena (si tiene)<<<<

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

// función con parámetros: revisa si el click cayó sobre un objeto de la escena<<<<

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
        objetosRevisados[objeto.abre] = true; // lo marcamos como ya revisado
      }
      return true;
    }
  }
  return false;
}

// vista del cajón: imagen + cuadro de texto + botón "Ver carta"<<<<

function dibujarVistaCajon() {
  image(imagenCajon, 0, 0, 800, 450);

  dibujarCajaDeTexto();
  let anchoRetrato = dibujarRetrato(imagenesRetratos["johndavis"], 30, 330);
  textFont(fuenteBotones);
  fill(230, 220, 200);
  textAlign(LEFT, TOP);
  textSize(16);
  text("Entre los papeles hay una carta que llama la atención.", 30 + anchoRetrato + 20, 345, 780 - (30 + anchoRetrato + 20), 40);

  // el botón va del otro lado del cuadro de texto, para no pisar la foto de John
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
  fill(255, 255, 255);
  textAlign(CENTER, TOP);
  textSize(16);
  textLeading(22);
  let textoCarta = "Esta es tu última oportunidad. Aceptá mi oferta por la empresa, o te vas a arrepentir. No voy a esperar más.";
  text(textoCarta, xCarta + 40, yCarta + 60, anchoCarta - 80, altoCarta - 100);
  textAlign(LEFT, TOP);

  fill(242, 163, 58);
  textAlign(CENTER, TOP);
  textSize(14);
  text("Esto cambia todo... no fue solo un suicidio.", 0, yCarta - 35, 800, 30);
  textAlign(LEFT, TOP);

  dibujarBotonVolverVista();
}

// función con parámetros: dibuja una vista simple de un objeto (imagen + comentario de John)<<<<

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

// <<<<< CLICKS <<<<<

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
      pantallaActual = boton.destino;
    }
  }
}

// función con parámetros: revisa el click contra la posición propia de cada opción<<<<<<

function revisarClickEnOpciones(opciones) {
  textSize(16);
  for (let i = 0; i < opciones.length; i++) {
    let opcion = opciones[i];
    let ancho = textWidth(opcion.texto) + 30;
    let dentro = mouseX > opcion.x && mouseX < opcion.x + ancho &&
                 mouseY > opcion.y && mouseY < opcion.y + 30;
    if (dentro) {
      escenaActual = opcion.siguiente;
      letrasMostradas = 0;
    }
  }
}