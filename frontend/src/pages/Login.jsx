import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import InputField from '../components/forms/InputField';
import SubmitButton from '../components/forms/SubmitButton';
import AlertaError from '../components/forms/AlertaError';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [loading, setLoading] = useState(false);

  function validar() {
    const e = {};
    if (!email.trim()) e.email = 'El email es obligatorio';
    else if (!EMAIL_REGEX.test(email.trim())) e.email = 'Formato de email invalido';
    if (!password) e.password = 'La contrasena es obligatoria';
    setErrores(e);
    return e;
  }

  async function handleLogin() {
    setErrorGeneral('');
    const e = validar();
    if (Object.keys(e).length > 0) {
      const orden = ['email', 'password'];
      for (const campo of orden) {
        if (e[campo]) {
          document.querySelector(`input[name="${campo}"]`)?.focus();
          break;
        }
      }
      return;
    }

    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorGeneral(res.error || 'Error al iniciar sesion');
    }
  }

  function onEnter(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-text-main">Bienvenido de nuevo</h2>
        <p className="text-sm text-text-muted">
          Ingresa para continuar tu camino de bienestar
        </p>
      </div>

      <div className="space-y-4">
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
          placeholder="Tu contrasena"
          autoComplete="current-password"
          required
          icon={Lock}
        />

        <AlertaError mensaje={errorGeneral} />

        <SubmitButton loading={loading} onClick={handleLogin}>
          {loading ? 'Iniciando sesion...' : 'Iniciar sesion'}
        </SubmitButton>
      </div>

      <p className="text-sm text-center text-text-muted">
        ¿No tienes cuenta?{' '}
        <Link
          to="/registro"
          className="font-medium text-primary-700 hover:underline"
        >
          Registrate
        </Link>
      </p>
    </AuthLayout>
  );
}
