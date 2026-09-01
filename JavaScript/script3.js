// Array de rutas a imágenes locales (relativas a la ubicación de index.html)
const imagenes = [
    "IMG/astro.jpg",
    "IMG/bloop.jpg",
    "IMG/zeb.png"
  ];
  
  // Índice para rastrear qué imagen mostrar
  let indiceActual = 0;
  
  // Obtenemos la imagen del HTML
  const imagen = document.getElementById("imagenPrincipal");
  
  // Función para mostrar la imagen actual
  function mostrarImagen() {
    imagen.src = imagenes[indiceActual];
  }
  
  // Función para ir a la imagen anterior
  function anteriorImagen() {
    indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
    mostrarImagen();
  }
  
  // Función para ir a la imagen siguiente
  function siguienteImagen() {
    indiceActual = (indiceActual + 1) % imagenes.length;
    mostrarImagen();
  }
  
  // Cargar la primera imagen cuando la página inicia
  mostrarImagen();

// Información de los personajes
imagen.onclick = function() {

    if (indiceActual === 0) {
        document.getElementById("AstroInfo").style.display = "flex";
    }
   else if (indiceActual === 1) {
        document.getElementById("BloopInfo").style.display = "flex";
    }
   else if (indiceActual === 2) {
        document.getElementById("ZebInfo").style.display = "flex";
    } 
};

function cerrarInfo(id) {
    document.getElementById(id).style.display = "none";
}  