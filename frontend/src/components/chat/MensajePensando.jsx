export default function MensajePensando() {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-xl flex-shrink-0 mt-1">
        <span aria-hidden="true">🧠</span>
      </div>
      <div className="bg-white border border-primary-100 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex gap-1" aria-hidden="true">
            <span
              className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </span>
          <span className="text-sm text-text-muted">
            MindVenture esta pensando...
          </span>
        </div>
      </div>
    </div>
  );
}
