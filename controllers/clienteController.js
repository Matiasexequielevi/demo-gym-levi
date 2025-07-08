const Cliente = require('../models/Cliente');

// Mostrar todos los clientes (con cumpleaños y resumen)
const mostrarClientes = async (req, res) => {
  const clientes = await Cliente.find().sort({ apellido: 1 });

  const ahora = new Date();
  const ahoraArgentina = new Date(ahora.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
  const hoySinHora = new Date(ahoraArgentina);
  hoySinHora.setHours(0, 0, 0, 0);

  const diaHoy = ahoraArgentina.getDate();
  const mesHoy = ahoraArgentina.getMonth();

  let totalIngresos = 0;
  let cumpleañeros = [];
  let proximosCumples = [];

  for (const cliente of clientes) {
    // Estado de pago
    let ultimoPago = null;
    if (cliente.pagos && cliente.pagos.length > 0) {
      ultimoPago = cliente.pagos.reduce((a, b) => new Date(a.fecha) > new Date(b.fecha) ? a : b);

      cliente.pagos.forEach(p => {
        const fechaPago = new Date(p.fecha);
        fechaPago.setHours(0, 0, 0, 0);
        if (fechaPago.getTime() === hoySinHora.getTime()) {
          totalIngresos += p.monto;
        }
      });
    }

    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    if (ultimoPago && new Date(ultimoPago.fecha) >= hace30Dias) {
      cliente.estado = 'Al Día';
    } else {
      cliente.estado = 'Vencido';
    }

    // Cumpleaños
    if (cliente.fechaNacimiento) {
      const cumple = new Date(cliente.fechaNacimiento);
      const diaCumple = cumple.getDate();
      const mesCumple = cumple.getMonth();

      if (diaCumple === diaHoy && mesCumple === mesHoy) {
        cumpleanieros.push(cliente);
      } else {
        const esteAnio = new Date(ahoraArgentina.getFullYear(), mesCumple, diaCumple);
        const diffDias = Math.ceil((esteAnio - ahoraArgentina) / (1000 * 60 * 60 * 24));
        if (diffDias > 0 && diffDias <= 5) {
          proximosCumples.push(cliente);
        }
      }
    }
  }

  res.render('index', {
    clientes,
    totalIngresos,
    cumpleañeros,
    proximosCumples,
    busqueda: ''
  });
};

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

const crearCliente = async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).send('Error al crear el alumno');
  }
};

const verCliente = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  res.render('editar', { cliente });
};

const editarCliente = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  Object.assign(cliente, req.body);
  await cliente.save();
  res.redirect(`/cliente/${cliente._id}`);
};

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
  crearCliente,
  verCliente,
  editarCliente,
  agregarPago
};
