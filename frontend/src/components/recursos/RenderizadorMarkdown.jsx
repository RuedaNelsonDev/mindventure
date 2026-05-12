import { Fragment } from 'react';

function renderInline(texto) {
  const partes = String(texto).split(/(\*\*[^*]+\*\*)/g);
  return partes.map((parte, i) => {
    if (parte.startsWith('**') && parte.endsWith('**')) {
      return <strong key={i}>{parte.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{parte}</Fragment>;
  });
}

export default function RenderizadorMarkdown({ contenido, className = '' }) {
  if (!contenido) return null;

  const lineas = String(contenido).split('\n');
  const bloques = [];
  let listaActual = null;
  let parrafoActual = null;
  let key = 0;

  function cerrarParrafo() {
    if (parrafoActual) {
      bloques.push({ tipo: 'p', lineas: parrafoActual, key: key++ });
      parrafoActual = null;
    }
  }

  function cerrarLista() {
    if (listaActual) {
      bloques.push({ tipo: 'ul', items: listaActual, key: key++ });
      listaActual = null;
    }
  }

  for (const linea of lineas) {
    const trimmed = linea.trim();

    if (trimmed.startsWith('### ')) {
      cerrarParrafo();
      cerrarLista();
      bloques.push({ tipo: 'h3', texto: trimmed.slice(4), key: key++ });
    } else if (trimmed.startsWith('- ')) {
      cerrarParrafo();
      if (!listaActual) listaActual = [];
      listaActual.push(trimmed.slice(2));
    } else if (trimmed === '') {
      cerrarParrafo();
      cerrarLista();
    } else {
      cerrarLista();
      if (!parrafoActual) parrafoActual = [];
      parrafoActual.push(linea);
    }
  }
  cerrarParrafo();
  cerrarLista();

  return (
    <div className={`text-base leading-relaxed text-text-main ${className}`}>
      {bloques.map((b) => {
        if (b.tipo === 'h3') {
          return (
            <h3
              key={b.key}
              className="text-xl font-bold text-text-main mt-8 mb-3 first:mt-0"
            >
              {renderInline(b.texto)}
            </h3>
          );
        }
        if (b.tipo === 'ul') {
          return (
            <ul key={b.key} className="list-disc pl-6 mb-4 space-y-2">
              {b.items.map((item, i) => (
                <li key={i}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        // parrafo
        return (
          <p key={b.key} className="mb-4">
            {b.lineas.map((l, i) => (
              <Fragment key={i}>
                {renderInline(l)}
                {i < b.lineas.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
