'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBook, FaUsers, FaDownload, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import BooksGrid from "@/components/BooksGrid";

export default function Home() {
  // 💡 CENTRALISATION DES ÉTATS DE FILTRE POUR LA RECHERCHE AUTO
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <Navbar />

      <main className="pt-20">
        {/* 💡 PASSAGE DES ÉTATS AU CARROUSEL POUR SAISIE */}
        <HeroCarousel 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
        />

        {/* 💡 PASSAGE DES MÊMES ÉTATS À LA GRILLE POUR FILTRAGE INSTANTANÉ */}
        <div id="results-section" className="bg-slate-50/40 border-b border-slate-100">
          <div className="max-w-6xl mx-auto pt-12 px-4">
            <h2 className="text-2xl font-serif font-bold text-slate-800">Résultats de recherche</h2>
            <p className="text-xs text-slate-400 mt-1">Mise à jour en temps réel selon vos critères</p>
          </div>
          <BooksGrid 
            searchQuery={searchQuery} 
            selectedCategory={selectedCategory}
            availabilityFilter={availabilityFilter} 
          />
        </div>

        {/* Section Caractéristiques */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white border-y border-slate-100 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl font-serif font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
                Pourquoi choisir la plateforme <span className="text-[#C41C3B]">Shelfio</span> ?
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 md:grid-cols-4 sm:gap-x-8">
              <div className="flex flex-col items-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#C41C3B] mb-6"><FaBook className="text-2xl" /></div>
                <dd className="text-4xl font-black text-slate-900 mb-1">5K+</dd>
                <dt className="text-sm font-bold text-slate-800">Ouvrages Référencés</dt>
              </div>
              <div className="flex flex-col items-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#C41C3B] mb-6"><FaUsers className="text-2xl" /></div>
                <dd className="text-4xl font-black text-slate-900 mb-1">10K+</dd>
                <dt className="text-sm font-bold text-slate-800">Lecteurs Actifs</dt>
              </div>
              <div className="flex flex-col items-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#C41C3B] mb-6"><FaDownload className="text-2xl" /></div>
                <dd className="text-4xl font-black text-slate-900 mb-1">24/7</dd>
                <dt className="text-sm font-bold text-slate-800">Disponibilité Totale</dt>
              </div>
              <div className="flex flex-col items-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#C41C3B] mb-6"><FaCheckCircle className="text-2xl" /></div>
                <dd className="text-4xl font-black text-slate-900 mb-1">100%</dd>
                <dt className="text-sm font-bold text-slate-800">Service Accessible</dt>
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#C41C3B] text-white text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Optimisez votre expérience de lecture dès aujourd'hui</h2>
          <Link href="/auth/register" className="inline-flex items-center gap-2 mt-6 px-8 py-4 rounded-xl bg-white text-[#C41C3B] font-bold shadow-lg">
            <span>Créer un compte personnel</span> <FaArrowRight />
          </Link>
        </section>
      </main>
    </div>
  );
}
