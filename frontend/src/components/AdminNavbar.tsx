'use client';

import Link from 'next/link';
import { FaUserShield, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import BrandLogo from '@/components/BrandLogo';

export default function AdminNavbar() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed w-full top-0 bg-white/95 backdrop-blur-md z-50 border-b border-orange-100 border-t-4 border-t-orange-500 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-3 py-3 min-h-20">
          
          <Link href="/" className="flex items-center shrink-0 transition-transform active:scale-98">
            <div className="relative flex items-center gap-3 min-w-0">
              <BrandLogo variant="admin" compact />
              <span className="hidden sm:block h-6 w-px bg-slate-200" />
              <div className="hidden sm:flex items-center gap-1.5 bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full text-xs font-bold font-sans">
                <FaUserShield /> Administrateur
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 h-full">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-orange-700 bg-orange-50/50 px-3 py-1.5 rounded-lg">
              <FaUser className="text-xs" />
              <span>{user?.nom ?? 'Admin'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaSignOutAlt className="text-xs" /> Déconnexion
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
