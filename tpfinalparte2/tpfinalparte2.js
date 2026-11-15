

// (video parte1)
//https://www.youtube.com/watch?v=Isw69YTkqYU&t=2s
// Parte ivan (programación y diseño del juego) 

//            IMÁGENES Y FUENTES 

let imgAutoMartin;
let imgAutoJohn;
let imgTacho;
let imgCono;
let imgValla;
let imgGato;
let imgRetrovisor;
let imgJohn;
let imgFinalGanar;
let fuenteTitulo;
let fuenteTexto;
let sonidoBoton;
let sonidoChoque;
let sonidoGanar;
let sonidoPerder;
let sonidoMotor;

         //  VARIABLES GENERALES 


let imagenesObstaculos = [];
let estado = 'menu';   // menu, dialogo, tutorial, jugando, ganaste, perdiste, creditos, salir
let velocidad = 4;

let juego;
let calleMenu;
let menuMartin;
let menuJohn;

let botonIniciar;
let botonCreditos;
let botonSalir;
let botonPlay;
let botonReintentar;
let botonMenu;
let botonVolver;

let fraseJohn = 'Martín Ferrer... el asesino de Ricardo Alonso. Se me escapó, pero esta vez no va a escaparse. Lo voy a atrapar.';
let letras = 0;


function preload() {
  imgAutoMartin = loadImage('escenas/automartin.png');

   imgAutoJohn = loadImage('escenas/autojohn.png');

   imgTacho = loadImage('escenas/tacho.png');

     imgCono = loadImage('escenas/cono.png');

      imgValla = loadImage('escenas/valla.png');

        imgGato = loadImage('escenas/gato.png');

       imgRetrovisor = loadImage('escenas/retrovisor.png');

         imgJohn = loadImage('escenas/john.png');

       imgFinalGanar = loadImage('escenas/martinarrestado.png');

          fuenteTitulo = loadFont('fuentes/Rye-Regular.ttf');

          fuenteTexto = loadFont('fuentes/Oswald-VariableFont_wght.ttf');

  sonidoBoton = loadSound('sonidos/boton.wav');

      sonidoChoque = loadSound('sonidos/choque.wav');

         sonidoGanar = loadSound('sonidos/ganar.wav');

      sonidoPerder = loadSound('sonidos/perder.wav');

  sonidoMotor = loadSound('sonidos/motor.wav');

}

function setup() {
  createCanvas(800, 400);
  imageMode(CENTER);

  imagenesObstaculos = [imgTacho, imgCono, imgValla, imgGato];
  sonidoMotor.setVolume(0.3);
  sonidoBoton.setVolume(0.1);
  juego = new Juego();

               // autos decorativos del menú <<<<<<<<<<

  calleMenu = new Calle();
  menuMartin = new AutoMartin(imgAutoMartin);
  menuMartin.y = 170;
  menuJohn = new AutoJohn(imgAutoJohn);
  menuJohn.y = 300;

  botonIniciar = new Boton('INICIAR', 675, 190, 190, 40);

  botonCreditos = new Boton('CRÉDITOS', 675, 245, 190, 40);

  botonSalir = new Boton('SALIR', 675, 300, 190, 40);

  botonPlay = new Boton('PLAY', 400, 355, 200, 40);

  botonReintentar = new Boton('REINTENTAR', 260, 355, 220, 40);

  botonMenu = new Boton('MENÚ', 540, 355, 220, 40);

  botonVolver = new Boton('VOLVER', 400, 355, 200, 40);
}

function draw() {
  background(0);

  if (estado === 'menu') {

    dibujarMenu();
  } else if (estado === 'dialogo') {

    dibujarDialogo();
  } else if (estado === 'tutorial') {

    dibujarTutorial();
  } else if (estado === 'jugando') {

    juego.jugar();
  } else if (estado === 'ganaste') {

    dibujarGanaste();
  } else if (estado === 'perdiste') {

    dibujarPerdiste();
  } else if (estado === 'creditos') {

    dibujarCreditos();
  } else if (estado === 'salir') {

    dibujarSalir();
  }
}

                 //  CONTROLES <<<<<<<<<<<<


