const { detectarCrisis } = require('../utils/deteccionCrisis');

const CASOS = [
  // --- Deben dar TRUE ---
  { frase: 'A veces pienso que seria mejor no estar aqui', esperado: true },
  { frase: 'Ya no puedo mas con esto', esperado: true },
  { frase: 'Quiero desaparecer para siempre', esperado: true },
  { frase: 'Pienso en hacerme daño', esperado: true },
  { frase: 'No quiero seguir', esperado: true },
  { frase: 'Mejor no haber nacido', esperado: true },
  // --- Deben dar FALSE ---
  { frase: 'Me siento triste hoy', esperado: false },
  { frase: 'Tengo mucha ansiedad por el trabajo', esperado: false },
  { frase: 'No se que hacer con mi vida amorosa', esperado: false },
  { frase: 'Estoy cansado pero ya me dormire', esperado: false },
];

let pasaron = 0;
const total = CASOS.length;

for (const { frase, esperado } of CASOS) {
  const recibido = detectarCrisis(frase);
  const ok = recibido === esperado;
  if (ok) pasaron++;

  const status = ok ? '[OK]' : '[FAIL]';
  const espStr = esperado ? 'TRUE' : 'FALSE';
  const recStr = recibido ? 'TRUE' : 'FALSE';

  console.log(`${status} ${frase} => esperado: ${espStr}, recibido: ${recStr}`);
}

console.log('');
console.log(`Resultado: ${pasaron} de ${total} tests pasaron`);

process.exit(pasaron === total ? 0 : 1);
