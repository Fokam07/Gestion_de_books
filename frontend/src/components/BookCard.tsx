'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Livre } from '@/lib/api';

const FALLBACK = 'https://placehold.co/300x450/1e1b4b/ffffff?text=📚';

function getDisponibilite(exemplaires?: Livre['exemplaires']) {
  if (!exemplaires || exemplaires.length === 0) return { label: 'Aucun exemplaire', color: 'bg-gray-200 text-gray-600' };
  const dispo = exemplaires.filter((e) => e.statut === 'DISPONIBLE').length;
  if (dispo > 0) return { label: `${dispo} dispo.`, color: 'bg-emerald-100 text-emerald-700' };
  const reserve = exemplaires.some((e) => e.statut === 'RESERVE');
  if (reserve) return { label: 'Réservé', color: 'bg-amber-100 text-amber-700' };
  return { label: 'Emprunté', color: 'bg-red-100 text-red-700' };
}

export default function BookCard({ livre }: { livre: Livre }) {
  const dispo = getDisponibilite(livre.exemplaires);

  return (
    <Link href={`/livres/${livre.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:-translate-y-1">
        {/* Cover */}
        <div className="relative aspect-[2/3] bg-slate-100 overflow-hidden">
          <Image
            src={livre.imageUrl || FALLBACK}
            alt={`Couverture de ${livre.titre}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
            unoptimized={!!livre.imageUrl}
          />
          {/* Badge disponibilité */}
          <div className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${dispo.color}`}>
            {dispo.label}
          </div>
        </div>
        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 text-sm group-hover:text-indigo-600 transition-colors">
            {livre.titre}
          </h3>
          <p className="text-gray-500 text-xs mt-1 truncate">{livre.auteur}</p>
          {livre.annee && <p className="text-gray-400 text-xs mt-0.5">{livre.annee}</p>}
        </div>
      </div>
    </Link>
  );
}
