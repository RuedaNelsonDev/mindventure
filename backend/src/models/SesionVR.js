const mongoose = require('mongoose');

const sesionVRSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId es obligatorio'],
      index: true,
    },
    tipoEscena: {
      type: String,
      enum: {
        values: ['playa', 'bosque', 'espacio'],
        message: 'tipoEscena debe ser playa, bosque o espacio',
      },
      required: [true, 'tipoEscena es obligatorio'],
    },
    duracionSegundos: {
      type: Number,
      required: [true, 'duracionSegundos es obligatorio'],
      min: [0, 'La duracion no puede ser negativa'],
    },
    nivelEstresAntes: {
      type: Number,
      required: [true, 'nivelEstresAntes es obligatorio'],
      min: [1, 'nivelEstresAntes minimo es 1'],
      max: [10, 'nivelEstresAntes maximo es 10'],
    },
    nivelEstresDespues: {
      type: Number,
      min: [1, 'nivelEstresDespues minimo es 1'],
      max: [10, 'nivelEstresDespues maximo es 10'],
    },
    completada: {
      type: Boolean,
      default: false,
    },
    notas: {
      type: String,
      maxlength: [500, 'Las notas no pueden superar los 500 caracteres'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SesionVR', sesionVRSchema);
