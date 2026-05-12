import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function SubmitButton({ loading, disabled, onClick, children }) {
  const isDisabled = loading || disabled;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={clsx(
        'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg',
        'bg-primary-600 text-white font-semibold text-sm',
        'transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-primary-700 active:bg-primary-800'
      )}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}
