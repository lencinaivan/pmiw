let fondo;
let interfaces;
let logo;

let gokuHoja;
let vegetaHoja;

let gokuFrames = [];
let vegetaFrames = [];

let totalGoku = 4;
let totalVegeta = 6;

let frameActualGoku = 0;
let frameActualVegeta = 0;

let tiempoUltimoCambio = 0;
let intervaloTiempo = 300;

let fondoAncho = 512;
let fondoAltoUtil = 512;

let estado = 0;

let opciones = ["INICIAR", "CREDITOS", "SALIR"];




//Hola profe, el trabajo no esta completo, esta incompleto, pero bueno, quiero entregarlo para mostrar la idea que tenia, 
//la idea basica que tenia. Pero bueno, acepto la responsabilidad de que lo entregue incompleto, asi que ahora voy a mejorar para la proxima entregarlo completo




function preload() {

  fondo = loadImage("data/habitaciondeltiempo.png");
  logo = loadImage("data/dragonballz.png");
  interfaces = loadFont("data/saiyansans.ttf");

  gokuHoja = loadImage("data/gokumenu.png");
  vegetaHoja = loadImage("data/vegetamenu.png");

}



function setup() {

  createCanvas(800, 600);
  textFont(interfaces);

  quitarFondoVerde(gokuHoja);
  quitarFondoVerde(vegetaHoja);

  let anchoFrameGoku = gokuHoja.width / totalGoku;

  for (let i = 0; i < totalGoku; i++) {
    let frame = gokuHoja.get(i * anchoFrameGoku, 0, anchoFrameGoku, gokuHoja.height);
    gokuFrames.push(frame);
  }

  let anchoFrameVegeta = vegetaHoja.width / totalVegeta;

  for (let i = 0; i < totalVegeta; i++) {
    let frame = vegetaHoja.get(i * anchoFrameVegeta, 0, anchoFrameVegeta, vegetaHoja.height);
    vegetaFrames.push(frame);
  }

  reiniciar();

}



function reiniciar() {

  estado = 0;

}



function draw() {

  background(0);
  imageMode(CORNER);

  image(fondo, 0, 0, width, height, 0, 0, fondoAncho, fondoAltoUtil);

  if (estado == 0) {
    dibujarMenu();
  } else if (estado == 1) {
    dibujarPelea();
  } else if (estado == 2) {
    dibujarCreditos();
  }

}



function quitarFondoVerde(img) {

  img.loadPixels();

  for (let i = 0; i < img.pixels.length; i += 4) {

    let r = img.pixels[i];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];

    if (g > 90 && g > r + 25 && g > b + 25) {
      img.pixels[i + 3] = 0;
    }

  }

  img.updatePixels();

}



function mouseEncimaDe(x, y, ancho, alto) {

  return (
    mouseX > x - ancho / 2 &&
    mouseX < x + ancho / 2 &&
    mouseY > y - alto / 2 &&
    mouseY < y + alto / 2
  );

}



function dibujarMenu() {

  imageMode(CENTER);

  image(logo, width / 2, 110, 400, 220);

  if (millis() - tiempoUltimoCambio > intervaloTiempo) {
    frameActualGoku = (frameActualGoku + 1) % totalGoku;
    frameActualVegeta = (frameActualVegeta + 1) % totalVegeta;
    tiempoUltimoCambio = millis();
  }

  if (gokuFrames.length > 0) {
    image(gokuFrames[frameActualGoku], 180, 380, 220, 280);
  }

  if (vegetaFrames.length > 0) {
    image(vegetaFrames[frameActualVegeta], 620, 380, 220, 280);
  }

  for (let i = 0; i < opciones.length; i++) {

    let y = 240 + i * 70;
    let tamano = 26;

    if (mouseEncimaDe(width / 2, y, 240, 50)) {
      tamano = 34;
      stroke(255, 204, 0);
      strokeWeight(3);
      fill(60, 170, 220, 200);
      rectMode(CENTER);
      rect(width / 2, y, 240, 50, 10);
    }

    fill(255);
    stroke(0);
    strokeWeight(2);
    textSize(tamano);
    textAlign(CENTER, CENTER);
    text(opciones[i], width / 2, y);

  }

}



function dibujarPelea() {

  fill(255);
  stroke(0);
  strokeWeight(2);
  textAlign(CENTER, CENTER);
  textSize(22);
  text("Pantalla de Pelea - Presiona R para volver", width / 2, 550);

}



function dibujarCreditos() {

  rectMode(CENTER);
  fill(0, 0, 0, 210);
  stroke(255, 204, 0);
  strokeWeight(3);
  rect(width / 2, height / 2, 500, 300, 20);

  fill(255, 204, 0);
  stroke(0);
  strokeWeight(3);
  textAlign(CENTER, CENTER);
  textSize(38);
  text("CREDITOS", width / 2, 200);

  fill(255);
  textSize(22);
  text("Trabajo Practico - Dragon Ball", width / 2, 270);
  text("Animacion con Sprites", width / 2, 310);

  textSize(18);
  text("Presiona R para volver al Menu", width / 2, 380);

}



function mousePressed() {

  if (estado == 0) {
    if (mouseEncimaDe(width / 2, 240, 240, 50)) {
      estado = 1;
    } else if (mouseEncimaDe(width / 2, 310, 240, 50)) {
      estado = 2;
    } else if (mouseEncimaDe(width / 2, 380, 240, 50)) {
      reiniciar();
    }
  }

}



function keyPressed() {

  if (key == "r" || key == "R") {
    reiniciar();
  }

}
