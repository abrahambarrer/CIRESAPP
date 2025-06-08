const carousel = document.querySelector(".carousel");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const loader = document.getElementById("loader");

let userInteracted = false;
const names = [
  'arquimedes','bell','curie','dalton','darwin','daVinci',
  'descartes','edison','einstein','erwin','fleming','galileo',
  'hawking','mendel','mendeleyev','newton','nicolas','pasteur',
  'pitagoras','tesla'
];

shuffleArray(names);

const totalCards = names.length;
let currentIndex = 0;
let isLocked = false;

const cards = [];
const audioAnverso = [];
const audioReverso = [];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function preloadAssets() {
  const promises = [];

  names.forEach((name, i) => {
    // Preload imágenes
    const frontImg = new Image();
    frontImg.src = `assets/${name}_anverso.png`;
    promises.push(new Promise((resolve) => {
      frontImg.onload = resolve;
      frontImg.onerror = resolve;
    }));

    const backImg = new Image();
    backImg.src = `assets/${name}_reverso.png`;
    promises.push(new Promise((resolve) => {
      backImg.onload = resolve;
      backImg.onerror = resolve;
    }));

    // Preload audios
    const audioA = new Audio(`sounds/anverso/${name}_anverso.mp3`);
    const audioR = new Audio(`sounds/reverso/${name}_reverso.mp3`);

    audioAnverso[i] = audioA;
    audioReverso[i] = audioR;

    promises.push(new Promise((resolve) => {
      audioA.oncanplaythrough = resolve;
      audioA.onerror = resolve;
    }));
    promises.push(new Promise((resolve) => {
      audioR.oncanplaythrough = resolve;
      audioR.onerror = resolve;
    }));
  });

  return Promise.all(promises);
}

function setupCards() {
  for (let i = 0; i < totalCards; i++) {
    const name = names[i];

    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = i;

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-face", "card-front");
    const imgFront = document.createElement("img");
    imgFront.src = `assets/${name}_anverso.png`;
    cardFront.appendChild(imgFront);

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-face", "card-back");
    const imgBack = document.createElement("img");
    imgBack.src = `assets/${name}_reverso.png`;
    cardBack.appendChild(imgBack);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    carousel.appendChild(card);
    cards.push(card);

    card.addEventListener("click", () => {
      if (isLocked || i !== currentIndex) return;
      card.classList.add("flipped");
      playAudio(audioReverso[i]);
    });
  }
}

function resetCardFlipStates() {
  cards.forEach(card => card.classList.remove("flipped"));
}

function playAudio(audio) {
  if (!userInteracted) return;
  isLocked = true;
  disableButtons();

  audio.currentTime = 0;
  audio.play().catch((err) => {
    console.warn("No se pudo reproducir audio:", err);
    isLocked = false;
    updateButtonStates();
    cards[currentIndex].classList.remove("flipped");
  });

  audio.onended = () => {
    isLocked = false;
    updateButtonStates();
    cards[currentIndex].classList.remove("flipped");
  };
}

function disableButtons() {
  btnPrev.disabled = true;
  btnNext.disabled = true;
}

function updateButtonStates() {
  btnPrev.disabled = currentIndex === 0 || isLocked;
  btnNext.disabled = currentIndex === totalCards - 1 || isLocked;
}

function render() {
  resetCardFlipStates();

  cards.forEach((card, index) => {
    const name = names[index];
    const imgFront = card.querySelector(".card-front img");
    const imgBack = card.querySelector(".card-back img");
    imgFront.src = `assets/${name}_anverso.png`;
    imgBack.src = `assets/${name}_reverso.png`;

    if (index === currentIndex) {
      card.className = "card current";
    } else if (index === currentIndex + 1) {
      card.className = "card next1";
    } else if (index === currentIndex + 2) {
      card.className = "card next2";
    } else {
      card.className = "card hidden";
    }
  });

  updateButtonStates();
  playAudio(audioAnverso[currentIndex]);
}

btnPrev.addEventListener("click", () => {
  if (currentIndex > 0 && !isLocked) {
    currentIndex--;
    render();
  }
});

btnNext.addEventListener("click", () => {
  if (currentIndex < totalCards - 1 && !isLocked) {
    currentIndex++;
    render();
  }
});

// Iniciar preload
preloadAssets().then(() => {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('intro-overlay').style.display = 'flex';

  document.getElementById('start-button').addEventListener('click', () => {
    userInteracted = true;
    document.getElementById('intro-overlay').style.display = 'none';
    setupCards();
    render();
  });
});


window.addEventListener('load', function() {
    const volverBtn = document.getElementById('icono-volver');
    volverBtn.addEventListener('click', function() {
    window.location.href = "../../pantallaJuegos.html";
  });
});