function keyPressed() {
  if (estado === 'jugando') {
    if (keyCode === LEFT_ARROW) {
      juego.autoJohn.moverIzquierda();
    }
    if (keyCode === RIGHT_ARROW) {
      juego.autoJohn.moverDerecha();
    }
  }

  if (key === 'r' || key === 'R') {
    if (estado === 'jugando' || estado === 'ganaste' || estado === 'perdiste') {
      empezarJuego();
    }
  }

  if (estado === 'dialogo' && keyCode === ENTER) {
    estado = 'tutorial';
  }
}

function mousePressed() {
  sonidoBoton.play();
  if (estado === 'menu') {
    if (botonIniciar.estaSobre()) {
      letras = 0;
      estado = 'dialogo';
    }
    if (botonCreditos.estaSobre()) {
      estado = 'creditos';
    }
    if (botonSalir.estaSobre()) {
      estado = 'salir';
    }
  } else if (estado === 'dialogo') {
    estado = 'tutorial';
  } else if (estado === 'tutorial') {
    if (botonPlay.estaSobre()) {
      empezarJuego();
    }
  } else if (estado === 'ganaste' || estado === 'perdiste') {
    if (botonReintentar.estaSobre()) {
      empezarJuego();
    }
    if (botonMenu.estaSobre()) {
      estado = 'menu';
    }
  } else if (estado === 'creditos' || estado === 'salir') {
    if (botonVolver.estaSobre()) {
      estado = 'menu';
    }
  }
}

       function empezarJuego() {


  juego.reiniciar();
  sonidoMotor.stop();
  sonidoMotor.loop();
  estado = 'jugando';
}

// devuelve la posición x del centro de cada carril (0, 1 o 2)

function centroDeCarril(carril) {
  return 300 + carril * 100;
}

                 // Clases del juego (Ivan) <<<<


class Juego {
  constructor() {
    this.maxSospecha = 5;

    this.duracion = 45;   // segundos

    this.reiniciar();
  }

  reiniciar() {
    this.sospecha = 0;
    this.inicio = millis();
    this.inmune = 0;
    this.destello = 0;

    this.calle = new Calle();
    this.autoJohn = new AutoJohn(imgAutoJohn);
    this.autoMartin = new AutoMartin(imgAutoMartin);
    this.medidor = new MedidorSospecha();
    this.cartel = new Cartel(imgRetrovisor);

    this.obstaculos = [];
    for (let i = 0; i < 2; i++) {
      this.obstaculos.push(new Obstaculo(imagenesObstaculos, -150 - i * 250));
    }
  }

  jugar() {
    let transcurrido = (millis() - this.inicio) / 1000;
    let progreso = constrain(transcurrido / this.duracion, 0, 1);

    velocidad = 3.5 + progreso * 1.5;   // va acelerando de a poco
    this.inmune = this.inmune - 1;

    this.calle.actualizar();
    this.calle.mostrar();

    for (let i = 0; i < this.obstaculos.length; i++) {
      this.obstaculos[i].actualizar();
      this.obstaculos[i].mostrar();
      let toco = this.obstaculos[i].choca(this.autoJohn);
      if (toco && this.inmune <= 0) {
        this.sospecha = this.sospecha + 1;
        this.inmune = 60;
        this.destello = 12;
        this.cartel.activar();
        sonidoChoque.play();
      }
    }

    this.autoMartin.actualizar(progreso, this.sospecha);
    this.autoMartin.mostrar();
    this.autoJohn.actualizar();
    this.autoJohn.mostrar();

    dibujarLluvia();
    this.medidor.mostrar(this.sospecha, this.maxSospecha);
    this.cartel.mostrar();

                           // tiempo restante


    push();
    noStroke();
    fill(220);
    textFont(fuenteTexto);
    textAlign(LEFT, TOP);
    textSize(16);
    text('TIEMPO', 25, 90);
    textSize(36);
    text(ceil(this.duracion - transcurrido), 25, 110);
    pop();

                      // flash rojo cuando chocás



    if (this.destello > 0) {
      noStroke();
      fill(255, 0, 0, this.destello * 8);
      rect(0, 0, 800, 400);
      this.destello = this.destello - 1;
    }

                     // cómo termina


    if (this.sospecha >= this.maxSospecha) {
       estado = 'perdiste';
        sonidoMotor.stop();
      sonidoPerder.play();
    } else if (progreso >= 1) {
      estado = 'ganaste';
      sonidoMotor.stop();
      sonidoGanar.play();
    }
  }
}

