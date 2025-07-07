// routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const {
  login,
  loginPost,
  logout,
  mostrarClientes,
  verCliente,
  editarCliente,
  agregarPago
} = require('../controllers/clienteController');

// Middleware para proteger rutas
function protegido(req, res, next) {
  if (req.session.usuario) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Rutas de login
router.get('/login', login);
router.post('/login', loginPost);
router.get('/logout', logout);

// Inicio protegido
router.get('/', protegido, mostrarClientes);

// Ficha del cliente
router.get('/cliente/:id', protegido, verCliente);
router.post('/cliente/:id', protegido, editarCliente);

// Agregar pago
router.post('/cliente/:id/pago', protegido, agregarPago);

// Nuevo alumno
router.get('/nuevo', protegido, (req, res) => {
  res.render('nueva');
});

router.post('/nuevo', protegido, async (req, res) => {
  const Cliente = require('../models/Cliente');

  const nuevo = new Cliente({
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    edad: req.body.edad,
    fechaNacimiento: req.body.fechaNacimiento,

    celular: req.body.celular,
    direccion: req.body.direccion,
    fechaInicio: req.body.fechaInicio,
    fechaPago: null,
    plan: req.body.plan,
    entrenamiento: {
      lunes: '',
      martes: '',
      miercoles: '',
      jueves: '',
      viernes: '',
      sabado: ''
    },
    pagos: []
  });

  await nuevo.save();
  res.redirect('/');
});
// Reportes
router.get('/reportes', protegido, async (req, res) => {
  const Cliente = require('../models/Cliente');
  const desde = req.query.desde || '';
  const hasta = req.query.hasta || '';
  const pagosFiltrados = [];
  let total = 0;

  const clientes = await Cliente.find();

  clientes.forEach(c => {
    c.pagos.forEach(p => {
      const f = new Date(p.fecha);
      const dentroRango =
        (!desde || f >= new Date(desde)) &&
        (!hasta || f <= new Date(hasta));
      if (dentroRango) {
        pagosFiltrados.push({
          nombre: c.nombre,
          apellido: c.apellido,
          fecha: f,
          monto: p.monto
        });
        total += p.monto;
      }
    });
  });

  res.render('reportes', { pagosFiltrados, total, desde, hasta });
});
// Eliminar alumno
router.post('/cliente/:id/eliminar', protegido, async (req, res) => {
  const Cliente = require('../models/Cliente');
  await Cliente.findByIdAndDelete(req.params.id);
  res.redirect('/');
});


module.exports = router;
