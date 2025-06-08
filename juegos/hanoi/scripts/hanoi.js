const totalDisks = 6;
let moveCount = 0;
let draggedDisk = null;
let startTime = null;
let timerInterval = null;
const bgMusic = document.getElementById('bg-music');
const putSound = document.getElementById('put-sound');

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').textContent = `Tiempo: ${elapsed}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  clearInterval(timerInterval);
  document.getElementById('timer').textContent = `Tiempo: 0s`;
  startTime = null;
}

function updateCounter() {
  document.getElementById('counter').textContent = `Movimientos: ${moveCount} / 63`;
}

function resetGame() {
  document.querySelectorAll('.pole').forEach(pole => pole.innerHTML = '');
  moveCount = 0;
  updateCounter();

  const pole0 = document.getElementById('pole-0');
  for (let i = totalDisks; i >= 1; i--) {
    const disk = document.createElement('div');
    disk.className = `disk disk-${i}`;
    disk.style.width = `${30 + i * 15}px`;
    disk.dataset.size = i;
    disk.draggable = true;
    disk.addEventListener('dragstart', onDragStart);
    disk.addEventListener('touchstart', onTouchStart);
    pole0.appendChild(disk);
  }

  document.getElementById('overlay').classList.remove('show');
  resetTimer();
  startTimer();

  // Iniciar música de fondo si no está ya sonando
  if (bgMusic.paused) {
    bgMusic.volume = 0.4; // Puedes ajustar el volumen
    bgMusic.play().catch(() => {
      // Algunos navegadores requieren interacción del usuario
    });
  }
}

function onDragStart(e) {
  const pole = e.target.parentElement;
  if (pole.lastElementChild !== e.target) {
    e.preventDefault();
    return;
  }
  draggedDisk = e.target;
}

document.querySelectorAll('.pole').forEach(pole => {
  pole.addEventListener('dragover', e => e.preventDefault());
  pole.addEventListener('drop', function (e) {
    if (!draggedDisk) return;
    const topDisk = this.lastElementChild;
    if (!topDisk || +draggedDisk.dataset.size < +topDisk.dataset.size) {
      this.appendChild(draggedDisk);
      moveCount++;
      putSound.currentTime = 0;
      putSound.play();
      updateCounter();
      checkWin();
    }
    draggedDisk = null;
  });
});

function checkWin() {
  const pole2 = document.getElementById('pole-2');
  if (pole2.children.length === totalDisks) {
    stopTimer();
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('final-score').innerHTML = `Movimientos realizados: ${moveCount}<br>Tiempo: ${elapsed}s`;
    document.getElementById('overlay').classList.add('show');
    guardarRankingHanoi(moveCount, elapsed);
  }
}

function backToMenu() {
  window.location.href = "../../pantallaJuegos.html";
}

document.getElementById('resetButton').addEventListener('click', resetGame);
document.getElementById('newGame').addEventListener('click', resetGame);

window.onload = resetGame;

window.addEventListener('load', function() {
    const volverBtn = document.getElementById('icono-volver');
    volverBtn.addEventListener('click', function() {
    window.location.href = "../../pantallaJuegos.html";
  });
});

function onTouchStart(e) {
  const target = e.target;
  const pole = target.parentElement;

  if (pole.lastElementChild !== target) return;

  draggedDisk = target;

  const touch = e.touches[0];
  const offsetX = touch.clientX - target.getBoundingClientRect().left;
  const offsetY = touch.clientY - target.getBoundingClientRect().top;

  target.style.position = 'fixed';
  target.style.zIndex = 1000;
  target.style.pointerEvents = 'none'; // evita interferencia
  target.style.transition = 'none'; // sin animaciones mientras lo arrastras

  const moveAt = (touch) => {
    target.style.left = `${touch.clientX - offsetX}px`;
    target.style.top = `${touch.clientY - offsetY}px`;
  };

  moveAt(touch);

  function onTouchMove(e) {
    moveAt(e.touches[0]);
  }

  function onTouchEnd(e) {
    const touchEnd = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touchEnd.clientX, touchEnd.clientY);
    const dropPole = elementBelow?.closest('.pole');

    target.style.position = '';
    target.style.zIndex = '';
    target.style.left = '';
    target.style.top = '';
    target.style.pointerEvents = '';
    target.style.transition = '';

    if (dropPole) {
      const topDisk = dropPole.lastElementChild;
      if (!topDisk || +draggedDisk.dataset.size < +topDisk.dataset.size) {
        dropPole.appendChild(draggedDisk);
        moveCount++;
        putSound.currentTime = 0;
        putSound.play();
        updateCounter();
        checkWin();
      }
    }

    draggedDisk = null;

    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  }

  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('touchend', onTouchEnd);
}

function guardarRankingHanoi(movimientos, tiempo) {
    const nombreJugador = localStorage.getItem('nombreUsuario') || 'Anónimo';
    let ranking = JSON.parse(localStorage.getItem('rankingHanoi')) || [];

    const nuevaEntrada = {
        nombre: nombreJugador,
        movimientos: movimientos,
        tiempo: tiempo,
        fecha: new Date().toLocaleDateString()
    };

    const indiceExistente = ranking.findIndex(item => item.nombre === nombreJugador);

    if (indiceExistente !== -1) {
        const actual = ranking[indiceExistente];

        if (
            movimientos < actual.movimientos ||
            (movimientos === actual.movimientos && tiempo < actual.tiempo)
        ) {
            ranking[indiceExistente] = nuevaEntrada;
        }
    } else {
        ranking.push(nuevaEntrada);
    }

    ranking.sort((a, b) => a.movimientos - b.movimientos || a.tiempo - b.tiempo);

    ranking = ranking.slice(0, 3);

    localStorage.setItem('rankingHanoi', JSON.stringify(ranking));
}

document.addEventListener('touchmove', function (e) {
  if (draggedDisk) {
    e.preventDefault();
  }
}, { passive: false });