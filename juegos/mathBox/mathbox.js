let rekt;
let food;
let enemies;
let score;
let speed = 2;
let crashSound;
let popSound;
let qNum = 0;
let sNum = 0;
let maxSNum = 10;
let maxNum = 12;
let musicStarted = false;
let bgMusic;
let joystick;
let joyDir = { x: 0, y: 0 };
let moved = false;

bgMusic = new sound("sounds/cuadros.mp3");

function setup(){
  createCanvas(600,600);
  textAlign(CENTER);3

  // Inicializar valores
  sNum = Math.floor(random(1, maxSNum));
  qNum = Math.floor(random(1, maxNum));
  rekt = new Rek();
  enemies = [];
  score = 0;
  food = new Food(30, 30, rndDir(), rndDir());
  enemies[0] = new Enemy(20, 20, rndDir(), rndDir());

  // Cargar sonidos
  crashSound = new sound("sounds/crash.mp3");
  popSound = new sound("sounds/point.mp3");

  // Música de fondo
  bgMusic.sound.loop = true;
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }    
  this.rewind = function() {
    this.sound.currentTime = 0; 
  }
}

function Rek() {
  this.x = 300;
  this.y = 300;
  this.size = 30;
  this.show = function() {
    fill(220);
    stroke(160, 80, 100);
    strokeWeight(3);
    rect(this.x, this.y, this.size, this.size, 5);
    stroke(0);
    strokeWeight(1);
  }
}

function Food(x, y, velX, velY) {
  this.x = x;
  this.y = y;
  this.w = 60;
  this.velX = velX;
  this.velY = velY;
  this.show = function() {
    let red = map(this.x, 0, 600, 150, 255);
    let green = map(this.y, 0, 600, 150, 255);
    fill(red, green, sin(frameCount / 15) * 125 + 125);
    stroke(255);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.w, 5);
    fill(0);
    text(sNum * qNum, this.x + this.w / 2, this.y + 40);
    this.x += this.velX;
    this.y += this.velY;

    if (this.y <= 0 || this.y >= height - this.w) this.velY *= -1;
    if (this.x <= 0 || this.x >= width - this.w) this.velX *= -1;

    if (this.x + this.w > rekt.x && this.y + this.w > rekt.y && this.x < rekt.x + rekt.size && this.y < rekt.y + rekt.size) {
      popSound.rewind();
      popSound.play();
      score++;
      rekt.size += 0.2;
      this.pickSpot();
      sNum = Math.floor(random(1, maxSNum));
      qNum = Math.floor(random(1, maxNum));
      for (let i = 0; i < enemies.length; i++) {
        enemies[i].pickSpot();
        enemies[i].pickRnd();
      }
    }
  }
  this.pickSpot = function() {
    let newX = random(0, width - this.w);
    let newY = random(0, height - this.w);
    if (dist(newX, newY, rekt.x, rekt.y) < rekt.size + 200) {
      this.pickSpot();
    } else {
      food = new Food(newX, newY, rndDir(), rndDir());
    }
  }
}

function Enemy(x, y, velX, velY) {
  this.x = x;
  this.y = y;
  this.w = 60;
  this.velX = velX;
  this.velY = velY;
  this.rnd = Math.floor(random(10) + 1);
  this.show = function() {
    let red = map(this.x, 0, 600, 150, 255);
    let green = map(this.y, 0, 600, 150, 255);
    fill(red, green, sin(frameCount / 15) * 125 + 125);
    stroke(255);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.w, 5);
    fill(0);
    text(sNum * qNum + this.rnd, this.x + this.w / 2, this.y + 40);
    this.x += this.velX;
    this.y += this.velY;

    if (this.y <= 0 || this.y >= height - this.w) this.velY *= -1;
    if (this.x <= 0 || this.x >= width - this.w) this.velX *= -1;

    if (this.x + this.w > rekt.x && this.y + this.w > rekt.y && this.x < rekt.x + rekt.size && this.y < rekt.y + rekt.size) {
    crashSound.play();
    mostrarFinDelJuego();
  }
  }
  this.pickSpot = function() {
    let newX = random(0, width - this.w);
    let newY = random(0, height - this.w);
    if (dist(newX, newY, rekt.x, rekt.y) < rekt.size + 200) {
      this.pickSpot();
    } else {
      this.x = newX;
      this.y = newY;
      this.velX = rndDir();
      this.velY = rndDir();
    }
  }
  this.pickRnd = function() {
    let rand = Math.floor(random(-20, 20));
    if (rand === 0) {
      this.pickRnd();
    } else {
      this.rnd = rand;
    }
  }
}

