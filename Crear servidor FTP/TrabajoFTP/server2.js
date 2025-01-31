const ftp = require("basic-ftp");
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FTP_CONFIG = {
  host: "192.168.0.37",
  user: "user1",
  password: "zubat",
  secure: true,
  secureOptions: { rejectUnauthorized: false },
  port: 21,
};

const JSON_FILE_PATH = "mallorca.json";

app.get("/jugadores", async (req, res) => {
  const client = new ftp.Client();
  try {
    await client.access(FTP_CONFIG);

    // Descargar mallorca.json desde el servidor FTP
    await client.downloadTo(JSON_FILE_PATH, JSON_FILE_PATH);

    // Leer y parsear mallorca.json
    const jsonData = fs.readFileSync(JSON_FILE_PATH, "utf8");
    const jugadores = JSON.parse(jsonData);

    // Enviar los datos al frontend
    res.json(jugadores.jugadores); // Accede a la clave "jugadores" del JSON
  } catch (err) {
    console.error("Error accediendo al servidor FTP:", err);
    res.status(500).send("Error al obtener datos del servidor FTP.");
  } finally {
    client.close();
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
