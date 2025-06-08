let pelota;
let aro; 
let controlAngulo, controlPotencia;
let mostrarAngulo, mostrarPotencia;
let pelotaLanzada = false;
let velocidadParpadeo = 0.1;
let contadorParpadeosColor = 0;
let estrellas = []; 
let mensajeFueraRango = null;
let tiempoOcultarMensaje = 0;
let contadorLanzamientos = 0;
let botonReiniciar, botonSalir, botonLanzar;
let mensajeGanaste = null;
let pressStart2P;

function preload() {
  pressStart2P = loadFont('fonts/PressStart2P-Regular.ttf');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('gameCanvas');
  crearEstrellas();
  crearPelota();
  crearAro();
  crearControles();
  crearBotones();
}

function draw() {
  dibujarFondo();
  dibujarCanon();
  actualizarPelota();
  dibujarPelota();
  dibujarAro();
  mostrarControles();
  gestionarMensajes();
  mostrarContadorIntentos();
}

function crearEstrellas() {
  for (let i = 0; i < 100; i++) {
    estrellas.push({
      x: random(width),
      y: random(height),
      velocidad: random(0.5, 2),
      radio: random(1, 3),
      brillo: random(100, 255)
    });
  }
}

function crearPelota() {
  pelota = {
    x: 100,
    y: height - 80,
    r: 15,
    vx: 0,
    vy: 0,
    gravedad: 0.5,
    baseX: 100,
    baseY: height - 80
  };
}

function crearAro() {
  aro = {
    x: random(width * 0.5, width * 0.8),
    y: random(height * 0.4, height * 0.6),
    w: 60,
    h: 60,
    brillo: 255
  };
}

function crearControles() {
  controlAngulo = createSlider(0, 90, 45);
  controlAngulo.position(width/2 - 75, height - 100);
  controlAngulo.style('width', '150px');

  controlPotencia = createSlider(5, 20, 10);
  controlPotencia.position(width/2 - 75, height - 70);
  controlPotencia.style('width', '150px');

  mostrarAngulo = createP(controlAngulo.value() + "°");
  mostrarAngulo.position(controlAngulo.x + controlAngulo.width + 10, controlAngulo.y - 10);
  mostrarAngulo.style('color', '#FFFFFF');
  mostrarAngulo.style('font-weight', 'bold');
  mostrarAngulo.style('z-index', '100');

  mostrarPotencia = createP(controlPotencia.value());
  mostrarPotencia.position(controlPotencia.x + controlPotencia.width + 10, controlPotencia.y - 10);
  mostrarPotencia.style('color', '#FFFFFF');
  mostrarPotencia.style('font-weight', 'bold');
  mostrarPotencia.style('z-index', '100');

  botonLanzar = createButton("Lanzar");
  botonLanzar.position(width/2 - 35, height - 40);
  botonLanzar.mousePressed(lanzarPelota);
  botonLanzar.style('padding', '8px 15px');
  botonLanzar.style('background', '#4CAF50');
  botonLanzar.style('color', 'white');
  botonLanzar.style('font-family',  'PressStart2P-Regular');
}

function crearBotones() {
  botonReiniciar = createButton("Reiniciar Juego");
  botonReiniciar.position(width/2 - 70, height/2 + 60);
  botonReiniciar.style('font-family',  'PressStart2P-Regular');
  botonReiniciar.mousePressed(reiniciarJuego);
  botonReiniciar.hide();

  botonSalir = createButton("Salir");
  botonSalir.style('font-family',  'PressStart2P-Regular');
  botonSalir.position(width/2 , height/2 + 100);
  botonSalir.mousePressed(salirJuego);
  botonSalir.hide();
}

function dibujarFondo() {
  background(10, 20, 40);
  for (let estrella of estrellas) {
    estrella.y += estrella.velocidad;
    if (estrella.y > height) {
      estrella.y = 0;
      estrella.x = random(width);
    }
    fill(255, 255, 255, estrella.brillo);
    noStroke();
    ellipse(estrella.x, estrella.y, estrella.radio);
  }
}

