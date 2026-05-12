import { AlertCircle } from 'lucide-react';

export default function AlertaError({ mensaje }) {
  if (!mensaje) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700"
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <span>{mensaje}</span>
    </div>
  );
}
