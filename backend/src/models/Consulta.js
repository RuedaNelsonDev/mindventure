const mongoose = require('mongoose');

const consultaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId es obligatorio'],
      index: true,
    },
    pregunta: {
      type: String,
      required: [true, 'La pregunta es obligatoria'],
      trim: true,
      maxlength: [1000, 'La pregunta no puede superar los 1000 caracteres'],
    },
    respuesta: {
      type: String,
      required: [true, 'La respuesta es obligatoria'],
    },
    modeloIA: {
      type: String,
      default: 'deepseek-chat',
    },
    tokensUsados: {
      type: Number,
      default: 0,
    },
    alertaCrisis: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Consulta', consultaSchema);