function dibujarCanon() {
  let angulo = radians(controlAngulo.value());
  let longitudCanon = 100;
  let grosorBoca = 40;
  let grosorBase = 20;
  let alturaCanon = 60;

  push();
  translate(50, height - 50);
  fill(101, 67, 33);
  noStroke();
  rect(-40, 10, 100, 15);
  fill(70, 50, 30);
  ellipse(-25, 25, 25, 25);
  ellipse(25, 25, 25, 25);
  rect(-35, -alturaCanon, 10, alturaCanon + 10);
  rect(25, -alturaCanon, 10, alturaCanon + 10);
  beginShape();
  vertex(-25, -10);
  vertex(-35, -alturaCanon);
  vertex(-30, -alturaCanon);
  vertex(-20, -10);
  endShape(CLOSE);
  beginShape();
  vertex(25, -10);
  vertex(35, -alturaCanon);
  vertex(30, -alturaCanon);
  vertex(20, -10);
  endShape(CLOSE);
  rotate(-angulo);
  fill(80, 80, 80);
  beginShape();
  vertex(0, -grosorBase/2);
  vertex(longitudCanon * 0.7, -grosorBoca/2);
  vertex(longitudCanon * 0.7, grosorBoca/2);
  vertex(0, grosorBase/2);
  endShape(CLOSE);
  fill(70, 70, 70);
  for (let x = 10; x < longitudCanon * 0.7; x += 15) {
    let grosorAro = map(x, 0, longitudCanon * 0.7, grosorBase, grosorBoca);
    ellipse(x, 0, grosorAro * 1.1, grosorAro * 1.1);
  }
  fill(30, 30, 30);
  ellipse(longitudCanon * 0.7, 0, grosorBoca * 0.7);
  fill(90, 90, 90);
  rect(0, -grosorBase/2, 5, grosorBase);
  pop();
}

function mostrarContadorIntentos() {
  textSize(30);
  textAlign(CENTER, TOP);
  textFont(pressStart2P);
  fill(255, 215, 0);
  text("INTENTOS: " + contadorLanzamientos, width/2, 40);
}

function actualizarPelota() {
  if (!pelotaLanzada) {
    let angulo = radians(controlAngulo.value());
    let longitudCanon = 70;
    pelota.x = 50 + longitudCanon * cos(angulo);
    pelota.y = height - 50 - longitudCanon * sin(angulo);
  } else {
    pelota.x += pelota.vx;
    pelota.y -= pelota.vy;
    pelota.vy -= pelota.gravedad;
    verificarImpacto();
  }
}

function dibujarPelota() {
  contadorParpadeosColor += velocidadParpadeo;
  fill(
    255 * abs(sin(contadorParpadeosColor)),
    150 * abs(sin(contadorParpadeosColor + PI/3)),
    100 * abs(sin(contadorParpadeosColor + 2*PI/3))
  );
  noStroke();
  ellipse(pelota.x, pelota.y, pelota.r * 2);
  if (pelotaLanzada && frameCount % 6 < 3) {
    fill(255, 255, 255, 150);
    ellipse(pelota.x, pelota.y, pelota.r * 2.5);
  }
}

function dibujarAro() {
  noFill();
  strokeWeight(3);
  stroke(255, 215, 0, 150 + 105 * sin(frameCount * 0.1));
  ellipse(aro.x, aro.y, aro.w, aro.h);
  strokeWeight(1);
  stroke(255, 255, 255, 100);
  ellipse(aro.x, aro.y, aro.w - 15, aro.h - 15);
  if (frameCount % 30 < 15) {
    stroke(255, 255, 255, 150);
    strokeWeight(2);
    line(aro.x - aro.w/2, aro.y, aro.x + aro.w/2, aro.y);
    line(aro.x, aro.y - aro.h/2, aro.x, aro.y + aro.h/2);
  }
}

function mostrarControles() {
  textFont(pressStart2P);
  mostrarAngulo.html(controlAngulo.value() + "°");
  mostrarPotencia.html(controlPotencia.value());
  fill(255);
  textSize(20);
  
  text("Ángulo:", controlAngulo.x - 70, controlAngulo.y );
  text("Fuerza:", controlPotencia.x - 70, controlPotencia.y + 5);
}

function lanzarPelota() {
  if (!pelotaLanzada) {
    contadorLanzamientos++;
    let angulo = radians(controlAngulo.value());
    let velocidad = 2.5;
    pelota.vx = cos(angulo) * controlPotencia.value() * velocidad;
    pelota.vy = sin(angulo) * controlPotencia.value() * velocidad;
    pelotaLanzada = true;
  }
}

