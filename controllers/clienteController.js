const Cliente = require('../models/Cliente');
const bcrypt = require('bcrypt');

// Login demo
const login = (req, res) => {
  res.render('login', { error: null });
};

const loginPost = (req, res) => {
  const { email, password } = req.body;
  if (email === 'demo@jp.com' && password === '123') {
    req.session.usuario = { email };
    return res.redirect('/');
  } else {
    return res.render('login', { error: 'Credenciales incorrectas' });
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

// Mostrar todos los clientes
const mostrarClientes = async (req, res) => {
  const busqueda = req.query.busqueda || '';
  const regex = new RegExp(busqueda, 'i');

  const clientes = await Cliente.find({
    $or: [
      { nombre: regex },
      { apellido: regex }
    ]
  }).sort({ apellido: 1 });

  const hoy = new Date();
  let totalIngresos = 0;
  let cumpleanieros = [];
  let proximosCumples = [];

  clientes.forEach(cliente => {
    // Estado de pago
    cliente.estado = 'Vencido';
    if (cliente.fechaPago) {
      const diff = Math.floor((hoy - cliente.fechaPago) / (1000 * 60 * 60 * 24));
      if (diff <= 30) cliente.estado = 'Al Día';
    }

    // Sumar ingresos de hoy
    if (cliente.pagos && cliente.pagos.length) {
      cliente.pagos.forEach(p => {
        const pagoFecha = new Date(p.fecha);
        if (pagoFecha.toDateString() === hoy.toDateString()) {
          totalIngresos += p.monto;
        }
      });
    }

    // Cumpleaños
    if (cliente.fechaNacimiento) {
      const nacimiento = new Date(cliente.fechaNacimiento);
      const dia = nacimiento.getUTCDate();
      const mes = nacimiento.getUTCMonth();

      // Cumpleaños hoy
      if (dia === hoy.getDate() && mes === hoy.getMonth()) {
        cumpleanieros.push(cliente);
      } else {
        // Próximos 5 días
        const cumpleEsteAño = new Date(hoy.getFullYear(), mes, dia);
        const diffDias = Math.floor((cumpleEsteAño - hoy) / (1000 * 60 * 60 * 24));
        if (diffDias > 0 && diffDias <= 5) {
          proximosCumples.push(cliente);
        }
      }
    }
  });

  res.render('index', {
    clientes,
    totalIngresos,
    cumpleanieros,
    proximosCumples,
    busqueda
  });
};

// Ver ficha
const verCliente = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  res.render('editar', { cliente });
};

// Guardar cambios de cliente
const editarCliente = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  Object.assign(cliente, req.body);
  await cliente.save();
  res.redirect(`/cliente/${cliente._id}`);
};

// Agregar pago
const agregarPago = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  const { fecha, monto } = req.body;
  cliente.pagos.push({ fecha, monto });
  cliente.fechaPago = fecha;
  await cliente.save();
  res.redirect(`/cliente/${cliente._id}`);
};

module.exports = {
  login,
  loginPost,
  logout,
  mostrarClientes,
  verCliente,
  editarCliente,
  agregarPago
};
