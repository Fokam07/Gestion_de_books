'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';

const bookBackgrounds = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop',
    alt: 'Grande bibliothèque classique en bois',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop',
    alt: "Espace d'étude universitaire",
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop',
    alt: "Collection d'ouvrages académiques",
  },
];

// Alignées sur ton Enum Prisma Backend
const categories = [
  { value: 'ROMAN', label: 'Roman' },
  { value: 'SCIENCE_FICTION', label: 'Science Fiction' },
  { value: 'FANTASY', label: 'Fantasy' },
  { value: 'POLICIER', label: 'Policier' },
  { value: 'BIOGRAPHIE', label: 'Biographie' },
  { value: 'HISTOIRE', label: 'Histoire' },
  { value: 'SCIENCE', label: 'Science' },
  { value: 'DEVELOPPEMENT_PERSONNEL', label: 'Développement Personnel' },
  { value: 'JEUNESSE', label: 'Jeunesse' },
  { value: 'PHILOSOPHIE', label: 'Philosophie' },
  { value: 'INFORMATIQUE', label: 'Informatique' },
];

interface HeroCarouselProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (val: string) => void;
}

export default function HeroCarousel({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  availabilityFilter,
  setAvailabilityFilter,
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bookBackgrounds.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full min-h-[42rem] sm:h-170 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 sm:pt-20">
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
              unoptimized
              className="object-cover object-center"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-linear-to-b from-slate-950/70 via-slate-900/60 to-slate-950/40" />
          </div>
        ))}
      </div>

      {/* Content Card */}
      <div className="relative inset-0 flex flex-col items-center justify-center z-10 px-4 sm:px-6 h-full w-full">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-tight text-white drop-shadow-md text-center max-w-4xl font-serif tracking-tight">
          Gestion Moderne de <span className="text-[#FFC107]">Bibliothèque</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 text-slate-200 drop-shadow-sm text-center max-w-2xl font-light tracking-wide">
          Plateforme centrale pour la recherche, la réservation et le suivi de vos ouvrages préférés.
        </p>

        {/* Search & Filter Card */}
        <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20 transform hover:scale-[1.01] transition-all duration-500">
          {/* Barre de recherche principale */}
          <div className="mb-6">
            <div className="relative">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Rechercher par titre, auteur, code ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // 👈 Dynamique
                className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3.5 sm:py-4 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C41C3B] focus:ring-1 focus:ring-[#C41C3B] transition-all text-slate-900 text-sm sm:text-base bg-slate-50/50"
              />
            </div>
          </div>

          {/* Sélections des Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Filtre Catégorie */}
            <div>
              <label className="block text-xs font-bold mb-2 text-slate-700 uppercase tracking-wider">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)} // 👈 Dynamique
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C41C3B] text-slate-700 text-sm bg-white cursor-pointer"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
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
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)} // 👈 Dynamique
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C41C3B] text-slate-700 text-sm bg-white cursor-pointer"
              >
                <option value="All">Tous les ouvrages</option>
                <option value="available">Disponibles immédiatement</option>
                <option value="unavailable">Non disponibles / Réservés</option>
              </select>
            </div>
          </div>

          {/* Bouton d'ancrage visuel vers le bas */}
          <button
            onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            className="w-full mt-6 py-3.5 sm:py-4 rounded-lg text-white font-bold text-sm sm:text-base transition-all duration-300 bg-[#C41C3B] hover:bg-[#a3132e] hover:shadow-lg flex items-center justify-center gap-2"
          >
            <FaSearch className="text-sm" /> Voir les résultats filtrés
          </button>
        </div>
      </div>

      {/* Indicateurs */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {bookBackgrounds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all rounded-full h-2 ${
              index === currentSlide ? 'bg-[#C41C3B] w-8' : 'bg-white/40 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}