function verificarImpacto() {
  if (pelota.x < -pelota.r * 2 || pelota.x > width + pelota.r * 2 || pelota.y < -pelota.r * 2) {
    if (!mensajeFueraRango) mostrarMensajeFueraRango();
    reiniciarPelota();
    return;
  }
  if (pelota.y + pelota.r >= height) {
    reiniciarPelota();
    return;
  }
  if (dist(pelota.x, pelota.y, aro.x, aro.y) < (aro.w / 2 + pelota.r)) {
    mostrarMensajeGanaste();
    reiniciarPelota();
  }
}

function mostrarMensajeFueraRango() {
  if (mensajeFueraRango) mensajeFueraRango.remove();
  mensajeFueraRango = createP("La pelota salió del rango");
  mensajeFueraRango.position(width/2 - 150, height/2 - 30);
  mensajeFueraRango.style('color', '#FF5555');
  mensajeFueraRango.style('font-size', '20px');
  mensajeFueraRango.style('font-family', 'PressStart2P-Regular');
  mensajeFueraRango.style('background-color', 'rgba(0,0,0,0.7)');
  mensajeFueraRango.style('padding', '20px');
  mensajeFueraRango.style('border-radius', '10px');
  mensajeFueraRango.style('text-align', 'center');
  mensajeFueraRango.style('z-index', '9999');
  mensajeFueraRango.style('width', '300px');
  tiempoOcultarMensaje = frameCount + 60;
}

function gestionarMensajes() {
  if (mensajeFueraRango && frameCount >= tiempoOcultarMensaje) {
    mensajeFueraRango.remove();
    mensajeFueraRango = null;
  }
}

function mostrarMensajeGanaste() {
  if (mensajeGanaste) mensajeGanaste.remove();
  mensajeGanaste = createP(`¡Ganaste!<br>Intentos: ${contadorLanzamientos}`);
  mensajeGanaste.position(width/2 - 150, height/2 - 100);
  mensajeGanaste.style('color', 'gold');
  mensajeGanaste.style('font-size', '28px');
  mensajeGanaste.style('text-align', 'center');
  mensajeGanaste.style('font-family', 'PressStart2P-Regular');
  mensajeGanaste.style('background-color', 'rgba(0,0,0,0.7)');
  mensajeGanaste.style('padding', '20px');
  mensajeGanaste.style('border-radius', '10px');
  mensajeGanaste.style('z-index', '9999');
  mensajeGanaste.style('width', '350px');
  mensajeGanaste.style('line-height', '1.5');
  guardarRankingTiroParabolico();
  noLoop();
  mostrarBotones();
}
function mostrarBotones() {
  botonReiniciar.show();
  botonSalir.show();
}

function reiniciarPelota() {
  pelota.x = pelota.baseX;
  pelota.y = pelota.baseY;
  pelota.vx = 0;
  pelota.vy = 0;
  pelotaLanzada = false;
}

function reiniciarJuego() {
  contadorLanzamientos = 0;
  reiniciarPelota();
  crearAro();
  if (mensajeGanaste) mensajeGanaste.remove();
  botonReiniciar.hide();
  botonSalir.hide();
  loop();
}

function salirJuego() {
  window.location.href = "../../pantallaJuegos.html";
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

window.addEventListener('load', function() {
    const volverBtn = document.getElementById('icono-volver');
    volverBtn.addEventListener('click', function() {
    window.location.href = "../../pantallaJuegos.html";
  });
});

function guardarRankingTiroParabolico() {
    const nombreJugador = localStorage.getItem('nombreUsuario') || 'Anónimo';
    let ranking = JSON.parse(localStorage.getItem('rankingTiroParabolico')) || [];

    const nuevaPuntuacion = {
        nombre: nombreJugador,
        lanzamientos: contadorLanzamientos,
        fecha: new Date().toLocaleDateString()
    };

    const indiceExistente = ranking.findIndex(item => item.nombre === nombreJugador);

    if (indiceExistente !== -1) {
        // Si la nueva puntuación es mejor (menos lanzamientos), actualizar
        if (contadorLanzamientos < ranking[indiceExistente].lanzamientos) {
            ranking[indiceExistente] = nuevaPuntuacion;
        }
    } else {
        ranking.push(nuevaPuntuacion);
    }

    // Ordenar por menor número de lanzamientos
    ranking.sort((a, b) => a.lanzamientos - b.lanzamientos);

    // Mantener solo las 3 mejores puntuaciones
    ranking = ranking.slice(0, 3);

    // Guardar en localStorage
    localStorage.setItem('rankingTiroParabolico', JSON.stringify(ranking));
}
