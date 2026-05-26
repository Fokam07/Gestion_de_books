'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ padding: 20, fontFamily: 'monospace' }}>
          <h2 style={{ color: 'red' }}>Erreur globale</h2>
          <pre style={{ fontSize: 11, background: '#f0f0f0', padding: 10 }}>
            {error.message}
            {'\n'}
            {error.stack}
          </pre>
          <button onClick={reset}>Réessayer</button>
        </div>
      </body>
    </html>
  );
}
