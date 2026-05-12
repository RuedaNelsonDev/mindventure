import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function PoliticaDatosModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;

    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="politica-titulo"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-surface rounded-xl shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-primary-100">
          <h2
            id="politica-titulo"
            className="text-xl font-bold text-text-main"
          >
            Politica de Tratamiento de Datos
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-primary-50 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 text-sm leading-relaxed">
          <p className="text-text-main">
            MindVenture es una plataforma de acompañamiento emocional desarrollada
            como proyecto academico de la UNAD. Esta politica resume como
            tratamos tus datos personales conforme a la <strong>Ley 1581 de 2012</strong> y
            el Decreto 1377 de 2013 de Colombia.
          </p>

          <div>
            <h3 className="font-semibold text-text-main mb-1">Que datos recolectamos</h3>
            <ul className="list-disc pl-5 space-y-1 text-text-muted">
              <li>Datos de cuenta: <strong>nombre y correo</strong> que nos proporcionas al registrarte, y una contraseña cifrada que jamas almacenamos en texto plano.</li>
              <li>Datos de uso: tus <strong>registros emocionales</strong> diarios, tus <strong>conversaciones con el asistente de IA</strong> y tus <strong>sesiones de Realidad Virtual</strong> completadas.</li>
              <li>Datos tecnicos minimos para el funcionamiento del servicio (fechas, identificadores anonimos).</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-main mb-1">Para que los usamos</h3>
            <p className="text-text-muted">
              Unicamente para brindarte el servicio de acompañamiento emocional:
              recordar tu historial, personalizar recomendaciones de recursos y
              calcular tus indicadores de bienestar. <strong>MindVenture no realiza
              diagnosticos clinicos, no sustituye a un profesional de la salud
              mental y no comparte tu informacion con terceros</strong>, salvo cuando
              una autoridad legitima lo exija.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-text-main mb-1">Tus derechos como titular</h3>
            <ul className="list-disc pl-5 space-y-1 text-text-muted">
              <li><strong>Conocer:</strong> saber que datos tuyos tenemos almacenados.</li>
              <li><strong>Actualizar:</strong> corregir datos inexactos o desactualizados.</li>
              <li><strong>Suprimir:</strong> eliminar tu cuenta y todos tus registros cuando lo solicites.</li>
              <li><strong>Revocar:</strong> retirar tu consentimiento en cualquier momento.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-main mb-1">Seguridad</h3>
            <p className="text-text-muted">
              Tus credenciales se almacenan cifradas. Tu historial se guarda
              asociado a tu cuenta para que solo tu puedas accederlo.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-text-main mb-1">Contacto</h3>
            <p className="text-text-muted">
              Para ejercer cualquiera de tus derechos o resolver dudas, escribenos
              a <strong>privacidad@mindventure.co</strong>. Responderemos en un maximo
              de 15 dias habiles.
            </p>
          </div>

          <p className="text-xs text-text-muted italic pt-2 border-t border-primary-100">
            Si estas atravesando una crisis emocional, esta plataforma no
            reemplaza la atencion profesional. Linea Nacional MinSalud:
            <strong> 192 opcion 4</strong>, disponible 24/7.
          </p>
        </div>

        <div className="flex justify-end p-4 border-t border-primary-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
