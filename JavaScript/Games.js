const temas = [
  
   {nombre: "Meteor challege",icono: "IMG/meteorchallege.png",esImagen: true, color: "#7c5cff", pagina: "Meteorchallege.html"},
   {nombre: "Complete the word",icono: "IMG/planetmatch.png",esImagen: true, color: "#3ea6ff",pagina: "words.html"},
   {nombre: "Word Search", icono: "IMG/sopa.png", esImagen: true, color: "#3ecf8e",pagina: "Wordsearch.html"}, 
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