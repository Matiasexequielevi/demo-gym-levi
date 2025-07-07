// app.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Conexión a la base de datos
require('./config/db');

// Configuración
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sesión para login (demo)
app.use(session({
  secret: 'demoJP',
  resave: false,
  saveUninitialized: false
}));

// Middleware simple de login demo
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// Rutas
const clienteRoutes = require('./routes/clienteRoutes');
app.use('/', clienteRoutes);

// Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
