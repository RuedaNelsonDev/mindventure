import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import InputField from '../components/forms/InputField';
import SubmitButton from '../components/forms/SubmitButton';
import AlertaError from '../components/forms/AlertaError';
import PoliticaDatosModal from '../components/PoliticaDatosModal';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /(?=.*[a-zA-Z])(?=.*\d)/;

export default function Registro() {
  const { registro } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [consentimientoDatos, setConsentimientoDatos] = useState(false);

  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [loading, setLoading] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  function validar() {
    const e = {};
    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio';
    else if (nombre.trim().length < 2)
      e.nombre = 'El nombre debe tener al menos 2 caracteres';

    if (!email.trim()) e.email = 'El email es obligatorio';
    else if (!EMAIL_REGEX.test(email.trim()))
      e.email = 'Formato de email invalido';

    if (!password) e.password = 'La contrasena es obligatoria';
    else if (password.length < 8)
      e.password = 'Debe tener al menos 8 caracteres';
    else if (!PASSWORD_REGEX.test(password))
      e.password = 'Debe incluir al menos una letra y un numero';

    if (!confirmarPassword)
      e.confirmarPassword = 'Confirma tu contrasena';
    else if (confirmarPassword !== password)
      e.confirmarPassword = 'Las contrasenas no coinciden';

    if (!consentimientoDatos)
      e.consentimiento = 'Debes aceptar la politica para registrarte';

    setErrores(e);
    return e;
  }

  async function handleRegistro() {
    setErrorGeneral('');
    const e = validar();
    if (Object.keys(e).length > 0) {
      const orden = ['nombre', 'email', 'password', 'confirmarPassword'];
      for (const campo of orden) {
        if (e[campo]) {
          document.querySelector(`input[name="${campo}"]`)?.focus();
          break;
        }
      }
      return;
    }

    setLoading(true);
    const res = await registro({
      nombre: nombre.trim(),
      email: email.trim(),
      password,
      consentimientoDatos: true,
    });
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorGeneral(res.error || 'Error al registrarse');
    }
  }

  function onEnter(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRegistro();
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-text-main">Crea tu cuenta</h2>
        <p className="text-sm text-text-muted">
          Da el primer paso hacia tu bienestar emocional
        </p>
      </div>

      <div className="space-y-4">
        <InputField
          label="Nombre completo"
          name="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={onEnter}
          error={errores.nombre}
          placeholder="Como te llamas"
          autoComplete="name"
          required
          icon={User}
        />

        <InputField
          label="Correo electronico"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={onEnter}
          error={errores.email}
          placeholder="tu@correo.com"
          autoComplete="email"
          required
          icon={Mail}
        />

        <InputField
          label="Contrasena"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={onEnter}
          error={errores.password}
          placeholder="Crea una contrasena segura"
          autoComplete="new-password"
          required
          icon={Lock}
          helpText="Minimo 8 caracteres, debe incluir letra y numero."
        />

        <InputField
          label="Confirmar contrasena"
          name="confirmarPassword"
          type="password"
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          onKeyDown={onEnter}
          error={errores.confirmarPassword}
          placeholder="Repite tu contrasena"
          autoComplete="new-password"
          required
          icon={Lock}
        />

        <ConsentimientoCheckbox
          checked={consentimientoDatos}
          onChange={setConsentimientoDatos}
          onOpenPolicy={() => setPolicyOpen(true)}
          error={errores.consentimiento}
        />

        <AlertaError mensaje={errorGeneral} />

        <SubmitButton loading={loading} onClick={handleRegistro}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </SubmitButton>
      </div>

      <p className="text-sm text-center text-text-muted">
        ¿Ya tienes cuenta?{' '}
        <Link
          to="/login"
          className="font-medium text-primary-700 hover:underline"
        >
          Inicia sesion
        </Link>
      </p>

      <PoliticaDatosModal open={policyOpen} onClose={() => setPolicyOpen(false)} />
    </AuthLayout>
  );
}

function ConsentimientoCheckbox({ checked, onChange, onOpenPolicy, error }) {
  return (
    <div className="space-y-1">
      <div className="flex items-start gap-2">
        <input
          id="consentimiento"
          name="consentimiento"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={!!error}
          className="mt-1 w-4 h-4 rounded border-2 border-primary-300 accent-primary-600 focus:ring-2 focus:ring-primary-500"
        />
        <label
          htmlFor="consentimiento"
          className="text-xs text-text-muted leading-relaxed cursor-pointer"
        >
          He leido y acepto la{' '}
          <button
            type="button"
            onClick={onOpenPolicy}
            className="font-bold text-primary-700 hover:underline"
          >
            Politica de Tratamiento de Datos Personales
          </button>
          {' '}conforme a la Ley 1581 de 2012 de Colombia. Entiendo que
          MindVenture es una herramienta de apoyo emocional y{' '}
          <strong>NO sustituye</strong> atencion profesional en salud mental.
        </label>
      </div>
      {error && (
        <p className="text-xs text-red-600 ml-6" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