class AutoJohn {
  constructor(imagen) {
    this.imagen = imagen;
    this.carril = 1;
    this.x = centroDeCarril(1);
    this.y = 320;
  }

  moverIzquierda() {
    this.carril = constrain(this.carril - 1, 0, 2);
  }

  moverDerecha() {
    this.carril = constrain(this.carril + 1, 0, 2);
  }

  actualizar() {
    this.x = lerp(this.x, centroDeCarril(this.carril), 0.2);
  }

  mostrar() {
    image(this.imagen, this.x, this.y, this.imagen.width * 0.6, this.imagen.height * 0.6);
  }
}

class AutoMartin {
  constructor(imagen) {
    this.imagen = imagen;
    this.x = centroDeCarril(1);
    this.y = 100;
  }

        // Martín se acerca con el tiempo y se aleja cada vez que lo detecta



  actualizar(progreso, sospecha) {
    let objetivo = map(progreso, 0, 1, 70, 230) - 18 * sospecha;
    objetivo = constrain(objetivo, 40, 260);
    this.y = lerp(this.y, objetivo, 0.05);
  }

  mostrar() {
    image(this.imagen, this.x, this.y, this.imagen.width * 0.6, this.imagen.height * 0.6);
  }
}

class Obstaculo {
  constructor(imagenes, yInicial) {
    this.imagenes = imagenes;
    this.reiniciar();
    this.y = yInicial;
  }

  reiniciar() {
    this.y = -random(150, 350);
    this.carril = floor(random(3));
    this.imagen = this.imagenes[floor(random(this.imagenes.length))];
    this.golpeado = false;
  }

  actualizar() {
    this.y = this.y + velocidad;
    if (this.y > 460) {
      this.reiniciar();
    }
  }

  mostrar() {
    image(this.imagen, centroDeCarril(this.carril), this.y, this.imagen.width * 0.75, this.imagen.height * 0.75);
  }

  choca(auto) {
    if (this.golpeado === false && this.carril === auto.carril && abs(this.y - auto.y) < 55) {
      this.golpeado = true;
      return true;
    }
    return false;
  }
}


    // fin de mi parte(ivan)                           


//   PARTE DE Rocio(Interfaz y ambiente)

//   (pantallas, lluvia, Calle, MedidorSospecha, Cartel y Boton)                                            


//        PANTALLAS <<<<<<<<<<<<


function dibujarMenu() {
  velocidad = 3;
  calleMenu.actualizar();
  calleMenu.mostrar();
  menuMartin.mostrar();
  menuJohn.mostrar();
  dibujarLluvia();

  push();
  noStroke();
  fill(5, 9, 11, 210);
  rect(0, 20, 800, 112);
  textAlign(CENTER, CENTER);
  textFont(fuenteTitulo);
  fill(255, 178, 62);
  textSize(52);
  text('ATRAPA AL ASESINO', 400, 62);
  textFont(fuenteTexto);
  fill(200);
  textSize(18);
  text('SILENCIO ROJO', 400, 110);
  pop();

  botonIniciar.mostrar();
  botonCreditos.mostrar();
  botonSalir.mostrar();
}

