const axios = require('axios');

const SYSTEM_PROMPT =
  'Eres MindVenture, un asistente empatico de apoyo emocional para comunidades vulnerables en Colombia. ' +
  'Brindas orientacion basada en terapia cognitivo-conductual, tecnicas de manejo de ansiedad, depresion y estres. ' +
  'NUNCA das diagnosticos clinicos ni recetas medicas. ' +
  'SIEMPRE recomiendas buscar ayuda profesional cuando detectes señales de crisis. ' +
  'Respondes en español colombiano, con calidez, respeto y sin juzgar. ' +
  'Maximo 250 palabras. ' +
  'Si la persona menciona deseos de hacerse daño, suicidio, autolesion o crisis severa, prioriza recomendarle: ' +
  'Linea Nacional MinSalud 192 opcion 4, Linea 106 Bogota, o acudir a urgencias. ' +
  'Ofreces tecnicas concretas como respiracion 4-7-8, grounding 5-4-3-2-1, journaling, mindfulness.';

const TIMEOUT_MS = 25000;

const RESPUESTA_TIMEOUT =
  'Lo siento, estoy tardando en responder. Intenta de nuevo en un momento.';
const RESPUESTA_API_DOWN =
  'Lo siento, estoy teniendo problemas para responder. Intenta de nuevo en unos minutos.';

async function generarRespuesta(pregunta, historial = []) {
  const apiUrl = process.env.DEEPSEEK_API_URL;
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiUrl || !apiKey) {
    console.error('[DeepSeek] Falta DEEPSEEK_API_URL o DEEPSEEK_API_KEY en .env');
    return { respuesta: RESPUESTA_API_DOWN, tokensUsados: 0 };
  }

  const messagesHistorial = historial
    .map((h) => [
      { role: 'user', content: h.pregunta },
      { role: 'assistant', content: h.respuesta },
    ])
    .flat();

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messagesHistorial,
    { role: 'user', content: pregunta },
  ];

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'deepseek-chat',
        messages,
        max_tokens: 800,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: TIMEOUT_MS,
      }
    );

    const respuesta = response?.data?.choices?.[0]?.message?.content;
    const tokensUsados = response?.data?.usage?.total_tokens || 0;

    if (!respuesta || typeof respuesta !== 'string') {
      console.error(
        '[DeepSeek] Respuesta sin contenido valido:',
        JSON.stringify(response?.data)
      );
      return { respuesta: RESPUESTA_API_DOWN, tokensUsados: 0 };
    }

    return { respuesta: respuesta.trim(), tokensUsados };
  } catch (err) {
    if (err.code === 'ECONNABORTED' || /timeout/i.test(err.message || '')) {
      console.error('[DeepSeek] Timeout tras', TIMEOUT_MS, 'ms');
      return { respuesta: RESPUESTA_TIMEOUT, tokensUsados: 0 };
    }
    if (err.response) {
      console.error(
        '[DeepSeek] API respondio con error',
        err.response.status,
        '-',
        typeof err.response.data === 'object'
          ? JSON.stringify(err.response.data)
          : err.response.data
      );
    } else {
      console.error('[DeepSeek] Error de red:', err.code || err.message);
    }
    return { respuesta: RESPUESTA_API_DOWN, tokensUsados: 0 };
  }
}

module.exports = { generarRespuesta, SYSTEM_PROMPT };
