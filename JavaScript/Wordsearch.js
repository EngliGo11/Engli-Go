const TEMAS_PALABRAS = {
  "saludos-despedidas": ["hello", "hi", "goodbye", "welcome", "please"],
  "colores": ["red", "blue", "green", "yellow", "purple", "orange", "black", "white", "pink"],
  "objetos-clase": ["backpack", "pencil", "notebook", "ruler", "scissors", "eraser", "pen", "marker", "folder", "chalk"],
  "animales": ["dog", "cat", "bird", "fish", "rabbit", "turtle", "horse", "lion", "cow", "pig", "bear"],
  "partes-cuerpo": ["head", "hand", "eye", "foot", "ear", "arm", "nose", "mouth", "leg", "neck", "knee"],
};
 
/* Junta todas las palabras de todos los temas en un solo arreglo.
   Solo se usan palabras de una sola pieza (sin espacios), ya que
   una sopa de letras no puede esconder frases con espacio. */
const TODAS_LAS_PALABRAS = Object.values(TEMAS_PALABRAS)
  .flat()
  .filter(palabra => !palabra.includes(" "));
 
/* ---------------------------------------------------------
   2. CONFIGURACIÓN
--------------------------------------------------------- */
const CONFIG = {
  filas: 12,
  columnas: 12,
  cantidadPalabras: 15, // cuántas palabras se esconden por partida
};
 
/* Las 8 direcciones posibles: [deltaFila, deltaColumna] */
const DIRECCIONES = [
  [0, 1],   // derecha
  [0, -1],  // izquierda
  [1, 0],   // abajo
  [-1, 0],  // arriba
  [1, 1],   // diagonal abajo-derecha
  [1, -1],  // diagonal abajo-izquierda
  [-1, 1],  // diagonal arriba-derecha
  [-1, -1], // diagonal arriba-izquierda
];
 
const LETRAS_RELLENO = "abcdefghijklmnopqrstuvwxyz";
 
/* ---------------------------------------------------------
   3. ESTADO DEL JUEGO
--------------------------------------------------------- */
let estado = {
  cuadricula: [],          // matriz de letras
  palabrasColocadas: [],   // { palabra, celdas: [{fila, columna}, ...] }
  palabrasEncontradas: new Set(),
  seleccionando: false,
  celdaInicio: null,
  celdasSeleccionActual: [],
};
 
/* ---------------------------------------------------------
   4. REFERENCIAS AL DOM
--------------------------------------------------------- */
const cuadriculaEl = document.getElementById("cuadricula");
const listaPalabrasEl = document.getElementById("lista-palabras");
const btnNuevaSopa = document.getElementById("btn-nueva-sopa");
const btnJugarOtraVez = document.getElementById("btn-jugar-otra-vez");
const pantallaVictoria = document.getElementById("pantalla-victoria");
 
btnNuevaSopa.addEventListener("click", iniciarPartida);
btnJugarOtraVez.addEventListener("click", iniciarPartida);
 
/* ---------------------------------------------------------
   5. INICIAR PARTIDA
--------------------------------------------------------- */
function iniciarPartida() {
  pantallaVictoria.classList.add("oculto");
  estado.palabrasEncontradas = new Set();
 
  generarCuadricula();
  renderizarCuadricula();
  renderizarListaPalabras();
}
 
/* ---------------------------------------------------------
   6. GENERACIÓN DE LA CUADRÍCULA Y COLOCACIÓN DE PALABRAS
--------------------------------------------------------- */
function generarCuadricula() {
  const { filas, columnas, cantidadPalabras } = CONFIG;
 
  // Cuadrícula vacía
  const cuadricula = Array.from({ length: filas }, () => Array(columnas).fill(null));
 
  // Elegir palabras al azar (sin repetir), ordenadas de más larga a
  // más corta para que las palabras largas tengan más oportunidad
  // de encontrar espacio en la cuadrícula
  const palabrasElegidas = mezclarArreglo(TODAS_LAS_PALABRAS)
    .slice(0, cantidadPalabras)
    .sort((a, b) => b.length - a.length);
 
  const palabrasColocadas = [];
 
  palabrasElegidas.forEach(palabra => {
    colocarPalabra(cuadricula, palabra.toUpperCase(), palabrasColocadas);
  });
 
  // Rellenar espacios vacíos con letras aleatorias
  for (let fila = 0; fila < filas; fila++) {
    for (let columna = 0; columna < columnas; columna++) {
      if (!cuadricula[fila][columna]) {
        cuadricula[fila][columna] = letraAleatoria();
      }
    }
  }
 
  estado.cuadricula = cuadricula;
  estado.palabrasColocadas = palabrasColocadas;
}
 
