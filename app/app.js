const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware para procesar JSON en requests

// Ruta principal

app.get("/", (req, res) => {
    res.send("¡La API está funcionando correctamente!");
  });
  
  // Ruta para obtener todos los integrantes
  app.get("/integrantes", (req, res) => {
    const data = JSON.parse(fs.readFileSync("./integrantes.json", "utf-8"));
    res.json(data);
  });
  
  // Ruta para obtener datos por DNI
  app.get("/integrantes/:dni", (req, res) => {
    const { dni } = req.params;
    const data = JSON.parse(fs.readFileSync("./integrantes.json", "utf-8"));
    const integrante = data.find(i => i.dni === dni);
  
    if (integrante) {
      res.json(integrante);
    } else {
      res.status(404).send("Integrante no encontrado.");
    }
  });


  app.post("/integrantes/agregar", (req, res) => {
    const { nombre, apellido, dni, mail } = req.body;
  
    if (!nombre || !apellido || !dni || !mail) {
      return res.status(400).send("Faltan datos.");
    }
  
    const data = JSON.parse(fs.readFileSync("./integrantes.json", "utf-8"));
    data.push({ nombre, apellido, dni, mail });
    fs.writeFileSync("./integrantes.json", JSON.stringify(data, null, 2));
  
    res.json(data);
  });

  
  app.put("/integrantes/:mail", (req, res) => {
    const { mail } = req.params;
    const { apellido } = req.body;
  
    if (!apellido) {
      return res.status(400).send("Falta el apellido.");
    }
  
    const data = JSON.parse(fs.readFileSync("./integrantes.json", "utf-8"));
    const integrante = data.find(i => i.mail === mail);
  
    if (integrante) {
      integrante.apellido = apellido;
      fs.writeFileSync("./integrantes.json", JSON.stringify(data, null, 2));
      res.json(integrante);
    } else {
      res.status(404).send("Integrante no encontrado.");
    }
  });

  app.delete("/integrantes/:dni", (req, res) => {
    const { dni } = req.params;
  
    const data = JSON.parse(fs.readFileSync("./integrantes.json", "utf-8"));
    const index = data.findIndex(i => i.dni === dni);
  
    if (index !== -1) {
      data.splice(index, 1);
      fs.writeFileSync("./integrantes.json", JSON.stringify(data, null, 2));
      res.json(data);
    } else {
      res.status(404).send("Integrante no encontrado.");
    }
  });
  
  
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
  