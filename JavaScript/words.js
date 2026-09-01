const TEMAS_PALABRAS = {
  "saludos-despedidas": [
    { en: "hello",   es: "hola" },
    { en: "goodbye", es: "adiós" },
    { en: "welcome", es: "bienvenido" },
    { en: "please",  es: "por favor" },
  ],
  "colores": [
    { en: "red",    es: "rojo" },
    { en: "blue",   es: "azul" },
    { en: "green",  es: "verde" },
    { en: "yellow", es: "amarillo" },
    { en: "purple", es: "morado" },
    { en: "orange", es: "naranja" },
    { en: "black",  es: "negro" },
    { en: "white",  es: "blanco" },
    { en: "pink",   es: "rosado" },
  ],
  "objetos-clase": [
    { en: "backpack", es: "mochila" },
    { en: "pencil",   es: "lápiz" },
    { en: "notebook", es: "cuaderno" },
    { en: "ruler",    es: "regla" },
    { en: "scissors", es: "tijeras" },
    { en: "eraser",   es: "borrador" },
  ],
  "animales": [
    { en: "dog",    es: "perro" },
    { en: "cat",    es: "gato" },
    { en: "bird",   es: "pájaro" },
    { en: "fish",   es: "pez" },
    { en: "rabbit", es: "conejo" },
    { en: "turtle", es: "tortuga" },
    { en: "horse",  es: "caballo" },
    { en: "lion",   es: "león" },
  ],
  "partes-cuerpo": [
    { en: "head",  es: "cabeza" },
    { en: "hand",  es: "mano" },
    { en: "eye",   es: "ojo" },
    { en: "foot",  es: "pie" },
    { en: "ear",   es: "oreja" },
    { en: "arm",   es: "brazo" },
    { en: "nose",  es: "nariz" },
    { en: "mouth", es: "boca" },
  ],
};
 
/* Todas las palabras de los 5 temas, en un solo mazo. Se filtran
   las de una sola palabra (sin espacio) porque el juego oculta
   letras dentro de una sola palabra, no frases completas. */
const TODAS_LAS_PALABRAS = Object.values(TEMAS_PALABRAS)
  .flat()
  .filter(({ en }) => !en.includes(" "));
 
/* ---------------------------------------------------------
   2. CONFIGURACIÓN
--------------------------------------------------------- */
const CONFIG = {
  vidasIniciales: 3,
  puntosPorAcierto: 10,
  minLetrasFaltantes: 1,
  maxLetrasFaltantes: 3,
  puntosParaGanar: 100,
};
 
/* ---------------------------------------------------------
   3. ESTADO DEL JUEGO
--------------------------------------------------------- */
let estado = {
  vidas: CONFIG.vidasIniciales,
  puntaje: 0,
  jugando: false,
  palabraActual: null,     // { en, es }
  posicionesFaltantes: [], // índices de las letras ocultas, en orden
};
 
/* ---------------------------------------------------------
   4. REFERENCIAS AL DOM
--------------------------------------------------------- */
const palabraMostrada = document.getElementById("palabra-mostrada");
const pistaEspanol = document.getElementById("pista-espanol");
const inputLetras = document.getElementById("input-letras");
const vidasContenedor = document.getElementById("vidas");
const puntajeValor = document.getElementById("puntaje-valor");
const pantallaFin = document.getElementById("pantalla-fin");
const puntajeFinal = document.getElementById("puntaje-final");
const btnReiniciar = document.getElementById("btn-reiniciar");
const pantallaVictoria = document.getElementById("pantalla-victoria");
const puntajeVictoria = document.getElementById("puntaje-victoria");
const btnSeguirJugando = document.getElementById("btn-seguir-jugando");
 
/* ---------------------------------------------------------
   5. INICIO / REINICIO DEL JUEGO
--------------------------------------------------------- */
function iniciarJuego() {
  estado = {
    vidas: CONFIG.vidasIniciales,
    puntaje: 0,
    jugando: true,
    palabraActual: null,
    posicionesFaltantes: [],
  };
 
  actualizarVidasHUD();
  actualizarPuntajeHUD();
  pantallaFin.classList.add("oculto");
  pantallaVictoria.classList.add("oculto");
  inputLetras.disabled = false;
  inputLetras.value = "";
  inputLetras.focus();
 
  siguientePalabra();
}
 
btnReiniciar.addEventListener("click", iniciarJuego);
 
/* ---------------------------------------------------------
   6. ELEGIR SIGUIENTE PALABRA Y OCULTAR LETRAS AL AZAR
--------------------------------------------------------- */
function siguientePalabra() {
  const palabra = TODAS_LAS_PALABRAS[Math.floor(Math.random() * TODAS_LAS_PALABRAS.length)];
  const palabraMayus = palabra.en.toUpperCase();
 
  // Cuántas letras se ocultan (entre 1 y 3, sin pasarse de la
  // longitud de la palabra, por si acaso hay palabras muy cortas)
  const maxPosible = Math.min(CONFIG.maxLetrasFaltantes, palabraMayus.length - 1);
  const cantidadFaltantes = entero(CONFIG.minLetrasFaltantes, Math.max(CONFIG.minLetrasFaltantes, maxPosible));
 
  // Elige posiciones al azar sin repetir, y las ordena de
  // izquierda a derecha para que el estudiante las escriba en
  // el mismo orden en que aparecen en la palabra
  const posiciones = new Set();
  while (posiciones.size < cantidadFaltantes) {
    posiciones.add(Math.floor(Math.random() * palabraMayus.length));
  }
  const posicionesOrdenadas = [...posiciones].sort((a, b) => a - b);
 
  estado.palabraActual = palabra;
  estado.posicionesFaltantes = posicionesOrdenadas;
 
  inputLetras.value = "";
  inputLetras.classList.remove("correcto", "incorrecto");
  renderizarPalabra();
 
  pistaEspanol.textContent = `Clue: ${palabra.es}`;
}
 
