'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg tracking-tight">
            <span className="text-2xl">📚</span>
            <span className="hidden sm:block">Bibliothèque</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {!isAdmin && (
              <Link href="/" className="text-slate-300 hover:text-white text-sm transition-colors">
                Catalogue
              </Link>
            )}
            {user && !isAdmin && (
              <Link href="/mon-compte" className="text-slate-300 hover:text-white text-sm transition-colors">
                Mon compte
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="text-slate-300 hover:text-white text-sm transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-slate-400 text-sm">
                  {user.nom}
                  {isAdmin && <span className="ml-2 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">Admin</span>}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-300 hover:text-white border border-white/20 rounded-lg px-4 py-1.5 transition-colors hover:border-white/40"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg transition-colors"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-slate-900 border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {!isAdmin && <Link href="/" className="text-slate-300 text-sm" onClick={() => setOpen(false)}>Catalogue</Link>}
          {user && !isAdmin && <Link href="/mon-compte" className="text-slate-300 text-sm" onClick={() => setOpen(false)}>Mon compte</Link>}
          {isAdmin && <Link href="/admin" className="text-slate-300 text-sm" onClick={() => setOpen(false)}>Dashboard</Link>}
          {user ? (
            <button onClick={handleLogout} className="text-left text-slate-300 text-sm">Déconnexion</button>
          ) : (
            <div className="flex gap-3">
              <Link href="/auth/login" className="text-slate-300 text-sm" onClick={() => setOpen(false)}>Connexion</Link>
              <Link href="/auth/register" className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg" onClick={() => setOpen(false)}>S'inscrire</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
