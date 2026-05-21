'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaGraduationCap, FaBook, FaClock, FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function StudentNavbar() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <nav className="fixed w-full top-0 bg-white/95 backdrop-blur-md z-50 border-b border-emerald-100 border-t-4 border-t-emerald-500 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link href="/" className="flex items-center shrink-0 transition-transform active:scale-98">
            <div className="relative flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Shelfio Logo"
                width={120}
                height={20}
                priority
                className="object-contain" 
              />
              <span className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold font-sans">
                <FaGraduationCap /> Étudiant
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 h-full">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50/50 px-3 py-1.5 rounded-lg">
              <FaUser className="text-xs" />
              <span>Jean Dupont</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <FaSignOutAlt className="text-xs" /> Déconnexion
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