function dibujarDialogo() {
  background(0);

  let alto = 260;
  let ancho = alto * imgJohn.width / imgJohn.height;
  image(imgJohn, 130, 200, ancho, alto);

  push();
  fill(10, 15, 18, 225);
  stroke(110, 170, 255);
  strokeWeight(2);
  rect(260, 100, 500, 190, 10);

  noStroke();
  textFont(fuenteTexto);
  textAlign(LEFT, TOP);
  fill(110, 170, 255);
  textSize(15);
  text('JOHN DAVIS', 282, 118);

  fill(150, 195, 255);
  textSize(21);
  letras = min(letras + 0.6, fraseJohn.length);
  text(fraseJohn.substring(0, floor(letras)), 282, 148, 460, 130);
  pop();

     push();
  fill(120);

     textFont(fuenteTexto);

  textSize(14);
  textAlign(CENTER, CENTER);

  if (letras >= fraseJohn.length) {
    text('Hacé clic o apretá ENTER para continuar', 400, 375);

  } else {
    text('Hacé clic o apretá ENTER para saltear', 400, 375);
  }
  pop();
}

    function dibujarTutorial() {

  background(0);


  push();
  textAlign(CENTER, CENTER);
  textFont(fuenteTitulo);
  fill(255, 178, 62);
  textSize(34);
  text('CÓMO JUGAR', 400, 32);

  textFont(fuenteTexto);
  fill(230);
  textSize(18);
  text('Usá las flechas IZQUIERDA y DERECHA para cambiar de carril y esquivar.', 400, 75);


                     // fila de obstáculos con su nombre


  let nombres = ['Tacho', 'Cono', 'Valla', 'Gato'];
    for (let i = 0; i < imagenesObstaculos.length; i++) {
     let x = 205 + i * 130;

    image(imagenesObstaculos[i], x, 135, imagenesObstaculos[i].width * 0.75, imagenesObstaculos[i].height * 0.75);
    fill(170);
    textSize(14);
    text(nombres[i], x, 180);
  }

                         // retrovisor y advertencia


  let anchoRetro = 140;
          let altoRetro = anchoRetro * imgRetrovisor.height / imgRetrovisor.width;
  image(imgRetrovisor, 120, 262, anchoRetro, altoRetro);


      textAlign(LEFT, CENTER);
  fill(230);
  textSize(17);

    text('Si chocás con algo, Martín te ve por el retrovisor y sospecha.', 215, 245);
  fill(255, 90, 70);
    textSize(19);

  text('ADVERTENCIA: si Martín sospecha 5 veces, perdés.', 215, 280);
  fill(230);

    textSize(17);
  text('Aguantá hasta que se acabe el tiempo para frenarlo.', 215, 312);
  pop();

  botonPlay.mostrar();
}

    function dibujarGanaste() {
  image(imgFinalGanar, 400, 200, 800, 400, 0, 52, 1672, 836);

  push();
  fill(10, 15, 18, 225);
       stroke(255, 178, 62);
   strokeWeight(2);
   rect(40, 245, 720, 70, 10);
     noStroke();
  fill(255, 178, 62);
  textFont(fuenteTitulo);
           textAlign(CENTER, CENTER);

          textSize(24);
     text('¡LO ATRAPASTE!', 400, 267);
    fill(230);
   textFont(fuenteTexto);

  textSize(17);
  text('A Martín se le pinchó una rueda y no le quedó más que rendirse.', 400, 297);

  pop();

  botonReintentar.mostrar();
  botonMenu.mostrar();
}

function dibujarPerdiste() {
  background(0);

             // final malo (cuando Martín se escapa)

  push();
      textAlign(CENTER, CENTER);

     textFont(fuenteTitulo);
   fill(214, 40, 40);
  textSize(44);
  text('MARTÍN ESCAPÓ', 400, 110);

     textFont(fuenteTexto);
  fill(230);

  textSize(20);
     text('Te vio demasiadas veces y aceleró hasta perderte de vista.', 400, 185);

    text('El asesino de Alonso sigue libre.', 400, 220);
  pop();

  botonReintentar.mostrar();
  botonMenu.mostrar();
}

function dibujarCreditos() {
  background(0);

  push();
        textAlign(CENTER, CENTER);
      textFont(fuenteTitulo);

   fill(255, 178, 62);
     textSize(40);
  text('CRÉDITOS', 400, 60);

  textFont(fuenteTexto);
  fill(230);
  textSize(20);

  text('Silencio Rojo: Atrapa al asesino', 400, 130)

   text('Programación y diseño: Ivan Lencina 122752/3 Y Rocio Arcuri 125514/3 ', 400, 175);
    text('Materia: IPMI  Comisión 2', 400, 220);

   text('Ilustraciones y sprites: arte generado con CHATGPT', 400, 265);

  pop();

  botonVolver.mostrar();
}

