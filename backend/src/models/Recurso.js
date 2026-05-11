const mongoose = require('mongoose');

const recursoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El titulo es obligatorio'],
      trim: true,
      maxlength: [200, 'El titulo no puede superar los 200 caracteres'],
    },
    categoria: {
      type: String,
      enum: {
        values: ['ansiedad', 'depresion', 'autoestima', 'relaciones', 'meditacion'],
        message: 'Categoria invalida',
      },
      required: [true, 'La categoria es obligatoria'],
      index: true,
    },
    contenido: {
      type: String,
      required: [true, 'El contenido es obligatorio'],
      minlength: [100, 'El contenido debe tener al menos 100 caracteres'],
    },
    autor: {
      type: String,
      default: 'Equipo MindVenture',
    },
    fuente: {
      type: String,
    },
    tiempoLectura: {
      type: Number,
      min: [1, 'El tiempo de lectura minimo es 1 minuto'],
    },
    publicado: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recurso', recursoSchema);
