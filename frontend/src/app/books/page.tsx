'use client';

import Navbar from '@/components/Navbar';
import BooksGrid from '@/components/BooksGrid';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 text-slate-900">Catalogue Complet</h1>
            <p className="text-lg text-slate-600">
              Explorez notre collection de livres et trouvez votre prochaine lecture
            </p>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un livre, auteur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C41C3B] transition-colors"
                />
              </div>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#C41C3B] bg-white cursor-pointer"
              >
                <option value="All">Tous les livres</option>
                <option value="available">Disponibles</option>
                <option value="unavailable">Non disponibles</option>
              </select>
            </div>
          </div>
        </section>

        {/* Books Grid */}
        <BooksGrid searchQuery={searchQuery} availabilityFilter={availabilityFilter} />

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#C41C3B' }}>
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Vous n'avez pas trouvé ce que vous cherchez ?
            </h2>
            <p className="text-lg text-white mb-6">
              Contactez notre équipe pour une recommandation personnalisée.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 rounded-lg text-white font-bold transition-all hover:opacity-90 bg-white"
              style={{ color: '#C41C3B' }}
            >
              Nous Contacter
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: '#E0E0E0', backgroundColor: '#F5F5F5' }}>
        <div className="max-w-6xl mx-auto text-center" style={{ color: '#404040' }}>
          <p>© 2026 Shelfio - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