function mostrarFinDelJuego() {
  const mensaje = document.getElementById("mensaje-fin");
  mensaje.style.display = "block";
  noLoop();
  bgMusic.stop();
  guardarRankingMathBox();
}

function draw(){
  background(0, 0, 0);

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].show();
  }

  food.show();
  fill(255);
  textSize(30);
  text(sNum + " x " + qNum, 300, 60);
  textSize(20);
  text("Score: " + score, 300, 540);
  textSize(30);

  if (floor(score / 5) + 1 > enemies.length) {
    enemies.push(new Enemy(0, 0, rndDir(), rndDir()));
    enemies[enemies.length - 1].pickSpot();
  }

  if (keyIsDown(RIGHT_ARROW)) {
  rekt.x += 3 * speed;
  moved = true;
}
if (keyIsDown(LEFT_ARROW)) {
  rekt.x -= 3 * speed;
  moved = true;
}
if (keyIsDown(DOWN_ARROW)) {
  rekt.y += 3 * speed;
  moved = true;
}
if (keyIsDown(UP_ARROW)) {
  rekt.y -= 3 * speed;
  moved = true;
}

// Joystick movement
if (joyDir.x !== 0 || joyDir.y !== 0) {
  rekt.x += joyDir.x * speed * 2;
  rekt.y -= joyDir.y * speed * 2;
  moved = true;
}

if (moved) startMusic();

  rekt.x = constrain(rekt.x, 0, width - rekt.size);
  rekt.y = constrain(rekt.y, 0, height - rekt.size);
  rekt.show();
}

function rndDir() {
  return random(-6, 6);
}

function startMusic() {
  if (!musicStarted) {
    bgMusic.play();
    musicStarted = true;
  }
}

let musicMuted = false;

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("musicToggle");
  const musicIcon = document.getElementById("musicIcon");

  toggleButton.addEventListener("click", function () {
    if (!musicStarted) {
      startMusic(); // Inicia la música si aún no ha empezado
    }

    if (musicMuted) {
      bgMusic.sound.muted = false;
      musicIcon.src = "assets/audio-on.png";
    } else {
      bgMusic.sound.muted = true;
      musicIcon.src = "assets/audio-off.png";
    }

    musicMuted = !musicMuted;
  });
});

  const joystickZone = document.getElementById('joystick-zone');
  const joystickManager = nipplejs.create({
    zone: joystickZone,
    mode: 'static',
    position: { left: '60px', bottom: '60px' },
    color: 'white',
    size: 100
  });

  joystickManager.on('move', function (evt, data) {
    const angle = data.angle.degree;
    const distance = data.distance;

    // Convierte ángulo en vector unitario
    joyDir.x = Math.cos((angle * Math.PI) / 180);
    joyDir.y = Math.sin((angle * Math.PI) / 180);
  });

  joystickManager.on('end', function () {
    joyDir.x = 0;
    joyDir.y = 0;
  });

window.addEventListener('load', function() {
  const volverBtn = document.getElementById('btn-volver');
  volverBtn.addEventListener('click', function() {
    bgMusic.stop();
    window.location.href = "../../pantallaJuegos.html";
  });

  const reiniciarBtn = document.getElementById('reiniciar');
  reiniciarBtn.addEventListener('click', function () {
  bgMusic.rewind();
  if (!musicMuted) {
    bgMusic.play();
  }

  // Sincroniza el icono con el estado de mute
  const musicIcon = document.getElementById("musicIcon");
  musicIcon.src = musicMuted ? "assets/audio-off.png" : "assets/audio-on.png";

  document.getElementById("mensaje-fin").style.display = "none";
  score = 0;
  enemies = [];
  setup();
  loop();
  });
});

function guardarRankingMathBox() {
    const nombreJugador = localStorage.getItem('nombreUsuario') || 'Anónimo';
    let ranking = JSON.parse(localStorage.getItem('rankingMathBox')) || [];

    const nuevaPuntuacion = {
        nombre: nombreJugador,
        puntos: score,
        fecha: new Date().toLocaleDateString()
    };

    const indiceExistente = ranking.findIndex(item => item.nombre === nombreJugador);

    if (indiceExistente !== -1) {
        // Si la nueva puntuación es mayor, actualizar
        if (score > ranking[indiceExistente].puntos) {
            ranking[indiceExistente] = nuevaPuntuacion;
        }
    } else {
        ranking.push(nuevaPuntuacion);
    }

    // Ordenar por puntos de forma descendente
    ranking.sort((a, b) => b.puntos - a.puntos);

    // Conserlet solo los 3 mejores puntajes
    ranking = ranking.slice(0, 3);

    // Guardar en localStorage
    localStorage.setItem('rankingMathBox', JSON.stringify(ranking));
}