import Link from "next/link";
import Image from "next/image";
import {
  FaBook,
  FaUsers,
  FaDownload,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import BooksGrid from "@/components/BooksGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <Navbar />

      <main className="pt-20">
        {/* Section Héro / Recherche */}
        <HeroCarousel />

        {/* Grille des livres populaires */}
        <BooksGrid />

        {/* Section Statistiques / Caractéristiques avec Cartes Interactives */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white border-y border-slate-100 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-red-50/50 rounded-full blur-3xl pointer-events-none -z-10" />
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl font-serif font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
                Pourquoi choisir la plateforme <span className="text-[#C41C3B]">Shelfio</span> ?
              </h2>
              <p className="text-slate-500 text-xl font-light">
                Une infrastructure innovante conçue pour la gestion, la découverte et l'accès universel à la connaissance.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 md:grid-cols-4 sm:gap-x-8">
              {/* Stat 1 */}
              <div className="flex flex-col items-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:border-red-100 transition-all duration-500 hover:-translate-y-3 cursor-pointer group text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-[#C41C3B] mb-8 font-bold text-3xl group-hover:bg-[#C41C3B] group-hover:text-white group-hover:rotate-12 transition-all duration-300 shadow-sm">
                  <FaBook className="text-3xl" />
                </div>
                <dd className="text-5xl font-black tracking-tight text-slate-900 mb-2 group-hover:scale-110 transition-transform duration-300">5K+</dd>
                <dt className="text-lg font-bold text-slate-800 mb-2">Ouvrages Référencés</dt>
                <dd className="text-sm text-slate-500">Un catalogue académique et littéraire complet, enrichi quotidiennement.</dd>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:border-red-100 transition-all duration-500 hover:-translate-y-3 cursor-pointer group text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-[#C41C3B] mb-8 font-bold text-3xl group-hover:bg-[#C41C3B] group-hover:text-white group-hover:rotate-12 transition-all duration-300 shadow-sm">
                  <FaUsers className="text-3xl" />
                </div>
                <dd className="text-5xl font-black tracking-tight text-slate-900 mb-2 group-hover:scale-110 transition-transform duration-300">10K+</dd>
                <dt className="text-lg font-bold text-slate-800 mb-2">Lecteurs Actifs</dt>
                <dd className="text-sm text-slate-500">Une communauté vibrante d'étudiants, de chercheurs et de passionnés.</dd>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:border-red-100 transition-all duration-500 hover:-translate-y-3 cursor-pointer group text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-[#C41C3B] mb-8 font-bold text-3xl group-hover:bg-[#C41C3B] group-hover:text-white group-hover:rotate-12 transition-all duration-300 shadow-sm">
                  <FaDownload className="text-3xl" />
                </div>
                <dd className="text-5xl font-black tracking-tight text-slate-900 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</dd>
                <dt className="text-lg font-bold text-slate-800 mb-2">Disponibilité Totale</dt>
                <dd className="text-sm text-slate-500">Accédez à votre compte, vos réservations et vos prêts à tout moment.</dd>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:border-red-100 transition-all duration-500 hover:-translate-y-3 cursor-pointer group text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-[#C41C3B] mb-8 font-bold text-3xl group-hover:bg-[#C41C3B] group-hover:text-white group-hover:rotate-12 transition-all duration-300 shadow-sm">
                  <FaCheckCircle className="text-3xl" />
                </div>
                <dd className="text-5xl font-black tracking-tight text-slate-900 mb-2 group-hover:scale-110 transition-transform duration-300">100%</dd>
                <dt className="text-lg font-bold text-slate-800 mb-2">Service Accessible</dt>
                <dd className="text-sm text-slate-500">Une gestion moderne et gratuite de vos emprunts littéraires.</dd>
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA Professionnelle avec Éléments de Brillance Animés */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#C41C3B] text-white relative overflow-hidden group">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] group-hover:scale-105 transition-transform duration-1000"></div>
          {/* Animated pulsing glows */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full opacity-5 blur-[120px] animate-pulse"></div>
          <div className="relative max-w-4xl mx-auto text-center z-10">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6 tracking-tight leading-tight">
              Optimisez votre expérience de lecture dès aujourd'hui
            </h2>
            <p className="text-xl sm:text-2xl mb-12 text-red-100 max-w-3xl mx-auto font-light leading-relaxed">
              Rejoignez notre réseau institutionnel pour simplifier vos emprunts et organiser votre collection personnelle en quelques clics.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-white text-[#C41C3B] font-bold text-lg transition-all duration-300 hover:bg-slate-50 hover:scale-105 active:scale-98 shadow-xl hover:shadow-2xl hover:shadow-red-950/20 group/btn"
            >
              <span>Créer un compte personnel</span>
              <FaArrowRight className="text-sm transition-transform duration-300 group-hover/btn:translate-x-2" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logonoword.png"
                alt="Shelfio Logo"
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <span className="font-serif font-bold text-lg text-slate-900 tracking-wider">SHELFIO</span>
            </div>
            <p className="text-sm text-slate-400">
              © 2026 Shelfio International. Tous droits réservés.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
