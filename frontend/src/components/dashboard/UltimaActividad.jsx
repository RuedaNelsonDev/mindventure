import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ESTADO_EMOJIS = {
  muy_mal: '😢',
  mal: '☹️',
  neutral: '😐',
  bien: '🙂',
  muy_bien: '😄',
};

const ESCENAS = {
  playa: 'Playa Calmante',
  bosque: 'Bosque Sereno',
  espacio: 'Espacio Cosmico',
};

function timeAgo(fecha) {
  try {
    return formatDistanceToNow(new Date(fecha), {
      addSuffix: true,
      locale: es,
    });
  } catch {
    return '';
  }
}

function truncar(texto, max = 80) {
  if (!texto) return '';
  if (texto.length <= max) return texto;
  return texto.slice(0, max).trim() + '...';
}

export default function UltimaActividad({
  ultimasConsultas,
  ultimaSesionVR,
  ultimosRegistros,
}) {
  const items = [];

  if (ultimasConsultas?.length > 0) {
    items.push({
      tipo: 'chat',
      fecha: new Date(ultimasConsultas[0].createdAt),
      contenido: ultimasConsultas[0].pregunta,
      to: '/chat',
    });
  }

  if (ultimaSesionVR) {
    items.push({
      tipo: 'vr',
      fecha: new Date(ultimaSesionVR.createdAt),
      contenido: ESCENAS[ultimaSesionVR.tipoEscena] || ultimaSesionVR.tipoEscena,
      to: '/vr',
    });
  }

  if (ultimosRegistros?.length > 0) {
    ultimosRegistros.slice(0, 2).forEach((r) => {
      items.push({
        tipo: 'registro',
        fecha: new Date(r.createdAt),
        estado: r.estadoAnimo,
        nota: r.nota,
        to: '/monitoreo',
      });
    });
  }

  items.sort((a, b) => b.fecha - a.fecha);
  const visibles = items.slice(0, 4);

  if (visibles.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-primary-100 p-6 text-center">
        <p className="text-text-muted">
          Empieza a explorar MindVenture. Tu actividad aparecera aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-primary-100 p-6">
      <h2 className="text-lg font-bold text-text-main mb-3">
        Actividad reciente
      </h2>
      <ul className="divide-y divide-primary-100">
        {visibles.map((item, i) => (
          <ItemActividad key={i} item={item} />
        ))}
      </ul>
    </div>
  );
}

function ItemActividad({ item }) {
  let Icon;
  let iconBg;
  let contenido;

  if (item.tipo === 'chat') {
    Icon = MessageCircle;
    iconBg = 'bg-primary-100 text-primary-700';
    contenido = (
      <span className="text-sm text-text-main">
        "{truncar(item.contenido, 80)}"
      </span>
    );
  } else if (item.tipo === 'vr') {
    Icon = Sparkles;
    iconBg = 'bg-secondary-100 text-secondary-700';
    contenido = (
      <span className="text-sm text-text-main">
        Sesion en {item.contenido}
      </span>
    );
  } else {
    Icon = Heart;
    iconBg = 'bg-pink-100 text-pink-700';
    contenido = (
      <span className="text-sm text-text-main flex items-center gap-2">
        <span aria-hidden="true">{ESTADO_EMOJIS[item.estado] || '😐'}</span>
        {item.nota ? `"${truncar(item.nota, 60)}"` : 'Registro emocional'}
      </span>
    );
  }

  return (
    <li>
      <Link
        to={item.to}
        className="flex items-center gap-3 py-3 hover:bg-primary-50/40 -mx-3 px-3 rounded-lg transition-colors"
      >
        <span
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${iconBg}`}
        >
          <Icon className="w-4 h-4" aria-hidden="true" />
        </span>
        <div className="flex-1 min-w-0">{contenido}</div>
        <span className="text-xs text-text-muted whitespace-nowrap flex-shrink-0">
          {timeAgo(item.fecha)}
        </span>
      </Link>
    </li>
  );
}
