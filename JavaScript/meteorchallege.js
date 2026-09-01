const TEMAS_PALABRAS = {
  "saludos-despedidas": [
    { en: "hello",           es: ["hola"] },
    { en: "good morning",    es: ["buenos dias", "buenos días"] },
    { en: "good afternoon",  es: ["buenas tardes"] },
    { en: "good night",      es: ["buenas noches"] },
    { en: "see you later",   es: ["hasta luego"] },
    { en: "goodbye",         es: ["adios", "adiós"] },
  ],
  "colores": [
    { en: "red",    es: ["rojo"] },
    { en: "blue",   es: ["azul"] },
    { en: "green",  es: ["verde"] },
    { en: "orange", es: ["naranja"] },
    { en: "purple", es: ["morado"] },
    { en: "yellow", es: ["amarillo"] },
  ],
  "objetos-clase": [
    { en: "backpack", es: ["mochila"] },
    { en: "book",     es: ["libro"] },
    { en: "pencil",   es: ["lapiz", "lápiz"] },
    { en: "notebook", es: ["cuaderno"] },
    { en: "ruler",    es: ["regla"] },
    { en: "scissors", es: ["tijeras"] },
  ],
  "animales": [
    { en: "dog",     es: ["perro"] },
    { en: "cat",     es: ["gato"] },
    { en: "bird",    es: ["pajaro", "pájaro"] },
    { en: "fish",    es: ["pez"] },
    { en: "rabbit",  es: ["conejo"] },
    { en: "turtle",  es: ["tortuga"] },
  ],
  "partes-cuerpo": [
    { en: "head", es: ["cabeza"] },
    { en: "hand", es: ["mano"] },
    { en: "eye",  es: ["ojo"] },
    { en: "foot", es: ["pie"] },
    { en: "ear",  es: ["oreja"] },
    { en: "arm",  es: ["brazo"] },
  ],
};
 
/* Por defecto el juego mezcla los 5 temas. Si más adelante quieren
   una versión de Meteor Challege por tema específico, basta con
   cambiar esta línea, por ejemplo:
   const BANCO_PALABRAS = TEMAS_PALABRAS["colores"]; */
const BANCO_PALABRAS = Object.values(TEMAS_PALABRAS).flat();
 
/* ---------------------------------------------------------
   2. CONFIGURACIÓN DEL JUEGO
--------------------------------------------------------- */
const CONFIG = {
  vidasIniciales: 3,
  puntosPorAcierto: 10,
  tiempoEntreMeteoritos: 5000,     // ms de espera después de resolver un meteorito (acertado o perdido) antes de que caiga el siguiente
  duracionCaidaInicial: 9000,     // ms que tarda un meteorito en caer (más alto = más lento)
  duracionCaidaMinima: 4000,      // velocidad máxima (no cae más rápido que esto)
  reduccionPorAcierto: 150,       // cuánto se reduce la duración de caída por cada acierto
};
 
/* ---------------------------------------------------------
   3. ESTADO DEL JUEGO
--------------------------------------------------------- */
let estado = {
  vidas: CONFIG.vidasIniciales,
  puntaje: 0,
  meteoritosActivos: [],   // { id, palabra, elemento, timeoutCaida }
  duracionCaidaActual: CONFIG.duracionCaidaInicial,
  jugando: false,
  timerAparicion: null,
  contadorId: 0,
};
 
/* ---------------------------------------------------------
   4. REFERENCIAS AL DOM
--------------------------------------------------------- */
const areaJuego = document.getElementById("area-juego");
const inputRespuesta = document.getElementById("input-respuesta");
const vidasContenedor = document.getElementById("vidas");
const puntajeValor = document.getElementById("puntaje-valor");
const pantallaFin = document.getElementById("pantalla-fin");
const puntajeFinal = document.getElementById("puntaje-final");
const btnReiniciar = document.getElementById("btn-reiniciar");
const astronauta = document.getElementById("astronauta");
 
