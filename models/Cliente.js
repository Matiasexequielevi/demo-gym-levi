// models/Cliente.js
const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  edad: {
    type: Number,
    required: false
  },
  fechaNacimiento: {
    type: Date,
    required: false
  },
  celular: {
    type: String,
    required: false
  },
  direccion: {
    type: String,
    required: false
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaPago: {
    type: Date,
    required: false
  },
  plan: {
    type: String,
    enum: ['Básico', 'Intermedio', 'Full'],
    required: true
  },
  pagos: [
    {
      fecha: {
        type: Date,
        required: true
      },
      monto: {
        type: Number,
        required: true
      }
    }
  ],
  entrenamiento: {
    lunes: { type: String, default: '' },
    martes: { type: String, default: '' },
    miercoles: { type: String, default: '' },
    jueves: { type: String, default: '' },
    viernes: { type: String, default: '' },
    sabado: { type: String, default: '' }
  }
});

module.exports = mongoose.model('Cliente', clienteSchema);
