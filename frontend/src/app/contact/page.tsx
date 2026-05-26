'use client';

import Navbar from '@/components/Navbar';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaPaperPlane } from 'react-icons/fa';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6" style={{ color: '#1A1A1A' }}>
              Nous Contacter
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto" style={{ color: '#404040' }}>
              Une question ? N'hésitez pas à nous contacter. Notre équipe est toujours là pour vous aider.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Email */}
              <div className="p-6 sm:p-8 bg-white rounded-lg border-2 text-center" style={{ borderColor: '#E0E0E0' }}>
                <div className="text-5xl mb-4 flex justify-center" style={{ color: '#C41C3B' }}>
                  <FaEnvelope />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
                  Email
                </h3>
                <p style={{ color: '#404040' }}>
                  <a href="mailto:support@shelfio.com" style={{ color: '#C41C3B' }} className="hover:underline">
                    support@shelfio.com
                  </a>
                </p>
                <p style={{ color: '#404040' }} className="text-sm mt-2">
                  Nous répondons sous 24h
                </p>
              </div>

              {/* Phone */}
              <div className="p-6 sm:p-8 bg-white rounded-lg border-2 text-center" style={{ borderColor: '#E0E0E0' }}>
                <div className="text-5xl mb-4 flex justify-center" style={{ color: '#C41C3B' }}>
                  <FaPhone />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
                  Téléphone
                </h3>
                <p style={{ color: '#404040' }}>
                  <a href="tel:+33123456789" style={{ color: '#C41C3B' }} className="hover:underline">
                    +33 1 23 45 67 89
                  </a>
                </p>
                <p style={{ color: '#404040' }} className="text-sm mt-2">
                  Lun-Ven: 9h-18h
                </p>
              </div>

              {/* Location */}
              <div className="p-6 sm:p-8 bg-white rounded-lg border-2 text-center" style={{ borderColor: '#E0E0E0' }}>
                <div className="text-5xl mb-4 flex justify-center" style={{ color: '#C41C3B' }}>
                  <FaMapMarkerAlt />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
                  Adresse
                </h3>
                <p style={{ color: '#404040' }}>
                  123 Rue de la Bibliothèque<br />
                  75000 Paris, France
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto">
              <div className="p-6 sm:p-8 bg-white rounded-lg border-2" style={{ borderColor: '#E0E0E0' }}>
                <h2 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: '#1A1A1A' }}>
                  Envoyer un Message
                </h2>
                <form className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                      Nom complet
                    </label>
                    <input
                      type="text"
                      placeholder="Jean Dupont"
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                      style={{ borderColor: '#E0E0E0', color: '#1A1A1A' }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#C41C3B'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#E0E0E0'}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                      style={{ borderColor: '#E0E0E0', color: '#1A1A1A' }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#C41C3B'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#E0E0E0'}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                      Sujet
                    </label>
                    <input
                      type="text"
                      placeholder="Sujet de votre message"
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                      style={{ borderColor: '#E0E0E0', color: '#1A1A1A' }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#C41C3B'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#E0E0E0'}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                      Message
                    </label>
                    <textarea
                      placeholder="Votre message..."
                      rows={6}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                      style={{ borderColor: '#E0E0E0', color: '#1A1A1A' }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#C41C3B'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#E0E0E0'}
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg text-white font-bold text-lg transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#C41C3B' }}
                  >
                    <FaPaperPlane /> Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Social Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: '#1A1A1A' }}>
              Suivez-nous sur les réseaux sociaux
            </h2>
            <div className="flex justify-center gap-6">
              {[
                { icon: FaFacebook, name: 'Facebook' },
                { icon: FaTwitter, name: 'Twitter' },
                { icon: FaLinkedin, name: 'LinkedIn' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-4 rounded-full hover:shadow-lg transition-all"
                  style={{ backgroundColor: '#C41C3B', color: 'white' }}
                >
                  <social.icon className="text-2xl" />
                </a>
              ))}
            </div>
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
