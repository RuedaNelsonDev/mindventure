import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';
import clsx from 'clsx';

// Markdown ligero: **negrita** y listas con "- ".
// Linebreaks dentro de un parrafo se preservan via whitespace-pre-wrap.
function MensajeFormateado({ texto }) {
  if (!texto) return null;

  const lineas = String(texto).split('\n');
  const bloques = [];
  let listaActual = null;
  let key = 0;

  for (const linea of lineas) {
    const trimmed = linea.trim();
    if (trimmed.startsWith('- ')) {
      if (!listaActual) {
        listaActual = [];
        bloques.push({ tipo: 'lista', items: listaActual, key: key++ });
      }
      listaActual.push(trimmed.slice(2));
    } else if (trimmed === '') {
      listaActual = null;
      bloques.push({ tipo: 'espacio', key: key++ });
    } else {
      listaActual = null;
      bloques.push({ tipo: 'parrafo', contenido: linea, key: key++ });
    }
  }

  return bloques.map((b) => {
    if (b.tipo === 'lista') {
      return (
        <ul key={b.key} className="list-disc pl-5 my-2 space-y-1">
          {b.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    }
    if (b.tipo === 'espacio') {
      return <div key={b.key} className="h-2" />;
    }
    return <p key={b.key}>{renderInline(b.contenido)}</p>;
  });
}

function renderInline(texto) {
  const partes = String(texto).split(/(\*\*[^*]+\*\*)/g);
  return partes.map((parte, i) => {
    if (parte.startsWith('**') && parte.endsWith('**')) {
      return <strong key={i}>{parte.slice(2, -2)}</strong>;
    }
    return parte;
  });
}

function Timestamp({ fecha, className }) {
  if (!fecha) return null;
  const d = fecha instanceof Date ? fecha : new Date(fecha);
  if (!isValid(d)) return null;
  return (
    <div className={clsx('text-xs text-right mt-2', className)}>
      {format(d, 'HH:mm', { locale: es })}
    </div>
  );
}

export default function BurbujaMensaje({ mensaje, tipo, alertaCrisis }) {
  const esPregunta = tipo === 'pregunta';
  const texto = esPregunta ? mensaje?.pregunta : mensaje?.respuesta;
  const fecha = mensaje?.createdAt;

  if (esPregunta) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%]">
          <div className="bg-primary-100 border border-primary-200 text-primary-900 rounded-2xl rounded-br-sm px-4 py-3">
            <div className="text-sm break-words">
              <MensajeFormateado texto={texto} />
            </div>
            <Timestamp fecha={fecha} className="text-primary-700/70" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-xl flex-shrink-0 mt-1">
        <span aria-hidden="true">🧠</span>
      </div>
      <div className="max-w-[80%]">
        <div
          className={clsx(
            'bg-white rounded-2xl rounded-bl-sm px-4 py-3',
            alertaCrisis
              ? 'border-2 border-red-300'
              : 'border border-primary-100'
          )}
        >
          {alertaCrisis && (
            <div className="flex items-center gap-1.5 text-xs text-red-700 mb-2 pb-2 border-b border-red-100 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>Apoyo prioritario</span>
            </div>
          )}
          <div className="text-sm text-text-main break-words">
            <MensajeFormateado texto={texto} />
          </div>
          <Timestamp fecha={fecha} className="text-text-muted" />
        </div>
      </div>
    </div>
  );
}
