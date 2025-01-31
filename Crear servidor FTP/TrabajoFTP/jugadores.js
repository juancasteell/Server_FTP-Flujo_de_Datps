async function fetchPlayers() {
  try {
    // Y si hacemos dos responses o fusionamos el server?
    let response = await fetch("http://localhost:3000/jugadores");
    let response2 = await fetch("http://localhost:3001/jugadores");

    const jugadores = await response.json();

    const tableBody = document
      .getElementById("jugadoresTable")
      .querySelector("tbody");

    jugadores.forEach((jugador) => {
      const row = document.createElement("tr");

      console.log(jugador);

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
  } catch (error) {
    console.error("Error fetching player data:", error);
  }
}

// Fetch and display hotels data on page load
fetchPlayers();
