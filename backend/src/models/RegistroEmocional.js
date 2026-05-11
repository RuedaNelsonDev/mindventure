const mongoose = require('mongoose');

const ESTADO_ANIMO_VALORES = {
  muy_mal: 1,
  mal: 2,
  neutral: 3,
  bien: 4,
  muy_bien: 5,
};

const registroEmocionalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId es obligatorio'],
      index: true,
    },
    estadoAnimo: {
      type: String,
      enum: {
        values: Object.keys(ESTADO_ANIMO_VALORES),
        message: 'estadoAnimo debe ser muy_mal, mal, neutral, bien o muy_bien',
      },
      required: [true, 'estadoAnimo es obligatorio'],
    },
    valorNumerico: {
      type: Number,
      required: [true, 'valorNumerico es obligatorio'],
      min: [1, 'valorNumerico minimo es 1'],
      max: [5, 'valorNumerico maximo es 5'],
    },
    nota: {
      type: String,
      maxlength: [500, 'La nota no puede superar los 500 caracteres'],
    },
  },
  { timestamps: true }
);

// pre('validate') (no pre('save')) para que valorNumerico exista antes de que
// el validador 'required' lo revise.
registroEmocionalSchema.pre('validate', function (next) {
  if (this.estadoAnimo && ESTADO_ANIMO_VALORES[this.estadoAnimo] !== undefined) {
    this.valorNumerico = ESTADO_ANIMO_VALORES[this.estadoAnimo];
  }
  next();
});

module.exports = mongoose.model('RegistroEmocional', registroEmocionalSchema);