/* ---------------------------------------------------------
   5. INICIO / REINICIO DEL JUEGO
--------------------------------------------------------- */
function iniciarJuego() {
  // Limpiar meteoritos que hayan quedado de una partida anterior
  estado.meteoritosActivos.forEach(m => {
    clearTimeout(m.timeoutCaida);
    m.elemento.remove();
  });
 
  estado = {
    vidas: CONFIG.vidasIniciales,
    puntaje: 0,
    meteoritosActivos: [],
    duracionCaidaActual: CONFIG.duracionCaidaInicial,
    jugando: true,
    timerAparicion: null,
    contadorId: 0,
  };
 
  actualizarVidasHUD();
  actualizarPuntajeHUD();
  pantallaFin.classList.add("oculto");
  inputRespuesta.value = "";
  inputRespuesta.disabled = false;
  inputRespuesta.focus();
 
  // El primer meteorito cae de inmediato; los siguientes esperan
  // CONFIG.tiempoEntreMeteoritos después de resolverse el anterior
  crearMeteorito();
}
 
btnReiniciar.addEventListener("click", iniciarJuego);
 
/* ---------------------------------------------------------
   6. GENERACIÓN DE METEORITOS
   Ahora cae UN SOLO meteorito a la vez. Cuando ese se resuelve
   (acertado o perdido), se programa el siguiente para que
   aparezca CONFIG.tiempoEntreMeteoritos después.
--------------------------------------------------------- */
function programarSiguienteMeteorito() {
  if (!estado.jugando) return;
 
  estado.timerAparicion = setTimeout(() => {
    crearMeteorito();
  }, CONFIG.tiempoEntreMeteoritos);
}
 
function crearMeteorito() {
  if (!estado.jugando) return;
 
  const palabra = BANCO_PALABRAS[Math.floor(Math.random() * BANCO_PALABRAS.length)];
  const id = estado.contadorId++;
 
  const elemento = document.createElement("div");
  elemento.className = "meteorito";
  elemento.dataset.id = id;
 
  // Posición horizontal aleatoria dentro del área de juego,
  // dejando espacio para no encimarse con el astronauta ni salirse
  const anchoArea = areaJuego.clientWidth;
  const margenIzquierdo = 130; // deja libre la zona del astronauta
  const margenDerecho = 80;
  const posicionX = margenIzquierdo + Math.random() * (anchoArea - margenIzquierdo - margenDerecho);
  elemento.style.left = posicionX + "px";
  elemento.style.top = "-70px";
 
  elemento.innerHTML = `
    <div class="meteorito-cuerpo"></div>
    <div class="meteorito-etiqueta">${palabra.en}</div>
  `;
 
  areaJuego.appendChild(elemento);
 
  // Animar la caída con CSS transition
  requestAnimationFrame(() => {
    elemento.style.transition = `top ${estado.duracionCaidaActual}ms linear`;
    elemento.style.top = (areaJuego.clientHeight - 40) + "px";
  });
 
  const meteorito = {
    id,
    palabra,
    elemento,
    timeoutCaida: null,
  };
 
  meteorito.timeoutCaida = setTimeout(() => {
    meteoritoLlegoAlLimite(id);
  }, estado.duracionCaidaActual);
 
  estado.meteoritosActivos.push(meteorito);
}
 
/* ---------------------------------------------------------
   7. RESPUESTA DEL ESTUDIANTE
   Mientras escribe, si el texto coincide con algún meteorito
   activo, lo acierta automáticamente. Si presiona Enter y lo
   que escribió NO coincide con ninguno, cuenta como respuesta
   incorrecta y también resta una vida.
--------------------------------------------------------- */
inputRespuesta.addEventListener("input", () => {
  if (!estado.jugando) return;
 
  const textoEscrito = normalizarTexto(inputRespuesta.value);
  if (textoEscrito.length === 0) return;
 
  // Busca si el texto escrito coincide con la respuesta de
  // algún meteorito activo actualmente en pantalla
  const meteoritoCoincidente = estado.meteoritosActivos.find(m =>
    m.palabra.es.some(respuesta => normalizarTexto(respuesta) === textoEscrito)
  );
 
  if (meteoritoCoincidente) {
    acertarMeteorito(meteoritoCoincidente.id);
    inputRespuesta.value = "";
  }
});
 
