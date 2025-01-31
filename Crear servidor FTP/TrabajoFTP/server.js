const ftp = require("basic-ftp");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const xml2js = require("xml2js");

const app = express();
app.use(cors());
app.use(express.json());

const FTP_CONFIG = {
  host: "192.168.0.37",
  user: "user1",
  password: "zubat",
  secure: true,
  secureOptions: { rejectUnauthorized: false }, // Acepta certificados autofirmados
  port: 21,
};

const XML_FILE_PATH = "jugadores.xml";

app.get("/jugadores", async (req, res) => {
  const client = new ftp.Client();
  try {
    await client.access(FTP_CONFIG);

    // Download the XML file from the FTP server
    await client.downloadTo(XML_FILE_PATH, XML_FILE_PATH);

    // Read and parse the XML file
    const xmlData = fs.readFileSync(XML_FILE_PATH, "utf8");

    xml2js.parseString(xmlData, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        return res.status(500).send("Failed to parse XML file.");
      }

      // Send parsed data to the frontend
      res.json(result.jugadores.jugador);

      console.log("Parseado", jugadores); // Assumes JSON has a structure <jugadores><jugador>...</jugador></jugadores>
    });
  } catch (err) {
    console.error("Error accessing FTP server:", err);
    res.status(500).send("Failed to fetch data from FTP server.");
  } finally {
    client.close();
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