function dibujarSalir() {
  background(0);

  push();
       textAlign(CENTER, CENTER);


       textFont(fuenteTitulo);
  fill(255, 178, 62);

  textSize(36);
  text('GRACIAS POR JUGAR', 400, 150);
  textFont(fuenteTexto);

  fill(200);
    textSize(20);

    text('Ya podés cerrar esta pestaña.', 400, 210);
  pop();

  botonVolver.mostrar();
}

function dibujarLluvia() {

  push();
     stroke(170, 190, 200, 70);
     strokeWeight(1);
         for (let i = 0; i < 40; i++) {
       let x = random(800);
     let y = random(400);
    line(x, y, x - 3, y + 12);
  }
  pop();
}

            //   clases de la interfaz y ambiente

class Calle {
  constructor() {
    this.desplazamiento = 0;
  }

  actualizar() {
    this.desplazamiento = (this.desplazamiento + velocidad) % 160;
  }

  mostrar() {
    noStroke();
    fill(10, 16, 20);
    rect(0, 0, 800, 400);            // costados

         fill(26, 38, 44);
         
    rect(250, 0, 300, 400);          // asfalto
          fill(255, 178, 62);

    rect(246, 0, 4, 400);            // borde izquierdo

    rect(550, 0, 4, 400);            // borde derecho

            // rayas de los carriles

       fill(120, 140, 145);
            for (let y = -80 + (this.desplazamiento % 80); y < 400; y += 80) {
      rect(348, y, 4, 40);
      rect(448, y, 4, 40);
    }

           // farolas de los costados

    for (let y = -160 + this.desplazamiento; y < 400; y += 160) {

      fill(255, 178, 62, 40);
       ellipse(215, y, 80, 80);

         ellipse(585, y, 80, 80);

         fill(255, 178, 62);
      ellipse(215, y, 10, 10);
      ellipse(585, y, 10, 10);
    }
  }
}

class MedidorSospecha {
  mostrar(actual, maximo) {
    push();
    noStroke();
    fill(220);
     textFont(fuenteTexto);

       textAlign(LEFT, TOP);
      
    textSize(16);
    text('SOSPECHA', 25, 22);

    for (let i = 0; i < maximo; i++) {
      stroke(255, 178, 62);

      strokeWeight(2);
      if (i < actual) {

        fill(214, 40, 40);
      } else {

        fill(10, 15, 18, 200);
      }
      rect(25 + i * 36, 48, 30, 18, 3);
    }
    pop();
  }
}

class Cartel {
  constructor(imagen) {
    this.imagen = imagen;
    this.frames = 0;
  }

  activar() {
    this.frames = 100;
  }

  mostrar() {
    if (this.frames <= 0) {
      return;
    }
    this.frames = this.frames - 1;


         // retrovisor con la cara de Martín en el costado derecho


    let ancho = 170;
     let alto = ancho * this.imagen.height / this.imagen.width;
         image(this.imagen, 675, 100, ancho, alto);

    // cartel naranja


    push();
         rectMode(CENTER);
    noStroke();
    fill(242, 106, 27);
     rect(675, 200, 200, 56, 8);

     fill(20);

       textFont(fuenteTexto);
      textSize(15);

    textAlign(CENTER, CENTER);
       text('Martín te ha detectado,\nten más cuidado', 675, 200);

    pop();
  }
}

class Boton {
  constructor(texto, x, y, ancho, alto) {
    this.texto = texto;
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
  }

  estaSobre() {
    return abs(mouseX - this.x) < this.ancho / 2 && abs(mouseY - this.y) < this.alto / 2;
  }

  mostrar() {
    push();
    rectMode(CENTER);
    stroke(255, 178, 62);
    strokeWeight(2);
    if (this.estaSobre()) {
      fill(255, 178, 62);
    } else {
      fill(10, 15, 18, 225);
    }
    rect(this.x, this.y, this.ancho, this.alto, 8);

    noStroke();
    if (this.estaSobre()) {
      fill(10, 15, 18);
    } else {
      fill(255, 178, 62);
    }
    textFont(fuenteTitulo);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(this.texto, this.x, this.y);
    pop();
  }
}

//  fin de Rocio                         