function colocarPalabra(cuadricula, palabra, palabrasColocadas) {
  const { filas, columnas } = CONFIG;
  const intentosMaximos = 150;
 
  for (let intento = 0; intento < intentosMaximos; intento++) {
    const [deltaFila, deltaColumna] = DIRECCIONES[Math.floor(Math.random() * DIRECCIONES.length)];
 
    const filaInicio = Math.floor(Math.random() * filas);
    const columnaInicio = Math.floor(Math.random() * columnas);
 
    const filaFin = filaInicio + deltaFila * (palabra.length - 1);
    const columnaFin = columnaInicio + deltaColumna * (palabra.length - 1);
 
    if (filaFin < 0 || filaFin >= filas || columnaFin < 0 || columnaFin >= columnas) {
      continue; // no cabe en esa dirección desde ese punto, reintentar
    }
 
    const celdas = [];
    let cabeSinConflicto = true;
 
    for (let i = 0; i < palabra.length; i++) {
      const fila = filaInicio + deltaFila * i;
      const columna = columnaInicio + deltaColumna * i;
      const letraActual = cuadricula[fila][columna];
 
      if (letraActual !== null && letraActual !== palabra[i]) {
        cabeSinConflicto = false;
        break;
      }
      celdas.push({ fila, columna });
    }
 
    if (!cabeSinConflicto) continue;
 
    // Coloca la palabra letra por letra
    celdas.forEach((celda, i) => {
      cuadricula[celda.fila][celda.columna] = palabra[i];
    });
 
    palabrasColocadas.push({ palabra, celdas });
    return true;
  }
 
  // Si después de varios intentos no encontró espacio, se omite
  // esa palabra (con 8 palabras en 12x12 esto casi nunca pasa)
  console.warn(`No se pudo colocar la palabra "${palabra}" en la cuadrícula`);
  return false;
}
 
function letraAleatoria() {
  return LETRAS_RELLENO[Math.floor(Math.random() * LETRAS_RELLENO.length)].toUpperCase();
}
 
