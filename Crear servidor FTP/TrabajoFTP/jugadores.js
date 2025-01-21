async function fetchPlayers() {
  try {
    const response = await fetch("http://localhost:3000/jugadores");
    const jugadores = await response.json();

    const tableBody = document
      .getElementById("jugadoresTable")
      .querySelector("tbody");

    jugadores.forEach((jugador) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${jugador.name[0]}</td>
                <td>${jugador.position[0]}</td>
                <td>${jugador.rating[0]}</td>
                <td>${jugador.number[0]}</td>
                <td>${jugador.price[0]}</td>
                <td>${jugador.nacionality[0]}</td>
            `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching player data:", error);
  }
}

// Fetch and display hotels data on page load
fetchPlayers();
