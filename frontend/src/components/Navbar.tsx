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
  FaUserPlus,
  FaGraduationCap,
  FaUserShield,
  FaBookReader,
  FaStar
} from 'react-icons/fa';

const categories = [
  'Science',
  'Littérature',
  'Histoire',
  'Développement Personnel',
  'Fiction',
  'Biographie',
  'Jeunesse',
];

export default function Navbar() {
  const [isCatDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isPortalsDropdownOpen, setIsPortalsDropdownOpen] = useState(false);

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
                className="object-contain object-left h-auto w-full max-w-[240px]" 
              />
            </div>
          </Link>

          {/* Liens de Navigation Style Institutionnel Académique */}
          <div className="hidden md:flex items-center gap-8 h-full">
            <Link
              href="/"
              className="relative flex items-center gap-2 h-full text-sm font-semibold text-slate-800 hover:text-[#C41C3B] transition-colors group py-2"
            >
              <FaHome className="text-xs text-slate-400 group-hover:text-[#C41C3B] transition-colors" /> 
              <span>Accueil</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C41C3B] transition-all group-hover:w-full" />
            </Link>

            {/* Menu Déroulant Catégories */}
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
                className={`absolute left-0 top-[100%] w-60 bg-white rounded-b-xl shadow-xl border border-slate-100 transition-all duration-300 origin-top-left ${
                  isCatDropdownOpen ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible -translate-y-2'
                }`}
              >
                <div className="py-2 p-1.5 bg-slate-50/50 rounded-b-xl">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      href={`/books?category=${encodeURIComponent(category)}`}
                      className="block px-4 py-2.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-white hover:text-[#C41C3B] hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                    >
                      {category}
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

            {/* Menu Déroulant Espaces Portails avec animations premium */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsPortalsDropdownOpen(true)}
              onMouseLeave={() => setIsPortalsDropdownOpen(false)}
            >
              <button
                className="relative flex items-center gap-2 h-full text-sm font-semibold text-slate-800 hover:text-[#C41C3B] transition-colors group cursor-pointer"
              >
                <FaBookReader className="text-xs text-slate-400 group-hover:text-[#C41C3B] transition-colors" /> 
                <span className="flex items-center gap-1">
                  Portails
                  <span className="hidden lg:inline-flex bg-red-100 text-[#C41C3B] text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">Nouveau</span>
                </span>
                <FaChevronDown className={`text-[10px] text-slate-400 group-hover:text-[#C41C3B] transition-transform duration-300 ${isPortalsDropdownOpen ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C41C3B] transition-all group-hover:w-full" />
              </button>

              {/* Dropdown Menu Espaces */}
              <div
                className={`absolute left-0 top-[100%] w-72 bg-white rounded-b-xl shadow-xl border border-slate-100 transition-all duration-300 origin-top-left p-2 ${
                  isPortalsDropdownOpen ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible -translate-y-2'
                }`}
              >
                <div className="space-y-1">
                  <Link
                    href="/dashboard/student"
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaGraduationCap className="text-sm" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Espace Étudiant</p>
                      <p className="text-[10px] text-slate-400">Emprunts, réservations & profil</p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/librarian"
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaBookReader className="text-sm" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Espace Bibliothécaire</p>
                      <p className="text-[10px] text-slate-400">Gestion des stocks et retours</p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/admin"
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaUserShield className="text-sm" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Espace Administratif</p>
                      <p className="text-[10px] text-slate-400">Rapports, statistiques & sécurité</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

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