inputRespuesta.addEventListener("keydown", (evento) => {
  if (evento.key !== "Enter") return;
  if (!estado.jugando) return;
 
  const textoEscrito = normalizarTexto(inputRespuesta.value);
  if (textoEscrito.length === 0) return;
 
  const meteoritoCoincidente = estado.meteoritosActivos.find(m =>
    m.palabra.es.some(respuesta => normalizarTexto(respuesta) === textoEscrito)
  );
 
  // Si al presionar Enter no coincide con ningún meteorito activo,
  // se cuenta como respuesta incorrecta y resta una vida
  if (!meteoritoCoincidente) {
    responderMal();
  }
});
 
function responderMal() {
  inputRespuesta.value = "";
  inputRespuesta.classList.add("input-error");
  setTimeout(() => inputRespuesta.classList.remove("input-error"), 400);
 
  // Al fallar la respuesta, el meteorito actual también se resuelve
  // (con el mismo efecto de fuego que al llegar al borde) para que
  // no reste una segunda vida cuando llegue abajo.
  const meteoritoActual = estado.meteoritosActivos[0];
  if (meteoritoActual) {
    clearTimeout(meteoritoActual.timeoutCaida);
    meteoritoLlegoAlLimite(meteoritoActual.id);
  } else {
    perderVida();
    programarSiguienteMeteorito();
  }
}
 
function normalizarTexto(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // quita tildes para no penalizar al estudiante
}
 
/* ---------------------------------------------------------
   8. ACERTAR UN METEORITO
--------------------------------------------------------- */
function acertarMeteorito(id) {
  const meteorito = sacarMeteoritoActivo(id);
  if (!meteorito) return;
 
  clearTimeout(meteorito.timeoutCaida);
 
  // Feedback visual: estrellas (ver animación .acertado en style.css)
  meteorito.elemento.style.transition = "";
  meteorito.elemento.classList.add("acertado");
  astronauta.classList.add("disparando");
  setTimeout(() => astronauta.classList.remove("disparando"), 200);
 
  estado.puntaje += CONFIG.puntosPorAcierto;
  actualizarPuntajeHUD();
 
  aumentarDificultad();
 
  setTimeout(() => meteorito.elemento.remove(), 400);
 
  programarSiguienteMeteorito();
}
 
/* ---------------------------------------------------------
   9. METEORITO LLEGA AL LÍMITE SIN RESPUESTA CORRECTA
--------------------------------------------------------- */
function meteoritoLlegoAlLimite(id) {
  const meteorito = sacarMeteoritoActivo(id);
  if (!meteorito) return;
 
  // Feedback visual: candela/fuego (ver animación .fallado en style.css)
  meteorito.elemento.style.transition = "";
  meteorito.elemento.classList.add("fallado");
  setTimeout(() => meteorito.elemento.remove(), 400);
 
  perderVida();
 
  // Si el juego sigue activo (no se acabaron las vidas), programa
  // el siguiente meteorito. Si se acabaron, terminarJuego() ya
  // puso estado.jugando en false y programarSiguienteMeteorito no hará nada.
  programarSiguienteMeteorito();
}
 
/* ---------------------------------------------------------
   10. VIDAS Y FIN DE JUEGO
--------------------------------------------------------- */
function perderVida() {
  estado.vidas -= 1;
  actualizarVidasHUD();
 
  if (estado.vidas <= 0) {
    terminarJuego();
  }
}
 
function terminarJuego() {
  estado.jugando = false;
  clearTimeout(estado.timerAparicion);
 
  estado.meteoritosActivos.forEach(m => clearTimeout(m.timeoutCaida));
 
  inputRespuesta.disabled = true;
  puntajeFinal.textContent = estado.puntaje;
  pantallaFin.classList.remove("oculto");
}
 
/* ---------------------------------------------------------
   11. DIFICULTAD PROGRESIVA
   La velocidad de caída aumenta (duración baja) con cada acierto
--------------------------------------------------------- */
function aumentarDificultad() {
  estado.duracionCaidaActual = Math.max(
    CONFIG.duracionCaidaMinima,
    estado.duracionCaidaActual - CONFIG.reduccionPorAcierto
  );
}
 
/* ---------------------------------------------------------
   12. UTILIDADES
--------------------------------------------------------- */
function sacarMeteoritoActivo(id) {
  const indice = estado.meteoritosActivos.findIndex(m => m.id === id);
  if (indice === -1) return null;
  return estado.meteoritosActivos.splice(indice, 1)[0];
}
 
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