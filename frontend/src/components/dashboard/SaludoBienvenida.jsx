import { useMemo } from 'react';

const FRASES = [
  'Cada pequeño paso cuenta en tu bienestar.',
  'Hoy es un buen dia para cuidarte.',
  'Tu salud emocional importa, y aqui estamos para acompañarte.',
  'Date un momento para ti hoy.',
  'El bienestar se construye dia a dia.',
];

// Hora en Colombia (UTC-5, sin DST) — independiente del timezone del navegador.
function getSaludo() {
  const horaUtc = new Date().getUTCHours();
  const horaColombia = (horaUtc - 5 + 24) % 24;
  if (horaColombia >= 5 && horaColombia < 12) return 'Buenos dias';
  if (horaColombia >= 12 && horaColombia < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function SaludoBienvenida({ nombre }) {
  const frase = useMemo(
    () => FRASES[Math.floor(Math.random() * FRASES.length)],
    []
  );
  const saludo = getSaludo();

  return (
    <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-6 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-text-main mb-2">
        {saludo}, {nombre} <span aria-hidden="true">👋</span>
      </h1>
      <p className="text-text-muted text-base sm:text-lg">{frase}</p>
    </div>
  );
}