function entero(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
/* ---------------------------------------------------------
   7. RENDERIZAR LA PALABRA CON SUS LETRAS FALTANTES
--------------------------------------------------------- */
function renderizarPalabra() {
  const palabraMayus = estado.palabraActual.en.toUpperCase();
 
  const html = [...palabraMayus].map((letra, indice) => {
    if (estado.posicionesFaltantes.includes(indice)) {
      return `<span class="letra-faltante">_</span>`;
    }
    return letra;
  }).join(" ");
 
  palabraMostrada.innerHTML = html;
}
 
/* ---------------------------------------------------------
   8. RESPUESTA DEL ESTUDIANTE
   El estudiante escribe SOLO las letras faltantes, en orden.
   Se valida automáticamente en cuanto escribe la cantidad
   correcta de letras.
--------------------------------------------------------- */
inputLetras.addEventListener("input", () => {
  if (!estado.jugando) return;
 
  const letrasEscritas = normalizarTexto(inputLetras.value);
  const cantidadFaltante = estado.posicionesFaltantes.length;
 
  // Espera a que escriba tantas letras como faltan antes de validar
  if (letrasEscritas.length < cantidadFaltante) return;
 
  const letrasCorrectas = estado.posicionesFaltantes
    .map(indice => estado.palabraActual.en[indice].toLowerCase())
    .join("");
 
  if (letrasEscritas === letrasCorrectas) {
    acertarPalabra();
  } else {
    fallarPalabra();
  }
});
 
function normalizarTexto(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // quita tildes para no penalizar al estudiante
}
 
/* ---------------------------------------------------------
   9. ACERTAR LA PALABRA
--------------------------------------------------------- */
function acertarPalabra() {
  inputLetras.classList.add("correcto");
  estado.puntaje += CONFIG.puntosPorAcierto;
  actualizarPuntajeHUD();
 
  // Muestra la palabra completa brevemente antes de pasar a la siguiente
  estado.posicionesFaltantes = [];
  renderizarPalabra();
 
  if (estado.puntaje >= CONFIG.puntosParaGanar) {
    setTimeout(mostrarVictoria, 500);
    return;
  }
 
  setTimeout(() => {
    if (estado.jugando) siguientePalabra();
  }, 700);
}
 
/* ---------------------------------------------------------
   9b. VICTORIA POR PUNTAJE (100 puntos)
   El juego sigue "activo" pero se pausa con el letrero;
   el estudiante puede elegir seguir jugando desde ahí.
--------------------------------------------------------- */
function mostrarVictoria() {
  puntajeVictoria.textContent = estado.puntaje;
  pantallaVictoria.classList.remove("oculto");
  inputLetras.disabled = true;
}
 
btnSeguirJugando.addEventListener("click", () => {
  pantallaVictoria.classList.add("oculto");
  inputLetras.disabled = false;
  inputLetras.focus();
  siguientePalabra();
});
 
/* ---------------------------------------------------------
   10. FALLAR LA PALABRA (letras incorrectas)
--------------------------------------------------------- */
function fallarPalabra() {
  inputLetras.classList.add("incorrecto");
  setTimeout(() => inputLetras.classList.remove("incorrecto"), 300);
  inputLetras.value = "";
 
  perderVida();
}
 
/* ---------------------------------------------------------
   11. VIDAS Y FIN DE JUEGO
--------------------------------------------------------- */
function perderVida() {
  estado.vidas -= 1;
  actualizarVidasHUD();
 
  if (estado.vidas <= 0) {
    terminarJuego();
  } else {
    // Sigue con una palabra nueva después de perder una vida
    siguientePalabra();
  }
}
 
function terminarJuego() {
  estado.jugando = false;
  inputLetras.disabled = true;
  puntajeFinal.textContent = estado.puntaje;
  pantallaFin.classList.remove("oculto");
}
 
/* ---------------------------------------------------------
   12. HUD
--------------------------------------------------------- */
function actualizarVidasHUD() {
  vidasContenedor.innerHTML = "";
  for (let i = 0; i < CONFIG.vidasIniciales; i++) {
    const vida = document.createElement("span");
    vida.textContent = "\u2665"; // corazón, reemplazable por icono real
    vida.className = i < estado.vidas ? "vida" : "vida-perdida";
    vidasContenedor.appendChild(vida);
  }
}
 
function actualizarPuntajeHUD() {
  puntajeValor.textContent = estado.puntaje;
}
 
/* ---------------------------------------------------------
   13. ARRANQUE
--------------------------------------------------------- */
iniciarJuego();
 