import Navbar from '@/components/Navbar';
import BooksGrid from '@/components/BooksGrid';
import { FaFilter, FaSearch } from 'react-icons/fa';

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
              Catalogue Complet
            </h1>
            <p className="text-lg" style={{ color: '#404040' }}>
              Explorez notre collection de livres et trouvez votre prochaine lecture
            </p>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un livre, auteur..."
                    className="w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none"
                    style={{ borderColor: '#E0E0E0' }}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#E0E0E0', color: '#404040' }}
                >
                  <option>Toutes les catégories</option>
                  <option>Fiction</option>
                  <option>Science</option>
                  <option>Histoire</option>
                  <option>Littérature</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <select
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#E0E0E0', color: '#404040' }}
                >
                  <option>Tous les livres</option>
                  <option>Disponibles</option>
                  <option>Non disponibles</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Books Grid */}
        <BooksGrid />

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#C41C3B' }}>
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Vous n'avez pas trouvé ce que vous cherchez ?
            </h2>
            <p className="text-lg text-white mb-6">
              Contactez notre équipe pour une recommandation personnalisée.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 rounded-lg text-white font-bold transition-all hover:opacity-90 bg-white"
              style={{ color: '#C41C3B' }}
            >
              Nous Contacter
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: '#E0E0E0', backgroundColor: '#F5F5F5' }}>
        <div className="max-w-6xl mx-auto text-center" style={{ color: '#404040' }}>
          <p>© 2026 Shelfio - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
