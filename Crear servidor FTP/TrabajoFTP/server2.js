const ftp = require("basic-ftp");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const xml2js = require("xml2js");

const app = express();
app.use(cors());
app.use(express.json());

const FTP_CONFIG = {
  host: "192.168.161.64",
  user: "user1",
  password: "zubat",
  secure: true,
  secureOptions: { rejectUnauthorized: false },
  port: 21,
};

const XML_FILE_PATH = "jugadores.xml";
const JSON_FILE_PATH = "mallorca.json";

// Ruta para obtener datos de jugadores desde el XML
app.get("/jugadores", async (req, res) => {
  const client = new ftp.Client();
  try {
    await client.access(FTP_CONFIG);
    await client.downloadTo(XML_FILE_PATH, XML_FILE_PATH);

    const xmlData = fs.readFileSync(XML_FILE_PATH, "utf8");

    xml2js.parseString(xmlData, (err, result) => {
      if (err) {
        console.error("Error al parsear XML:", err);
        return res.status(500).send("Error al procesar XML.");
      }
      res.json(result.jugadores.jugador); // Asumiendo estructura <jugadores><jugador>...</jugador></jugadores>
    });
  } catch (err) {
    console.error("Error accediendo al FTP:", err);
    res.status(500).send("Error al obtener XML.");
  } finally {
    client.close();
  }
});

// Ruta para obtener datos de jugadores desde el JSON
app.get("/jugadores", async (req, res) => {
  const client = new ftp.Client();
  try {
    await client.access(FTP_CONFIG);
    await client.downloadTo(JSON_FILE_PATH, JSON_FILE_PATH);
    console.log("Se descarga el JSON");

    const jsonData = fs.readFileSync(JSON_FILE_PATH, "utf8");

    const jugadores = JSON.parse(jsonData);

    res.json(jugadores.jugadores); // Accediendo a la clave "jugadores"
  } catch (err) {
    console.error("Error accediendo al FTP:", err);
    res.status(500).send("Error al obtener JSON.");
  } finally {
    client.close();
  }
});

// Ruta para obtener ambos archivos simultáneamente
app.get("/jugadores", async (req, res) => {
  const client = new ftp.Client();
  try {
    await client.access(FTP_CONFIG);

    // Descargar ambos archivos
    await client.downloadTo(XML_FILE_PATH, XML_FILE_PATH);
    console.log("Se descarga el XML");
    await client.downloadTo(JSON_FILE_PATH, JSON_FILE_PATH);
    console.log("Se descarga el JSON");

    // Leer y parsear JSON
    const jsonData = fs.readFileSync(JSON_FILE_PATH, "utf8");
    console.log("Datos JSON: " + jsonData);
    const jsonJugadores = JSON.parse(jsonData).jugadores;

    // Leer y parsear XML
    const xmlData = fs.readFileSync(XML_FILE_PATH, "utf8");
    console.log("Datos XML: " + xmlData);

    xml2js.parseString(xmlData, (err, result) => {
      if (err) {
        console.error("Error al parsear XML:", err);
        return res.status(500).send("Error al procesar XML.");
      }
      const xmlJugadores = result.jugadores.jugador;

      // Enviar ambos datos
      res.json({ xmlJugadores, jsonJugadores });
    });
  } catch (err) {
    console.error("Error accediendo al FTP:", err);
    res.status(500).send("Error al obtener datos.");
  } finally {
    client.close();
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
