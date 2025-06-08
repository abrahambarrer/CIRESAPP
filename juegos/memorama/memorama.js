const images = [
      "cilindro", "circulo", "cono", "cruz", "cuadrado", "cubo", "cuerposGeometricos", "dodecaedro",
      "esfera", "estrella", "figurasPlanas", "hexagono", "juegoGeometrico", "lineasCurvas",
      "lineasParalelas", "octaedro", "ovalo", "paralelepipedo", "pentagono", "piramideCuadrangular",
      "piramideHexagonal", "piramideTriangular", "prismaTriangular", "rectangulo", "rombo",
      "trapecio", "trapezoide", "triangulo"
    ];
const board = document.getElementById("game-board");
const timerDisplay = document.getElementById("time");
const attemptsDisplay = document.getElementById("attempts");
const matchesDisplay = document.getElementById("matches");
const resetButton = document.getElementById("resetButton");
const flipSound = document.getElementById("flip-sound");
const matchSound = document.getElementById("match-sound");
const bgMusic = document.getElementById("bg-music");
const overlay = document.getElementById("overlay");
const finalScore = document.getElementById("final-score");
const newGameButton = document.getElementById("newGame");
const totalPairs = images.length; // número total de pares
const startOverlay = document.getElementById("start-overlay");
const startGameBtn = document.getElementById("startGameBtn");

let firstCard, secondCard;
let lockBoard = false;
let matches = 0;
let attempts = 0;
let timer;
let seconds = 0;
let hasStarted = false;

function startTimer() {
    timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = `Tiempo: ${seconds}s`;
    }, 1000);
    bgMusic.play();
}

function stopTimer() {
    clearInterval(timer);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    const imageSet = shuffle([...images, ...images]); // duplicar y mezclar
    board.innerHTML = "";

    imageSet.forEach(name => {
    const card = document.createElement("div");
    card.classList.add("card");

    const inner = document.createElement("div");
    inner.classList.add("card-inner");

    const front = document.createElement("div");
    front.classList.add("card-front");
    front.style.backgroundImage = "url('assets/anverso.png')";

    const back = document.createElement("div");
    back.classList.add("card-back");
    back.style.backgroundImage = `url('assets/${name}.png')`;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    card.dataset.name = name;

    card.addEventListener("click", handleCardClick);
    board.appendChild(card);
    });
}

function handleCardClick(e) {
    if (lockBoard) return;

    const card = e.currentTarget;
    if (card === firstCard || card.classList.contains("flipped")) return;

    if (!hasStarted) {
    hasStarted = true;
    startTimer();
    }

    card.classList.add("flipped");
    flipSound.currentTime = 0;
    flipSound.play();

    if (!firstCard) {
    firstCard = card;
    return;
    }

    secondCard = card;
    lockBoard = true;
    attempts++;
    attemptsDisplay.textContent = `Intentos: ${attempts}`;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
    setTimeout(() => {
        matchSound.currentTime = 0;
        matchSound.play();
        disableCards();
    }, 700);
    } else {
    setTimeout(unflipCards, 1000);
    }
}

function disableCards() {
    firstCard.removeEventListener("click", handleCardClick);
    secondCard.removeEventListener("click", handleCardClick);

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matches++;
    matchesDisplay.textContent = `Pares: ${matches}/28`;

    resetBoard();
}

function unflipCards() {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function resetGame() {
    stopTimer();
    bgMusic.pause();
    bgMusic.currentTime = 0;
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
    matches = 0;
    attempts = 0;
    seconds = 0;
    hasStarted = false;
    timerDisplay.textContent = "Tiempo: 0s";
    attemptsDisplay.textContent = "Intentos: 0";
    matchesDisplay.textContent = "Pares: 0/28";
    createBoard();
}

resetButton.addEventListener("click", resetGame);

createBoard();

function disableCards() {
  firstCard.removeEventListener("click", handleCardClick);
  secondCard.removeEventListener("click", handleCardClick);

  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  matches++;
  matchesDisplay.textContent = `Pares: ${matches}/28`;

  resetBoard();

  if (matches === totalPairs) {
    endGame();
  }
}

function endGame() {
  stopTimer();
  bgMusic.pause();

  document.getElementById('final-score').innerHTML = `
      Intentos: ${attempts}<br>
      Tiempo: ${seconds}s
    `;
  overlay.style.display = "flex";
  guardarRankingMemorama();
}

newGameButton.addEventListener("click", () => {
  overlay.style.display = "none";
  resetGame();
});

function backToMenu() {
  // Aquí podrías redirigir o cerrar ventana, dependiendo del entorno
  window.location.href = "../../pantallaJuegos.html"; // o simplemente cerrar si es app
}

function guardarRankingMemorama() {
    const nombreJugador = localStorage.getItem('nombreUsuario') || 'Anónimo';
    let ranking = JSON.parse(localStorage.getItem('rankingMemorama')) || [];

    const nuevaPuntuacion = {
        nombre: nombreJugador,
        intentos: attempts,
        tiempo: seconds
    };

    const indiceExistente = ranking.findIndex(item => item.nombre === nombreJugador);

    if (indiceExistente !== -1) {
        // Reemplazar solo si tiene menos intentos o igual intentos y mejor tiempo
        const existente = ranking[indiceExistente];
        if (
            nuevaPuntuacion.intentos < existente.intentos ||
            (nuevaPuntuacion.intentos === existente.intentos && nuevaPuntuacion.tiempo < existente.tiempo)
        ) {
            ranking[indiceExistente] = nuevaPuntuacion;
        }
    } else {
        ranking.push(nuevaPuntuacion);
    }

    // Ordenar por intentos (ascendente), luego tiempo (ascendente)
    ranking.sort((a, b) => a.intentos - b.intentos || a.tiempo - b.tiempo);

    // Guardar solo los 3 mejores
    ranking = ranking.slice(0, 3);

    // Guardar en localStorage
    localStorage.setItem('rankingMemorama', JSON.stringify(ranking));
}

window.addEventListener('load', function() {
    const volverBtn = document.getElementById('icono-volver');
    volverBtn.addEventListener('click', function() {
    window.location.href = "../../pantallaJuegos.html";
  });
});

startGameBtn.addEventListener("click", () => {
  bgMusic.play().catch(err => {
    console.warn("No se pudo reproducir la música automáticamente:", err);
  });
  startOverlay.style.display = "none";
});