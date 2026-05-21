'use client';

import { useState, useMemo } from 'react';
import BookCard from '@/components/BookCard';
import { Livre, CATEGORIES } from '@/lib/api';

export default function CatalogueSection({ livres }: { livres: Livre[] }) {
  const [search, setSearch] = useState('');
  const [categorie, setCategorie] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return livres.filter((l) => {
      const matchSearch =
        !q ||
        l.titre.toLowerCase().includes(q) ||
        l.auteur.toLowerCase().includes(q);
      const matchCategorie = !categorie || l.categorie === categorie;
      return matchSearch && matchCategorie;
    });
  }, [livres, search, categorie]);

  const hasFilter = search || categorie;

  return (
    <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Notre catalogue</h2>
          <p className="text-gray-500 mt-1">{livres.length} titres disponibles</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Rechercher par titre ou auteur…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="sm:w-56 px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
        >
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        {hasFilter && (
          <button
            onClick={() => { setSearch(''); setCategorie(''); }}
            className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl bg-white transition-colors"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Résultat */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-medium">Aucun livre ne correspond à votre recherche.</p>
          <button
            onClick={() => { setSearch(''); setCategorie(''); }}
            className="mt-4 text-indigo-600 text-sm hover:underline"
          >
            Voir tout le catalogue
          </button>
        </div>
      ) : (
        <>
          {hasFilter && (
            <p className="text-sm text-gray-400 mb-4">{filtered.length} résultat(s)</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filtered.map((livre) => (
              <BookCard key={livre.id} livre={livre} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
