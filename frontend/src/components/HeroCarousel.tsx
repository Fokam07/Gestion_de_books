'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';

// --- IMAGES FICTIVES SÉCURISÉES ET PRODUCTION-READY ---
// Utilisation d'identifiants Unsplash uniques avec encodage natif pour éviter les rejets de requêtes
const bookBackgrounds = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop',
    alt: 'Grande bibliothèque classique en bois',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop',
  	alt: 'Espace d\'étude universitaire',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop',
    alt: 'Collection d\'ouvrages académiques',
  },
];

const categories = ['Fiction', 'Science', 'Histoire', 'Biographie', 'Développement Personnel', 'Technologie'];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bookBackgrounds.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  return (
    /* CHANGEMENTS CLÉS DESIGN :
      - h-[680px] : Augmentation de la hauteur globale pour un rendu premium.
      - pt-20 : Remplace le mt-20 pour coller le fond du carrousel directement contre la navbar fixe (h-20) 
        tout en poussant le contenu textuel vers le bas de manière homogène.
    */
    <div className="relative w-full h-[680px] overflow-hidden bg-slate-900 pt-20">
      
      {/* Slides Container */}
      <div className="absolute inset-0 w-full h-full">
        {bookBackgrounds.map((bg, index) => (
          <div
            key={bg.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={bg.src}
              alt={bg.alt}
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority={index === 0}
            />
            {/* Overlay linéaire classique : Assure une lisibilité parfaite des textes et boutons blancs */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/40" />
          </div>
        ))}
      </div>

      {/* Content Card */}
      <div className="relative inset-0 flex flex-col items-center justify-center z-10 px-6 h-full w-full">
        
        {/* Titre au style Classique / Académique */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-white drop-shadow-md text-center max-w-4xl font-serif tracking-tight animate-fade-in">
          Gestion Moderne de <span className="text-[#FFC107] animate-pulse">Bibliothèque</span>
        </h1>
        <p className="text-lg md:text-xl mb-10 text-slate-200 drop-shadow-sm text-center max-w-2xl font-light tracking-wide animate-slide-up">
          Plateforme centrale pour la recherche, la réservation et le suivi de vos ouvrages préférés.
        </p>

        {/* Search & Filter Card - Style Épuré Institutionnel */}
        <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-8 border border-white/20 transform hover:scale-[1.01] transition-all duration-500 animate-slide-up-delayed">
          
          {/* Barre de recherche principale */}
          <div className="mb-6">
            <div className="relative">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Rechercher par titre, auteur, code ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C41C3B] focus:ring-1 focus:ring-[#C41C3B] transition-all text-slate-900 text-base shadow-inner bg-slate-50/50"
              />
            </div>
          </div>

          {/* Sélections des Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Filtre Catégorie */}
            <div>
              <label className="block text-xs font-bold mb-2 text-slate-700 uppercase tracking-wider">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C41C3B] transition-colors text-slate-700 text-sm bg-white cursor-pointer"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre Disponibilité */}
            <div>
              <label className="block text-xs font-bold mb-2 text-slate-700 uppercase tracking-wider">
                Disponibilité
              </label>
              <select
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C41C3B] transition-colors text-slate-700 text-sm bg-white cursor-pointer"
              >
                <option>Tous les ouvrages</option>
                <option>Disponibles immédiatement</option>
                <option>Non disponibles / Réservés</option>
              </select>
            </div>

            {/* Filtre Tri */}
            <div>
              <label className="block text-xs font-bold mb-2 text-slate-700 uppercase tracking-wider">
                Trier par
              </label>
              <select
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C41C3B] transition-colors text-slate-700 text-sm bg-white cursor-pointer"
              >
                <option>Pertinence</option>
                <option>Les plus récents</option>
                <option>Meilleure indexation</option>
                <option>Ordre alphabétique (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Bouton d'action principal */}
          <button
            className="w-full mt-6 py-4 rounded-lg text-white font-bold text-base transition-all duration-300 bg-[#C41C3B] hover:bg-[#a3132e] hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2 transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <FaSearch className="text-sm" /> Lancer la recherche institutionnelle
          </button>
        </div>
      </div>

      {/* Indicateurs de Slide Discrets inférieurs */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {bookBackgrounds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all rounded-full h-2 ${
              index === currentSlide
                ? 'bg-[#C41C3B] w-8'
                : 'bg-white/40 w-2 hover:bg-white/70'
            }`}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}