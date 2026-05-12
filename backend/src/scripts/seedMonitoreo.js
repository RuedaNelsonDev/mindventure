require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/database');
const { RegistroEmocional, User } = require('../models');

const ESTADO_VALORES = {
  muy_mal: 1,
  mal: 2,
  neutral: 3,
  bien: 4,
  muy_bien: 5,
};

// Patron de recuperacion gradual a lo largo de 28 dias.
// 25 registros (algunos dias se saltan para realismo).
// Distribucion final por estado: muy_mal=2, mal=6, neutral=8, bien=7, muy_bien=2.
const PATRON = [
  // Semana 4 (dias -28 a -21): la mas dura
  { dia: -28, estado: 'mal' },
  { dia: -27, estado: 'muy_mal' },
  { dia: -25, estado: 'mal' },
  { dia: -24, estado: 'muy_mal' },
  { dia: -23, estado: 'mal' },
  { dia: -22, estado: 'mal' },
  { dia: -21, estado: 'neutral' },

  // Semana 3 (dias -20 a -14): empieza a remontar
  { dia: -20, estado: 'mal' },
  { dia: -19, estado: 'neutral' },
  { dia: -18, estado: 'mal' },
  { dia: -17, estado: 'neutral' },
  { dia: -15, estado: 'neutral' },
  { dia: -14, estado: 'neutral' },

  // Semana 2 (dias -13 a -7): mejoria visible
  { dia: -13, estado: 'neutral' },
  { dia: -12, estado: 'bien' },
  { dia: -11, estado: 'neutral' },
  { dia: -10, estado: 'bien' },
  { dia: -8, estado: 'bien' },
  { dia: -7, estado: 'neutral' },

  // Semana 1 (dias -6 a -1): bienestar consolidado. Dejamos hoy (-0) sin
  // registrar para que el usuario pueda probar el flujo "registrar hoy" en la UI.
  { dia: -6, estado: 'bien' },
  { dia: -5, estado: 'bien' },
  { dia: -4, estado: 'muy_bien' },
  { dia: -3, estado: 'bien' },
  { dia: -2, estado: 'muy_bien' },
  { dia: -1, estado: 'bien' },
];

const NOTAS_POOL = [
  'Dia tranquilo',
  'Cansado por el trabajo',
  'Bien despues de caminar un rato',
  'No dormi bien',
  'Conversacion con mi mama me ayudo',
  'Logre terminar lo pendiente',
  'Dia dificil pero pase',
  'Me sente al sol unos minutos',
  'Llamada con un amigo',
  'Hice respiracion 4-7-8 y me sirvio',
  'Me cuesta concentrarme',
  'Mejor que ayer',
  'Sali a caminar al parque',
  'Almuerzo en familia',
];

function aleatorioEntre(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fechaPasada(diasAtras) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + diasAtras);
  fecha.setHours(aleatorioEntre(8, 21), aleatorioEntre(0, 59), aleatorioEntre(0, 59), 0);
  return fecha;
}

function quizasNota() {
  if (Math.random() < 0.3) {
    return NOTAS_POOL[Math.floor(Math.random() * NOTAS_POOL.length)];
  }
  return null;
}

function fmtFecha(f) {
  return f.toISOString().slice(0, 16).replace('T', ' ');
}

async function seed() {
  let conexionAbierta = false;
  try {
    const emailArg = process.argv[2];

    await connectDB();
    conexionAbierta = true;

    let user;
    if (emailArg) {
      user = await User.findOne({ email: emailArg.toLowerCase().trim() });
      if (!user) {
        console.error(
          `[Seed Monitoreo] No se encontro usuario con email "${emailArg}"`
        );
        await mongoose.connection.close();
        process.exit(1);
      }
    } else {
      user = await User.findOne();
      if (!user) {
        console.error(
          '[Seed Monitoreo] No hay usuarios en la BD. Crea uno primero con POST /api/auth/registrar o desde la pantalla de registro del frontend.'
        );
        await mongoose.connection.close();
        process.exit(1);
      }
    }

    console.log(`[Seed Monitoreo] Usuario objetivo: ${user.email} (${user._id})`);

    const eliminados = await RegistroEmocional.deleteMany({ userId: user._id });
    console.log(
      `[Seed Monitoreo] Eliminados ${eliminados.deletedCount} registros previos del usuario`
    );

    const docs = PATRON.map((p) => {
      const fecha = fechaPasada(p.dia);
      const doc = {
        userId: user._id,
        estadoAnimo: p.estado,
        valorNumerico: ESTADO_VALORES[p.estado],
        createdAt: fecha,
        updatedAt: fecha,
      };
      const nota = quizasNota();
      if (nota) doc.nota = nota;
      return doc;
    });

    // timestamps: false → respeta los createdAt/updatedAt que pasamos
    // (de lo contrario Mongoose los sobrescribe con Date.now()).
    await RegistroEmocional.insertMany(docs, { timestamps: false });

    const porEstado = docs.reduce((acc, d) => {
      acc[d.estadoAnimo] = (acc[d.estadoAnimo] || 0) + 1;
      return acc;
    }, {});

    const fechasOrdenadas = docs
      .map((d) => d.createdAt)
      .sort((a, b) => a - b);

    const conNota = docs.filter((d) => d.nota).length;
    const porcentajeNotas = Math.round((conNota / docs.length) * 100);

    console.log('');
    console.log(
      `Seed completado: ${docs.length} registros insertados para ${user.email}`
    );
    console.log('Distribucion por estado:', porEstado);
    console.log(
      `Rango de fechas: ${fmtFecha(fechasOrdenadas[0])} -> ${fmtFecha(fechasOrdenadas[fechasOrdenadas.length - 1])}`
    );
    console.log(
      `Notas: ${conNota}/${docs.length} registros con nota corta (${porcentajeNotas}%)`
    );

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Monitoreo] Error:', err);
    if (conexionAbierta) {
      try {
        await mongoose.connection.close();
      } catch (_) {
        // ignore
      }
    }
    process.exit(1);
  }
}

seed();
