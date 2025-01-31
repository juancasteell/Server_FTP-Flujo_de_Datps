async function fetchPlayers() {
  try {
    let response = await fetch("http://localhost:3000/jugadores");
    let data = await response.json();

    const page = document.body.dataset.page;

    const tableBody = document
      .getElementById("jugadoresTable")
      .querySelector("tbody");

    // Limpiar tabla antes de insertar nuevos datos
    tableBody.innerHTML = "";

    // Acceder a las listas
    const { jsonJugadores, xmlJugadores } = data;

    console.log("JSON Jugadores:", jsonJugadores);
    console.log("XML Jugadores:", xmlJugadores);

    if (page === "mallorca") {
      // Procesar jugadores del JSON
      jsonJugadores.forEach((jugador) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${jugador.name}</td>
          <td>${jugador.position}</td>
          <td>${jugador.age}</td>
          <td>${jugador.number}</td>
          <td>${jugador.price}</td>
          <td>${jugador.nacionality}</td>
      `;
        tableBody.appendChild(row);
      });
    }

    if (page === "betis") {
      // Procesar jugadores del XML (pueden estar en diferente formato)
      xmlJugadores.forEach((jugador) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${jugador.name}</td>
          <td>${jugador.position}</td>
          <td>${jugador.age}</td>
          <td>${jugador.number}</td>
          <td>${jugador.price}</td>
          <td>${jugador.nacionality}</td>
      `;
        tableBody.appendChild(row);
      });
    }
  } catch (error) {
    console.error("Error fetching player data:", error);
  }
}

// Fetch and display hotels data on page load
fetchPlayers();
