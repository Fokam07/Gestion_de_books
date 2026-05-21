'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { 
  FaChevronDown, 
  FaHome, 
  FaBook, 
  FaInfoCircle, 
  FaPhone, 
  FaSignInAlt, 
  FaUserPlus
} from 'react-icons/fa';

// 💡 Alignées de manière stricte sur tes enums Prisma pour le filtrage
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

export default function Navbar() {
  const [isCatDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 bg-white/95 backdrop-blur-md z-50 border-b border-slate-200 border-t-4 border-t-[#C41C3B] shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-26">
          
          <Link href="/" className="flex items-center flex-shrink-0 transition-transform active:scale-98 py-2 w-72">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Shelfio Logo"
                width={180}
                height={20}
                priority
                className="object-contain object-left max-w-[240px]" 
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </Link>

          {/* Liens de Navigation */}
          <div className="hidden md:flex items-center gap-8 h-full">
            <Link
              href="/"
              className="relative flex items-center gap-2 h-full text-sm font-semibold text-slate-800 hover:text-[#C41C3B] transition-colors group py-2"
            >
              <FaHome className="text-xs text-slate-400 group-hover:text-[#C41C3B] transition-colors" /> 
              <span>Accueil</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C41C3B] transition-all group-hover:w-full" />
            </Link>

            {/* Menu Déroulant Catégories Dynamisé */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsCategoryDropdownOpen(true)}
              onMouseLeave={() => setIsCategoryDropdownOpen(false)}
            >
              <button
                className="relative flex items-center gap-2 h-full text-sm font-semibold text-slate-800 hover:text-[#C41C3B] transition-colors group cursor-pointer"
              >
                <FaBook className="text-xs text-slate-400 group-hover:text-[#C41C3B] transition-colors" /> 
                <span>Catégories</span>
                <FaChevronDown className={`text-[10px] text-slate-400 group-hover:text-[#C41C3B] transition-transform duration-300 ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C41C3B] transition-all group-hover:w-full" />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute left-0 top-[100%] w-64 bg-white rounded-b-xl shadow-xl border border-slate-100 transition-all duration-300 origin-top-left ${
                  isCatDropdownOpen ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible -translate-y-2'
                }`}
              >
                <div className="py-2 p-1.5 bg-slate-50/50 rounded-b-xl max-h-96 overflow-y-auto">
                  {categories.map((category) => (
                    <Link
                      key={category.value}
                      // 💡 Redirige vers la page d'accueil en passant la vraie valeur enum en paramètre URL
                      href={`/?category=${category.value}`}
                      onClick={() => setIsCategoryDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-white hover:text-[#C41C3B] hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className="relative flex items-center gap-2 h-full text-sm font-semibold text-slate-800 hover:text-[#C41C3B] transition-colors group py-2"
            >
              <FaInfoCircle className="text-xs text-slate-400 group-hover:text-[#C41C3B] transition-colors" /> 
              <span>À Propos</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C41C3B] transition-all group-hover:w-full" />
            </Link>

            <Link
              href="/contact"
              className="relative flex items-center gap-2 h-full text-sm font-semibold text-slate-800 hover:text-[#C41C3B] transition-colors group py-2"
            >
              <FaPhone className="text-xs text-slate-400 group-hover:text-[#C41C3B] transition-colors" /> 
              <span>Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C41C3B] transition-all group-hover:w-full" />
            </Link>
          </div>

          {/* Boutons d'Authentification */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4.5 py-2.5 text-sm font-semibold text-[#C41C3B] rounded-lg border border-slate-200 bg-slate-50/50 transition-all hover:bg-red-50/60 hover:border-red-200 hidden sm:inline-flex items-center gap-2"
            >
              <FaSignInAlt className="text-xs opacity-80" /> Connexion
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#C41C3B] rounded-lg shadow-sm transition-all hover:bg-[#a81430] hover:shadow-md active:scale-98 inline-flex items-center gap-2"
            >
              <FaUserPlus className="text-xs" /> S'inscrire
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}