function mezclarArreglo(arreglo) {
  const copia = [...arreglo];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
 
/* ---------------------------------------------------------
   7. RENDERIZADO
--------------------------------------------------------- */
function renderizarCuadricula() {
  cuadriculaEl.innerHTML = "";
 
  estado.cuadricula.forEach((fila, indiceFila) => {
    fila.forEach((letra, indiceColumna) => {
      const celda = document.createElement("div");
      celda.className = "celda";
      celda.textContent = letra;
      celda.dataset.fila = indiceFila;
      celda.dataset.columna = indiceColumna;
 
      celda.addEventListener("mousedown", () => iniciarSeleccion(indiceFila, indiceColumna));
      celda.addEventListener("mouseenter", () => continuarSeleccion(indiceFila, indiceColumna));
      celda.addEventListener("touchstart", (e) => manejarToque(e, iniciarSeleccion), { passive: true });
      celda.addEventListener("touchmove", (e) => manejarToque(e, continuarSeleccion), { passive: true });
 
      cuadriculaEl.appendChild(celda);
    });
  });
 
  document.addEventListener("mouseup", finalizarSeleccion);
  document.addEventListener("touchend", finalizarSeleccion);
}
 
function renderizarListaPalabras() {
  listaPalabrasEl.innerHTML = "";
 
  estado.palabrasColocadas.forEach(({ palabra }) => {
    const item = document.createElement("li");
    item.textContent = palabra;
    item.dataset.palabra = palabra;
    listaPalabrasEl.appendChild(item);
  });
}
 
/* ---------------------------------------------------------
   8. SELECCIÓN ARRASTRANDO (mouse y touch)
--------------------------------------------------------- */
function manejarToque(evento, funcion) {
  const touch = evento.touches[0];
  const elemento = document.elementFromPoint(touch.clientX, touch.clientY);
  if (!elemento || !elemento.classList.contains("celda")) return;
 
  const fila = Number(elemento.dataset.fila);
  const columna = Number(elemento.dataset.columna);
  funcion(fila, columna);
}
 
function iniciarSeleccion(fila, columna) {
  estado.seleccionando = true;
  estado.celdaInicio = { fila, columna };
  estado.celdasSeleccionActual = [{ fila, columna }];
  actualizarResaltadoSeleccion();
}
 
function continuarSeleccion(fila, columna) {
  if (!estado.seleccionando) return;
 
  const inicio = estado.celdaInicio;
  const celdas = calcularLineaRecta(inicio, { fila, columna });
 
  if (celdas) {
    estado.celdasSeleccionActual = celdas;
    actualizarResaltadoSeleccion();
  }
}
 
function finalizarSeleccion() {
  if (!estado.seleccionando) return;
  estado.seleccionando = false;
 
  verificarPalabraSeleccionada();
 
  estado.celdasSeleccionActual = [];
  actualizarResaltadoSeleccion();
}
 
/* Calcula la línea recta (horizontal, vertical o diagonal) entre
   la celda de inicio y la celda actual, si es que forman una
   línea válida en alguna de las 8 direcciones */
function calcularLineaRecta(inicio, fin) {
  const deltaFila = fin.fila - inicio.fila;
  const deltaColumna = fin.columna - inicio.columna;
 
  const esHorizontal = deltaFila === 0;
  const esVertical = deltaColumna === 0;
  const esDiagonal = Math.abs(deltaFila) === Math.abs(deltaColumna);
 
  if (!esHorizontal && !esVertical && !esDiagonal) return null;
 
  const pasos = Math.max(Math.abs(deltaFila), Math.abs(deltaColumna));
  const pasoFila = Math.sign(deltaFila);
  const pasoColumna = Math.sign(deltaColumna);
 
  const celdas = [];
  for (let i = 0; i <= pasos; i++) {
    celdas.push({
      fila: inicio.fila + pasoFila * i,
      columna: inicio.columna + pasoColumna * i,
    });
  }
  return celdas;
}
 
function actualizarResaltadoSeleccion() {
  document.querySelectorAll(".celda.seleccionada").forEach(el => el.classList.remove("seleccionada"));
 
  estado.celdasSeleccionActual.forEach(({ fila, columna }) => {
    const celda = obtenerElementoCelda(fila, columna);
    if (celda && !celda.classList.contains("encontrada")) {
      celda.classList.add("seleccionada");
    }
  });
}
 
function obtenerElementoCelda(fila, columna) {
  return cuadriculaEl.querySelector(`[data-fila="${fila}"][data-columna="${columna}"]`);
}
 
/* ---------------------------------------------------------
   9. VERIFICAR SI LA SELECCIÓN COINCIDE CON UNA PALABRA
--------------------------------------------------------- */
function verificarPalabraSeleccionada() {
  const celdas = estado.celdasSeleccionActual;
  if (celdas.length < 2) return;
 
  const textoSeleccionado = celdas
    .map(({ fila, columna }) => estado.cuadricula[fila][columna])
    .join("");
  const textoInvertido = [...textoSeleccionado].reverse().join("");
 
  const palabraEncontrada = estado.palabrasColocadas.find(p =>
    !estado.palabrasEncontradas.has(p.palabra) &&
    (p.palabra === textoSeleccionado || p.palabra === textoInvertido)
  );
 
  if (palabraEncontrada) {
    marcarPalabraEncontrada(palabraEncontrada);
  }
}
 
function marcarPalabraEncontrada(palabraEncontrada) {
  estado.palabrasEncontradas.add(palabraEncontrada.palabra);
 
  palabraEncontrada.celdas.forEach(({ fila, columna }) => {
    const celda = obtenerElementoCelda(fila, columna);
    if (celda) celda.classList.add("encontrada");
  });
 
  const itemLista = listaPalabrasEl.querySelector(`[data-palabra="${palabraEncontrada.palabra}"]`);
  if (itemLista) itemLista.classList.add("encontrada");
 
  if (estado.palabrasEncontradas.size === estado.palabrasColocadas.length) {
    setTimeout(() => pantallaVictoria.classList.remove("oculto"), 400);
  }
}
 
/* ---------------------------------------------------------
   10. ARRANQUE
--------------------------------------------------------- */
iniciarPartida();
 