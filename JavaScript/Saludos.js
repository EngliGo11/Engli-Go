const vocabulario = [
  { ingles: "Hello", espanol: "Hola", icono: "👋" },
  { ingles: "Good morning", espanol: "Buenos días", icono: "🌅" },
  { ingles: "Good afternoon", espanol: "Buenas tardes", icono: "🌇" },
  { ingles: "Good night", espanol: "Buenas noches", icono: "🌙" },
  { ingles: "Goodbye", espanol: "Adiós", icono: "🙋" },
  { ingles: "See you later", espanol: "Hasta luego", icono: "😊" }
];
 
 
const colores = ["#7c5cff", "#b26eff", "#6655e8", "#4d56ff", "#5cc8ff", "#6e84ff"];
 
 
const contenedor = document.getElementById("gridTarjetas");
 
 
vocabulario.forEach((palabra, indice) => {
  const color = colores[indice % colores.length];
 
  const tarjeta = document.createElement("div");
  tarjeta.className = "tarjeta";
  tarjeta.style.setProperty("--color-tarjeta", color);
  tarjeta.style.setProperty("--color-tarjeta-suave", color + "33");
 
  tarjeta.innerHTML = `
    <div class="icono">${palabra.icono}</div>
    <div class="palabra-ingles">${palabra.ingles}</div>
    <div class="palabra-espanol">${palabra.espanol}</div>
  `;
 
 
  tarjeta.addEventListener("click", () => {
    tarjeta.classList.toggle("mostrar-traduccion");
  });
 
  contenedor.appendChild(tarjeta);
});
 
 
const btnVolver = document.getElementById("btnVolver");
btnVolver.addEventListener("click", () => {
  window.location.href ="vocabulary.html";
});