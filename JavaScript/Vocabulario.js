const temas = [
  
  { nombre: "Greetings and farewells", icono: "IMG/saludo-despedida.png", esImagen: true, color: "#5c9dff", pagina: "saludos.html" },
  { nombre: "Classroom Objects", icono:"IMG/objetos 1.png", esImagen: true, color: "#3ea6ff", pagina: "objetos.html" },
  { nombre: "Animals", icono: "IMG/animales 1.png", esImagen: true, color: "#576ee1", pagina: "animales.html" },
  { nombre: "Colors", icono: "IMG/colores 1.png", esImagen: true, color: "#6ed6ff", pagina: "colores.html" },
  { nombre: "Body", icono: "IMG/cuerpo.png", esImagen: true, color: "#4db2ff", pagina: "partes-cuerpo.html" }
];
 
 
const contenedor = document.getElementById("gridTemas");
 
 
temas.forEach((tema) => {
  const tarjeta = document.createElement("div");
  tarjeta.className = "tarjeta-tema";
  tarjeta.style.setProperty("--color-tema", tema.color);
  tarjeta.style.setProperty("--color-tema-suave", tema.color + "26");
 
  const contenidoIlustracion = tema.esImagen
    ? `<img src="${tema.icono}" alt="${tema.nombre}" />`
    : tema.icono;
 
  tarjeta.innerHTML = `
    <div class="ilustracion">${contenidoIlustracion}</div>
    <div class="pie-tarjeta">
      <div class="nombre-tema">${tema.nombre}</div>
      <div class="boton-ir">&#8594;</div>
    </div>
  `;
 
  tarjeta.addEventListener("click", () => {
    window.location.href = tema.pagina;
  });
 
  contenedor.appendChild(tarjeta);
});
