let num1, num2, respuesta, indiceOpCorrecta;
let puntos = 0, errores = 0, tiempo = 0, dificultad = 10;
let intervalo;

// Elementos del DOM
const elementos = {
    txt_multi: document.getElementById("multiplicacion"),
    op1: document.getElementById("op1"),
    op2: document.getElementById("op2"),
    op3: document.getElementById("op3"),
    txt_menj: document.getElementById("menj"),
    txt_resultado: document.getElementById("resultado"),
    puntos: document.getElementById("puntos"),
    errores: document.getElementById("errores"),
    cronometro: document.getElementById("cronometro")
};

function comenzar() {
    elementos.txt_resultado.innerHTML = "?";
    elementos.txt_menj.innerHTML = "";
    dificultad = 10 + Math.floor(puntos / 3) * 10;

    num1 = Math.round(Math.random() * dificultad);
    num2 = Math.round(Math.random() * dificultad);

    const operacion = Math.random() < 0.5 ? "+" : "-";
    
    if (operacion === "+") {
        respuesta = num1 + num2;
        elementos.txt_multi.innerHTML = `${num1} + ${num2} =`;
    } else {
        if (num1 < num2) [num1, num2] = [num2, num1];
        respuesta = num1 - num2;
        elementos.txt_multi.innerHTML = `${num1} - ${num2} =`;
    }

    indiceOpCorrecta = Math.floor(Math.random() * 3);
    let respuestas = [];

    while (respuestas.length < 2) {
        let falsa = respuesta + Math.floor(Math.random() * 10) - 5;
        if (falsa !== respuesta && !respuestas.includes(falsa) && falsa >= 0) {
            respuestas.push(falsa);
        }
    }

    respuestas.splice(indiceOpCorrecta, 0, respuesta);
    elementos.op1.innerHTML = respuestas[0];
    elementos.op2.innerHTML = respuestas[1];
    elementos.op3.innerHTML = respuestas[2];

    elementos.op1.style.backgroundColor = "#fff";
    elementos.op2.style.backgroundColor = "#fff";
    elementos.op3.style.backgroundColor = "#fff";
}

function controlarRespuesta(opcionElegida) {
    elementos.txt_resultado.innerHTML = opcionElegida.innerHTML;

    if (respuesta == parseInt(opcionElegida.innerHTML)) {
        elementos.txt_menj.innerHTML = "EXCELENTE!!!";
        elementos.txt_menj.style.color = "#0011FF";
        puntos++;
        elementos.puntos.innerHTML = `Puntos: ${puntos}`;
        opcionElegida.style.backgroundColor = "#00FF70";
        setTimeout(comenzar, 2000);
    } else {
        errores++;
        elementos.txt_menj.innerHTML = "INTENTA DE NUEVO!!!";
        elementos.txt_menj.style.color = "red";
        elementos.errores.innerHTML = `Errores: ${errores}/3`;
        opcionElegida.style.backgroundColor = "#FF6666";

        if (errores >= 3) {
            elementos.txt_menj.innerHTML = "😵¡Juego Terminado!";
            clearInterval(intervalo);
            desactivarOpciones();
            guardarPuntuacion();
        } else {
            setTimeout(limpiar, 2000);
        }
    }
}

function limpiar() {
    elementos.txt_resultado.innerHTML = "?";
    elementos.txt_menj.innerHTML = "";
    elementos.op1.style.backgroundColor = "#fff";
    elementos.op2.style.backgroundColor = "#fff";
    elementos.op3.style.backgroundColor = "#fff";
}

function desactivarOpciones() {
    elementos.op1.onclick = null;
    elementos.op2.onclick = null;
    elementos.op3.onclick = null;
}

function iniciarCronometro() {
    intervalo = setInterval(() => {
        tiempo++;
        elementos.cronometro.innerHTML = `Tiempo: ${tiempo}s`;
    }, 1000);
}

function reiniciarJuego() {
    puntos = 0;
    errores = 0;
    tiempo = 0;
    dificultad = 10;
    elementos.puntos.innerHTML = `Puntos: ${puntos}`;
    elementos.errores.innerHTML = `Errores: ${errores}/3`;
    elementos.cronometro.innerHTML = `Tiempo: ${tiempo}s`;
    elementos.txt_menj.innerHTML = "";
    
    clearInterval(intervalo);
    iniciarCronometro();

    elementos.op1.onclick = () => controlarRespuesta(elementos.op1);
    elementos.op2.onclick = () => controlarRespuesta(elementos.op2);
    elementos.op3.onclick = () => controlarRespuesta(elementos.op3);

    comenzar();
}

function guardarPuntuacion() {
    const nombreJugador = localStorage.getItem('nombreUsuario') || 'Anónimo';
    let ranking = JSON.parse(localStorage.getItem('rankingSums')) || [];
    
    // Agregar nueva puntuación
    const nuevaPuntuacion = {
        nombre: nombreJugador,
        puntos: puntos,
        tiempo: tiempo,
        fecha: new Date().toLocaleDateString()
    };
    
    // Verificar si ya existe una puntuación para este jugador
    const indiceExistente = ranking.findIndex(item => item.nombre === nombreJugador);
    
    if (indiceExistente !== -1) {
        // Si la nueva puntuación es mejor, actualizar
        if (puntos > ranking[indiceExistente].puntos || 
           (puntos === ranking[indiceExistente].puntos && tiempo < ranking[indiceExistente].tiempo)) {
            ranking[indiceExistente] = nuevaPuntuacion;
        }
    } else {
        ranking.push(nuevaPuntuacion);
    }
    
    // Ordenar por puntos (descendente) y luego por tiempo (ascendente)
    ranking.sort((a, b) => b.puntos - a.puntos || a.tiempo - b.tiempo);
    
    // Mantener solo las 3 mejores puntuaciones
    ranking = ranking.slice(0, 3);
    
    // Guardar en localStorage
    localStorage.setItem('rankingSums', JSON.stringify(ranking));
    
    // Mostrar mensaje de puntuación guardada
    elementos.txt_menj.innerHTML = `Puntuación guardada: ${puntos} PTS`;
    elementos.txt_menj.style.color = "#fbc531";
}

function toggleAudio() {
    const musica = document.getElementById("musicaFondo");
    const icono = document.getElementById("icono-audio");
    musica.muted = !musica.muted;
    icono.src = musica.muted ? "assets/audio-off.png" : "assets/audio-on.png";
    icono.alt = musica.muted ? "Audio Off" : "Audio On";
}

function volverAlMenu() {
    window.location.href = "../../pantallaJuegos.html";
}

window.onload = function() {
    comenzar();
    iniciarCronometro();
};