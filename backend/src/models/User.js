const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [100, 'El nombre no puede superar los 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, 'Formato de email invalido'],
    },
    password: {
      type: String,
      required: [true, 'La contrasena es obligatoria'],
      minlength: [8, 'La contrasena debe tener al menos 8 caracteres'],
      select: false,
    },
    consentimientoDatos: {
      type: Boolean,
      required: [true, 'Debe aceptar el consentimiento de datos'],
      validate: {
        validator: (v) => v === true,
        message: 'Debe aceptar el consentimiento de datos para registrarse',
      },
    },
    fechaConsentimiento: {
      type: Date,
      default: Date.now,
    },
    rol: {
      type: String,
      enum: ['usuario', 'profesional'],
      default: 'usuario',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.compararPassword = async function (passwordPlano) {
  if (!this.password) return false;
  return bcrypt.compare(passwordPlano, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
