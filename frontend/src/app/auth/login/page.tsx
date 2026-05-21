'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaSignInAlt, FaArrowRight, FaGraduationCap, FaUserTie, FaShieldAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Role toggler state for simulation
  const [role, setRole] = useState<'student' | 'librarian' | 'admin'>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password, rememberMe, role });
    
    // Redirect to the chosen dashboard
    if (role === 'student') {
      router.push('/dashboard/student');
    } else if (role === 'librarian') {
      router.push('/dashboard/librarian');
    } else {
      router.push('/dashboard/admin');
    }
  };

  // Theme styling based on role
  const theme = {
    student: {
      accent: 'emerald',
      bgFrom: 'from-emerald-50',
      colorCode: '#10B981',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
      textAccent: 'text-emerald-600',
    },
    librarian: {
      accent: 'blue',
      bgFrom: 'from-blue-50',
      colorCode: '#3B82F6',
      btnColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      textAccent: 'text-blue-600',
    },
    admin: {
      accent: 'orange',
      bgFrom: 'from-orange-50',
      colorCode: '#F97316',
      btnColor: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500',
      textAccent: 'text-orange-600',
    }
  }[role];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bgFrom} to-slate-50 flex items-center justify-center px-4 py-12 transition-all duration-500`}>
      <div className="max-w-6xl w-full flex bg-white/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/50">
        
        {/* Left Side - Info */}
        <div className="hidden lg:flex flex-1 flex-col justify-center p-12 bg-slate-900 text-white relative">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="relative z-10">
            <div className="mb-8">
              <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Shelfio
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4 font-serif">
              Rejoignez votre portail de lecture
            </h1>
            <p className="text-slate-400 text-lg mb-8 font-light">
              Accédez instantanément à votre espace dédié et gerez votre bibliothèque numérique universitaire.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                  <FaGraduationCap className="text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Portail Étudiant</h4>
                  <p className="text-sm text-slate-400">Consultez l'historique complet, les réservations en cours et l'état des pénalités.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-400">
                  <FaUserTie className="text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Espace Bibliothécaire</h4>
                  <p className="text-sm text-slate-400">Valisez les retours physiques, mettez à jour l'inventaire et suivez les alertes.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-orange-400">
                  <FaShieldAlt className="text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Espace Administrateur</h4>
                  <p className="text-sm text-slate-400">Configurez les rôles d'utilisateurs, examinez l'analyse statistique globale.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-8 sm:p-12 md:p-14 bg-white">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 font-serif">
              Se connecter
            </h2>
            <p className="text-slate-500 mt-2">Veuillez selectionner votre rôle pour vous connecter</p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-3 gap-2 mb-8 bg-slate-100 p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2.5 rounded-lg text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                role === 'student' ? 'bg-white shadow-xs text-emerald-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FaGraduationCap className="text-sm" />
              <span>Étudiant</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('librarian')}
              className={`py-2.5 rounded-lg text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                role === 'librarian' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FaUserTie className="text-sm" />
              <span>Bibliothécaire</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-2.5 rounded-lg text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                role === 'admin' ? 'bg-white shadow-xs text-orange-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FaShieldAlt className="text-sm" />
              <span>Admin</span>
            </button>
          </div>

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
                  className={`w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-hidden transition-all text-sm text-slate-800 bg-white`}
                  style={{ 
                    borderColor: email ? theme.colorCode : undefined 
                  }}
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
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-hidden transition-all text-sm text-slate-800 bg-white"
                  style={{ 
                    borderColor: password ? theme.colorCode : undefined 
                  }}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
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
              <Link href="#" className={`font-semibold hover:underline ${theme.textAccent}`}>
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:shadow-md flex items-center justify-center gap-2 mt-8 cursor-pointer ${theme.btnColor}`}
            >
              <FaSignInAlt /> Se connecter en tant que {role === 'student' ? 'Étudiant' : role === 'librarian' ? 'Bibliothécaire' : 'Administrateur'}
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

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-600">
            Vous n'avez pas de compte ?{' '}
            <Link href="/auth/register" className={`font-bold hover:underline ${theme.textAccent}`}>
              Créer mon compte étudiant
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
  );
}
