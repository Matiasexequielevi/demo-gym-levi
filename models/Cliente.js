// models/Cliente.js
const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  edad: Number,
  fechaNacimiento: Date,

  celular: String,
  direccion: String,
  fechaInicio: Date,
  fechaPago: Date,
  plan: String,
  pagos: [{
    fecha: Date,
    monto: Number
  }],
  entrenamiento: {
    lunes: String,
    martes: String,
    miercoles: String,
    jueves: String,
    viernes: String,
    sabado: String
  }
});

module.exports = mongoose.model('Cliente', clienteSchema);
