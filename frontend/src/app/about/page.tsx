import Navbar from '@/components/Navbar';
import { FaUsers, FaBook, FaBullseye, FaHeart, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6" style={{ color: '#1A1A1A' }}>
              À Propos de <span style={{ color: '#C41C3B' }}>Shelfio</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#404040' }}>
              Shelfio est une plateforme moderne de gestion de bibliothèque conçue pour simplifier la réservation, l'emprunt et la gestion des livres dans les institutions éducatives.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Mission */}
              <div className="text-center">
                <div className="text-6xl mb-4 flex justify-center" style={{ color: '#C41C3B' }}>
                  <FaBullseye />
                </div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
                  Notre Mission
                </h2>
                <p style={{ color: '#404040' }}>
                  Faciliter l'accès aux livres et promouvoir la lecture dans les communautés éducatives à travers une technologie innovante.
                </p>
              </div>

              {/* Vision */}
              <div className="text-center">
                <div className="text-6xl mb-4 flex justify-center" style={{ color: '#C41C3B' }}>
                  <FaHeart />
                </div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
                  Notre Vision
                </h2>
                <p style={{ color: '#404040' }}>
                  Devenir la plateforme de référence pour la gestion des bibliothèques modernes dans toute l'Afrique et au-delà.
                </p>
              </div>

              {/* Values */}
              <div className="text-center">
                <div className="text-6xl mb-4 flex justify-center" style={{ color: '#C41C3B' }}>
                  <FaCheckCircle />
                </div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
                  Nos Valeurs
                </h2>
                <p style={{ color: '#404040' }}>
                  Transparence, qualité, innovation et engagement envers l'excellence dans chaque aspect de notre service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#1A1A1A' }}>
              Pourquoi Choisir Shelfio ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Interface Intuitive', desc: 'Design moderne et facile à utiliser pour tous les utilisateurs' },
                { title: 'Gestion Automatisée', desc: 'Calcul automatique des retards et des pénalités' },
                { title: 'Notifications en Temps Réel', desc: 'Recevez des alertes sur vos réservations et emprunts' },
                { title: 'Rapport Détaillé', desc: 'Dashboard complet avec statistiques et analyses' },
                { title: 'Multi-rôles', desc: 'Interfaces spécifiques pour admin, bibliothécaire et étudiant' },
                { title: 'Support 24/7', desc: 'Équipe de support réactive à votre écoute' },
              ].map((feature, idx) => (
                <div key={idx} className="p-8 bg-white rounded-lg border-l-4" style={{ borderColor: '#C41C3B' }}>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#C41C3B' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: '#404040' }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#C41C3B' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Prêt à Transformer Votre Bibliothèque ?
            </h2>
            <p className="text-xl mb-8 text-white">
              Rejoignez des centaines d'institutions qui utilisent Shelfio pour gérer efficacement leurs collections.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-bold text-lg transition-all hover:opacity-90 bg-white"
              style={{ color: '#C41C3B' }}
            >
              Commencer Maintenant <FaArrowRight />
            </Link>
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
