'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { AxiosError } from 'axios';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // 💡 SÉCURITÉ : Nettoie les résidus d'anciennes sessions (jetons, rôles en cache)
      // pour éviter que l'intercepteur Axios n'envoie un mauvais jeton ou mélange admin/user
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }

      await login(email, password);
      // Le routage est géré par l'AuthContext en fonction du rôle retourné par le backend
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(
        axiosErr.response?.data?.message ||
        'Impossible de se connecter. Vérifiez vos identifiants.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-4xl font-extrabold tracking-tight text-[#C41C3B]">
            Shelfio
          </span>
          <h1 className="text-3xl font-black mt-4 text-slate-800 font-serif">
            Se connecter
          </h1>
          <p className="text-slate-500 mt-2">
            Entrez vos identifiants pour accéder à votre espace
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-slate-100">
          {/* Error Banner */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none transition-all text-sm text-slate-800 bg-white"
                  style={{ borderColor: email ? '#C41C3B' : undefined }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none transition-all text-sm text-slate-800 bg-white"
                  style={{ borderColor: password ? '#C41C3B' : undefined }}
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex justify-between items-center text-sm pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 focus:ring-0"
                />
                <span>Se souvenir de moi</span>
              </label>
              <Link href="#" className="font-semibold hover:underline text-[#C41C3B]">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:shadow-md flex items-center justify-center gap-2 mt-8 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed bg-[#C41C3B] hover:bg-[#a81430]"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaSignInAlt />
              )}
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-extrabold tracking-wider">
              <span className="px-3 bg-white text-slate-400">
                Ou
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-slate-600">
            Vous n'avez pas de compte ?{' '}
            <Link href="/auth/register" className="font-bold hover:underline text-[#C41C3B]">
              Créer mon compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}