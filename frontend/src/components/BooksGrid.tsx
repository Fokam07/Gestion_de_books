'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { livresApi, Livre } from '@/lib/api';
import { FaBook, FaTimes, FaBarcode, FaBuilding, FaCalendarAlt, FaBookmark, FaInfoCircle } from 'react-icons/fa';

interface BooksGridProps {
  searchQuery?: string;
  selectedCategory?: string; // 👈 Pris en compte
  availabilityFilter?: string;
}

export default function BooksGrid({ searchQuery = '', selectedCategory = '', availabilityFilter = 'All' }: BooksGridProps) {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Livre | null>(null);

  useEffect(() => {
    livresApi.getAll()
      .then(res => setLivres(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = livres.filter(livre => {
    // 1. Filtre par recherche texte
    const matchesSearch =
      !searchQuery ||
      livre.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      livre.auteur.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Filtre par Catégorie
    const matchesCategory = !selectedCategory || livre.categorie === selectedCategory;

    // 3. Filtre par disponibilité
    const hasAvailable = livre.exemplaires.some(e => e.statut === 'DISPONIBLE');
    const matchesAvailability =
      availabilityFilter === 'All' ||
      (availabilityFilter === 'available' && hasAvailable) ||
      (availabilityFilter === 'unavailable' && !hasAvailable);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="inline-block w-8 h-8 border-4 border-[#C41C3B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="text-4xl mb-3">📚</p>
        <p className="font-medium">Aucun livre ne correspond à vos filtres actuels.</p>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((livre) => {
            const disponibles = livre.exemplaires.filter(e => e.statut === 'DISPONIBLE').length;
            const hasAvailable = disponibles > 0;
            return (
              <div 
                key={livre.id} 
                onClick={() => setSelectedBook(livre)}
                className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 bg-slate-100 w-full">
                    {livre.imageUrl ? (
                      <Image src={livre.imageUrl} alt={livre.titre} fill className="object-cover" sizes="25vw" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                        <FaBook className="text-4xl mb-2" />
                      </div>
                    )}
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${
                      hasAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {hasAvailable ? `${disponibles} dispo.` : 'Indisponible'}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-base leading-tight mb-1 line-clamp-2">{livre.titre}</h3>
                    <p className="text-slate-500 text-sm mb-2">{livre.auteur}</p>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <div className="w-full py-2 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center gap-2 text-xs font-bold border border-slate-100">
                    <FaInfoCircle /> Voir les détails
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Détails */}
      {selectedBook && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setSelectedBook(null)}>
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden relative flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
            <div className="w-full md:w-44 bg-slate-50 p-6 flex items-center justify-center border-b md:border-r border-slate-100">
              <div className="w-32 h-48 bg-white rounded-xl overflow-hidden border border-slate-200 relative shadow-md">
                {selectedBook.imageUrl ? <img src={selectedBook.imageUrl} alt={selectedBook.titre} className="w-full h-full object-cover" /> : <FaBook className="text-4xl text-slate-200 m-auto" />}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <button onClick={() => setSelectedBook(null)} className="absolute top-4 right-4 text-slate-400 p-2 rounded-full"><FaTimes /></button>
                {selectedBook.categorie && <span className="text-[10px] bg-red-50 text-[#C41C3B] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md">{selectedBook.categorie}</span>}
                <h2 className="text-xl font-black text-slate-800 mt-2 font-serif">{selectedBook.titre}</h2>
                <p className="text-slate-500 text-sm mb-4">par {selectedBook.auteur}</p>
                <div className="space-y-2 border-t border-slate-100 pt-3 text-slate-600 text-sm">
                  {selectedBook.isbn && <div className="flex items-center gap-2"><FaBarcode className="text-slate-400" /> <span><strong>ISBN :</strong> {selectedBook.isbn}</span></div>}
                  {selectedBook.editeur && <div className="flex items-center gap-2"><FaBuilding className="text-slate-400" /> <span><strong>Éditeur :</strong> {selectedBook.editeur}</span></div>}
                  {selectedBook.annee && <div className="flex items-center gap-2"><FaCalendarAlt className="text-slate-400" /> <span><strong>Année :</strong> {selectedBook.annee}</span></div>}
                  {selectedBook.collection && <div className="flex items-center gap-2"><FaBookmark className="text-slate-400" /> <span><strong>Collection :</strong> {selectedBook.collection}</span></div>}
                </div>
              </div>
              <p className="text-xs text-slate-400 text-center mt-6">Connectez-vous pour réserver ou emprunter cet ouvrage.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
