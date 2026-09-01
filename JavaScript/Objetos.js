const vocabulario = [
  { ingles: "Backpack", espanol: "Mochila", icono: "🎒" },
  { ingles: "Book", espanol: "Libro", icono: "📖" },
  { ingles: "Pencil", espanol: "Lápiz", icono: "✏️" },
  { ingles: "Notebook", espanol: "Cuaderno", icono: "📓" },
  { ingles: "Ruler", espanol: "Regla", icono: "📏" },
  { ingles: "Scissors", espanol: "Tijeras", icono: "✂️" }
];
 
 
const colores = ["#7c5cff", "#b66eff", "#4cafdd", "#de7ffb", "#bde4f8", "#a3d1e1"];
 
 
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
  window.location.href="vocabulary.html";
});