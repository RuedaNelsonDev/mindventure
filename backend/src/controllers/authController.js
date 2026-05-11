const { User } = require('../models');
const { generarToken } = require('../utils/jwt');
const { exito, error } = require('../utils/respuestas');

async function registrar(req, res) {
  try {
    const { nombre, email, password, consentimientoDatos } = req.body;

    const consentBool =
      consentimientoDatos === true || consentimientoDatos === 'true';

    if (!consentBool) {
      return error(res, 'Debes aceptar el consentimiento de datos', 400);
    }

    const user = await User.create({
      nombre,
      email,
      password,
      consentimientoDatos: true,
    });

    const token = generarToken(user._id);

    return exito(
      res,
      { user, token },
      'Usuario registrado correctamente',
      201
    );
  } catch (err) {
    if (err && err.code === 11000) {
      console.error('[Auth] Email duplicado en registro:', err.keyValue);
      return error(res, 'Este email ya esta registrado', 409);
    }
    if (err && err.name === 'ValidationError') {
      console.error('[Auth] ValidationError en registro:', err.message);
      return error(res, 'Datos invalidos', 422, err.errors);
    }
    console.error('[Auth] Error inesperado en registro:', err);
    return error(res, 'Error al registrar usuario', 500);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return error(res, 'Credenciales invalidas', 401);
    }

    const passwordOk = await user.compararPassword(password);
    if (!passwordOk) {
      return error(res, 'Credenciales invalidas', 401);
    }

    const token = generarToken(user._id);

    return exito(res, { user, token }, 'Inicio de sesion exitoso');
  } catch (err) {
    console.error('[Auth] Error inesperado en login:', err);
    return error(res, 'Error al iniciar sesion', 500);
  }
}

async function perfil(req, res) {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return error(res, 'Usuario no encontrado', 404);
    }

    return exito(res, { user });
  } catch (err) {
    console.error('[Auth] Error al obtener perfil:', err);
    return error(res, 'Error al obtener el perfil', 500);
  }
}

async function actualizarPerfil(req, res) {
  try {
    const { nombre } = req.body;

    if (typeof nombre === 'undefined') {
      return error(res, 'No hay campos validos para actualizar', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { nombre },
      { new: true, runValidators: true, context: 'query' }
    );

    if (!user) {
      return error(res, 'Usuario no encontrado', 404);
    }

    return exito(res, { user }, 'Perfil actualizado correctamente');
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      console.error('[Auth] ValidationError al actualizar perfil:', err.message);
      return error(res, 'Datos invalidos', 422, err.errors);
    }
    console.error('[Auth] Error inesperado al actualizar perfil:', err);
    return error(res, 'Error al actualizar el perfil', 500);
  }
}

module.exports = { registrar, login, perfil, actualizarPerfil };
