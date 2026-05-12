import { useEffect, useState } from 'react';
import { Heart, X } from 'lucide-react';

const STORAGE_KEY = 'mv_crisis_banner_dismissed';

export default function BannerCrisis() {
  // Empezamos cerrado para evitar parpadeo durante la lectura de localStorage.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === '1';
    setVisible(!dismissed);
  }, []);

  function handleClose() {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-3 mb-4">
      <div className="flex items-start gap-3">
        <Heart className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-amber-900 flex-1 leading-relaxed">
          MindVenture es un apoyo emocional. <strong>NO sustituye</strong> atencion
          profesional. Si estas en crisis:{' '}
          <strong>Linea Nacional MinSalud 192 opcion 4</strong> (24/7).
        </p>
        <button
          onClick={handleClose}
          className="p-1 rounded hover:bg-amber-100 text-amber-700 flex-shrink-0 transition-colors"
          aria-label="Cerrar aviso"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
