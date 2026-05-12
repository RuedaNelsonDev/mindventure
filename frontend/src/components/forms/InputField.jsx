import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onKeyDown,
  error,
  placeholder,
  autoComplete,
  required,
  icon: Icon,
  helpText,
}) {
  const reactId = useId();
  const id = `field-${name}-${reactId}`;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-text-main">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon
              className={clsx(
                'w-5 h-5',
                error ? 'text-red-500' : 'text-text-muted'
              )}
              aria-hidden="true"
            />
          </span>
        )}

        <input
          id={id}
          name={name}
          type={actualType}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-error` : helpText ? `${id}-help` : undefined
          }
          className={clsx(
            'block w-full rounded-lg border-2 bg-surface px-3 py-2.5 text-sm text-text-main',
            'transition-colors placeholder:text-text-muted/60',
            'focus:outline-none',
            Icon && 'pl-10',
            isPassword && 'pr-10',
            error
              ? 'border-red-400 focus:border-red-500'
              : 'border-primary-100 focus:border-primary-500'
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-primary-700 transition-colors"
            aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Eye className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600">
          {error}
        </p>
      ) : helpText ? (
        <p id={`${id}-help`} className="text-xs text-text-muted">
          {helpText}
        </p>
      ) : null}
    </div>
  );
}
