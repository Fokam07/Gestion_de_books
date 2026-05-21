'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { AxiosError } from 'axios';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    try {
      await register({ nom: formData.name, email: formData.email, password: formData.password });
      // AuthContext redirects to /auth/login after success
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(
        axiosErr.response?.data?.message ||
        'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <span className="text-4xl font-extrabold tracking-tight text-[#C41C3B]">
            Shelfio
          </span>
          <h1 className="text-3xl font-black mt-4 text-slate-800 font-serif">
            Créer un compte étudiant
          </h1>
          <p className="text-slate-500 mt-2">
            Rejoignez notre communauté de lecteurs passionnés et accédez au catalogue complet d'ouvrages.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-slate-100">

          {/* Error Banner */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Nom */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Jean Dupont"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none transition-all text-sm text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none transition-all text-sm text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Téléphone (optionnel)
              </label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-4 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+33 6 12 34 56 78"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none transition-all text-sm text-slate-800 bg-white"
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
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none transition-all text-sm text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-4 text-slate-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none transition-all text-sm text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer mt-6 select-none">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-5 h-5 mt-1 rounded border-slate-300 focus:ring-0"
              />
              <span className="text-sm text-slate-600">
                J'accepte les{' '}
                <Link href="#" className="font-semibold text-[#C41C3B] hover:underline">conditions d'utilisation</Link>
                {' '}et la{' '}
                <Link href="#" className="font-semibold text-[#C41C3B] hover:underline">politique de confidentialité</Link>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={!formData.agreeTerms || isLoading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:shadow-md flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed bg-[#C41C3B] hover:bg-[#a81430] cursor-pointer"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaUserPlus />
              )}
              {isLoading ? 'Création en cours...' : 'Créer mon compte étudiant'}
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

          {/* Login Link */}
          <p className="text-center text-sm text-slate-600">
            Vous avez déjà un compte ?{' '}
            <Link href="/auth/login" className="font-bold text-[#C41C3B] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


