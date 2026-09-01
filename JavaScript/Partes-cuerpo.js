const vocabulario = [
  { ingles: "Head", espanol: "Cabeza", icono: "🧑" },
  { ingles: "Hand", espanol: "Mano", icono: "✋" },
  { ingles: "Eye", espanol: "Ojo", icono: "👁️" },
  { ingles: "Ear", espanol: "Oreja", icono: "👂" },
  { ingles: "Foot", espanol: "Pie", icono: "🦶" },
  { ingles: "Arm", espanol: "Brazo", icono: "💪" }
];
 
 
const colores = ["#7c5cff", "#8ca8fc", "#6194e5", "#b369f4", "#5cc8ff", "#908bf5"];
 
 
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
  window.location.href = "vocabulary.html";
});