const vocabulario = [
  { ingles: "Dog", espanol: "Perro", icono: "🐶" },
  { ingles: "Cat", espanol: "Gato", icono: "🐱" },
  { ingles: "Bird", espanol: "Pájaro", icono: "🐦" },
  { ingles: "Fish", espanol: "Pez", icono: "🐟" },
  { ingles: "Rabbit", espanol: "Conejo", icono: "🐰" },
  { ingles: "Turtle", espanol: "Tortuga", icono: "🐢" }
];
 

const colores = ["#7c5cff", "#6effc5", "#0a97b0", "#838efd", "#5cc8ff", "#8158c7"];
 

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