'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-4">Erreur de chargement</h2>
      <pre className="text-xs text-left bg-slate-100 p-4 rounded max-w-full overflow-auto mb-4">
        {error.message}
        {'\n'}
        {error.stack}
      </pre>
      <button
        onClick={reset}
        className="px-4 py-2 bg-[#C41C3B] text-white rounded"
      >
        Réessayer
      </button>
    </div>
  );
}
