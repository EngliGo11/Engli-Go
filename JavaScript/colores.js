const vocabulario = [
  { ingles: "Lavender", espanol: "Lavanda", color: "#A981FE" },
  { ingles: "Sky blue", espanol: "Azul cielo", color: "#92C5FC" },
  { ingles: "Violet", espanol: "Violeta", color: "#e0b0ff" },
  { ingles: "Light pink", espanol: "Rosa calro", color: "#ff96c5" },
  { ingles: "Light blue", espanol: "Azul claro", color: "#00A9FF" },
  { ingles: "Purple", espanol: "Morado", color: "#a75cff" }
];
 
 
const contenedor = document.getElementById("gridTarjetas");
 
 
vocabulario.forEach((palabra) => {
  const color = palabra.color;
 
  const tarjeta = document.createElement("div");
  tarjeta.className = "tarjeta";
  tarjeta.style.setProperty("--color-tarjeta", color);
  tarjeta.style.setProperty("--color-tarjeta-suave", color + "33");
 
  tarjeta.innerHTML = `
    <div class="icono" style="background:${color};"></div>
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