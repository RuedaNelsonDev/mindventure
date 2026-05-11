// Diccionario de senales de crisis. La deteccion hace
// texto_usuario.includes(palabra) sobre la version NFD-normalizada de ambos.
//
// DISENO: priorizamos cobertura sobre precision. En un dominio de salud mental
// un falso positivo (mostrar la linea 192 cuando no era estrictamente necesario)
// es mucho menos danino que un falso negativo (no detectar una crisis real).
// Por eso incluimos eufemismos amplios — algunos pueden dispararse fuera de
// contexto, y es aceptable.
const PALABRAS_CRISIS = [
  // --- Explicitas ---
  'suicidio',
  'suicidarme',
  'matarme',
  'quitarme la vida',
  'no quiero vivir',
  'mejor muerto',
  'autolesion',
  'cortarme',
  'hacerme daño',
  'acabar con todo',
  'no aguanto mas',

  // --- Eufemismos suicidas ---
  'no estar aqui',
  'no quiero estar aqui',
  'no quiero estar aca',
  'no quiero seguir',
  'dejar de existir',
  'desaparecer para siempre',
  'irme para siempre',
  'no le importo a nadie',
  'mejor sin mi',
  'no tiene sentido seguir',
  'mejor no haber nacido',
  'no tengo razones para seguir',

  // --- Autolesion y crisis severa ---
  'lastimarme',
  'lesionarme',
  'no puedo mas',
  'no encuentro salida',
  'quiero dormir y no despertar',
  'estoy al limite',
];

// Rango ̀-ͯ = Combining Diacritical Marks (acentos, virgulilla de ñ, etc.).
// Tras NFD esos signos quedan sueltos y se eliminan; "daño" -> "dano", "más" -> "mas".
function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

const PALABRAS_CRISIS_NORMALIZADAS = PALABRAS_CRISIS.map(normalizar);

function detectarCrisis(texto) {
  if (!texto || typeof texto !== 'string') return false;
  const normalizado = normalizar(texto);
  return PALABRAS_CRISIS_NORMALIZADAS.some((palabra) =>
    normalizado.includes(palabra)
  );
}

module.exports = { detectarCrisis, PALABRAS_CRISIS };
