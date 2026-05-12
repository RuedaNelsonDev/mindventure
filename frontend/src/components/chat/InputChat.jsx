import { useEffect, useRef } from 'react';
import { Loader2, Send } from 'lucide-react';
import clsx from 'clsx';

const MAX_LEN = 1000;
const MAX_HEIGHT_PX = 150;

export default function InputChat({ value, onChange, onEnviar, enviando }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [value]);

  const tooLong = value.length > MAX_LEN;
  const puedeEnviar = !enviando && value.trim().length > 0 && !tooLong;

  function handleSend() {
    if (!puedeEnviar) return;
    onEnviar(value.trim());
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t border-primary-100 bg-surface px-4 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={enviando}
            placeholder="Cuentame como te sientes..."
            rows={1}
            aria-label="Escribe tu mensaje"
            className={clsx(
              'flex-1 resize-none rounded-xl border-2 bg-surface px-4 py-3 text-sm',
              'focus:outline-none transition-colors',
              'placeholder:text-text-muted/60',
              tooLong
                ? 'border-red-400 focus:border-red-500'
                : 'border-primary-100 focus:border-primary-500',
              enviando && 'opacity-60 cursor-not-allowed'
            )}
            style={{ maxHeight: `${MAX_HEIGHT_PX}px` }}
          />
          <button
            onClick={handleSend}
            disabled={!puedeEnviar}
            aria-label="Enviar mensaje"
            className={clsx(
              'w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center',
              'bg-primary-600 text-white transition-colors',
              !puedeEnviar
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-primary-700 active:bg-primary-800'
            )}
          >
            {enviando ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 px-1">
          <span className="text-xs text-text-muted">
            Enter para enviar · Shift+Enter para nueva linea
          </span>
          <span
            className={clsx(
              'text-xs tabular-nums',
              tooLong ? 'text-red-600 font-semibold' : 'text-text-muted'
            )}
          >
            {value.length} / {MAX_LEN}
          </span>
        </div>
      </div>
    </div>
  );
}
