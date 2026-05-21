'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function HeroBanner({ totalLivres }: { totalLivres: number }) {
  const { user } = useAuth();

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 mb-8 backdrop-blur">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {totalLivres} ouvrages disponibles
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
          Votre bibliothèque,
          <br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #818cf8, #c084fc)' }}>
            réinventée.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
          Parcourez notre catalogue, empruntez vos livres préférés et gérez vos réservations en quelques clics.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#catalogue"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-500/30"
          >
            Parcourir le catalogue
          </a>
          {!user && (
            <Link
              href="/auth/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition-colors backdrop-blur"
            >
              Créer un compte
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value: totalLivres, label: 'Titres' },
            { value: '100%', label: 'Gratuit' },
            { value: '24/7', label: 'Disponible' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
              <div className="text-white/50 text-xs mt-1 uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
