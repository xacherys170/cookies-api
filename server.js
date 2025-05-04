const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;
const DB_PATH = './db.json';

app.use(bodyParser.json());

// Leer cookies por nombre
app.get('/cookies/:name', (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  const name = req.params.name;
  if (db[name]) {
    res.json({ status: true, cookies: db[name] });
  } else {
    res.status(404).json({ status: false, error: 'Cookies no encontradas' });
  }
});

// Guardar cookies
app.post('/cookies/:name', (req, res) => {
  const name = req.params.name;
  const cookies = req.body.cookies;

  if (!Array.isArray(cookies)) {
    return res.status(400).json({ status: false, error: 'Formato de cookies inválido, debe ser un array' });
  }

  const db = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) : {};
  db[name] = cookies;
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

  res.json({ status: true, message: `Cookies guardadas bajo el nombre '${name}'` });
});

// Eliminar cookies por nombre
app.delete('/cookies/:name', (req, res) => {
  const name = req.params.name;
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  if (db[name]) {
    delete db[name];
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.json({ status: true, message: `Cookies eliminadas para '${name}'` });
  } else {
    res.status(404).json({ status: false, error: 'Cookies no encontradas' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
