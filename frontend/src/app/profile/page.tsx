'use client';

import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaBook, FaCheckCircle, FaClock, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    joinDate: '15 Janvier 2024',
    role: 'Étudiant',
  });

  const borrowedBooks = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', dueDate: '25 Mai 2026', status: 'En cours' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', dueDate: '30 Mai 2026', status: 'En cours' },
  ];

  const reservedBooks = [
    { id: 3, title: '1984', author: 'George Orwell', reservedDate: '18 Mai 2026' },
    { id: 4, title: 'Sapiens', author: 'Yuval Noah Harari', reservedDate: '19 Mai 2026' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="p-8 bg-white rounded-lg border-2 shadow-lg" style={{ borderColor: '#E0E0E0' }}>
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl" style={{ backgroundColor: '#C41C3B', color: 'white' }}>
                    <FaUser />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                    {profile.name}
                  </h2>
                  <p style={{ color: '#C41C3B' }} className="font-semibold">
                    {profile.role}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold" style={{ color: '#404040' }}>
                      <FaEnvelope className="inline mr-2" /> Email
                    </label>
                    <p style={{ color: '#1A1A1A' }}>{profile.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold" style={{ color: '#404040' }}>
                      <FaPhone className="inline mr-2" /> Téléphone
                    </label>
                    <p style={{ color: '#1A1A1A' }}>{profile.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold" style={{ color: '#404040' }}>
                      <FaCalendar className="inline mr-2" /> Membre depuis
                    </label>
                    <p style={{ color: '#1A1A1A' }}>{profile.joinDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t" style={{ borderColor: '#E0E0E0' }}>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#C41C3B', color: 'white' }}
                  >
                    <FaEdit /> Modifier
                  </button>
                  <button
                    className="py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 border-2"
                    style={{ borderColor: '#C41C3B', color: '#C41C3B' }}
                  >
                    <FaSignOutAlt /> Déconnexion
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="md:col-span-2 space-y-6">
              {/* Borrowed Books */}
              <div className="p-8 bg-white rounded-lg border-2" style={{ borderColor: '#E0E0E0' }}>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1A1A1A' }}>
                  <FaBook style={{ color: '#C41C3B' }} /> Livres Empruntés
                </h3>
                <div className="space-y-3">
                  {borrowedBooks.map((book) => (
                    <div key={book.id} className="flex justify-between items-start pb-3 border-b" style={{ borderColor: '#E0E0E0' }}>
                      <div>
                        <p className="font-semibold" style={{ color: '#1A1A1A' }}>
                          {book.title}
                        </p>
                        <p style={{ color: '#404040' }} className="text-sm">
                          par {book.author}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold" style={{ color: '#404040' }}>
                          À retourner: {book.dueDate}
                        </p>
                        <p className="text-sm" style={{ color: '#4CAF50' }}>
                          ✓ {book.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reserved Books */}
              <div className="p-8 bg-white rounded-lg border-2" style={{ borderColor: '#E0E0E0' }}>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1A1A1A' }}>
                  <FaClock style={{ color: '#C41C3B' }} /> Livres Réservés
                </h3>
                <div className="space-y-3">
                  {reservedBooks.map((book) => (
                    <div key={book.id} className="flex justify-between items-start pb-3 border-b" style={{ borderColor: '#E0E0E0' }}>
                      <div>
                        <p className="font-semibold" style={{ color: '#1A1A1A' }}>
                          {book.title}
                        </p>
                        <p style={{ color: '#404040' }} className="text-sm">
                          par {book.author}
                        </p>
                      </div>
                      <p className="text-sm" style={{ color: '#FFC107' }}>
                        Réservé: {book.reservedDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <div className="p-6 bg-white rounded-lg border-2 text-center" style={{ borderColor: '#E0E0E0' }}>
              <div className="text-4xl mb-2 flex justify-center" style={{ color: '#C41C3B' }}>
                <FaBook />
              </div>
              <p className="text-3xl font-bold" style={{ color: '#C41C3B' }}>
                {borrowedBooks.length}
              </p>
              <p style={{ color: '#404040' }}>Livres Empruntés</p>
            </div>

            <div className="p-6 bg-white rounded-lg border-2 text-center" style={{ borderColor: '#E0E0E0' }}>
              <div className="text-4xl mb-2 flex justify-center" style={{ color: '#C41C3B' }}>
                <FaClock />
              </div>
              <p className="text-3xl font-bold" style={{ color: '#C41C3B' }}>
                {reservedBooks.length}
              </p>
              <p style={{ color: '#404040' }}>Livres Réservés</p>
            </div>

            <div className="p-6 bg-white rounded-lg border-2 text-center" style={{ borderColor: '#E0E0E0' }}>
              <div className="text-4xl mb-2 flex justify-center" style={{ color: '#C41C3B' }}>
                <FaCheckCircle />
              </div>
              <p className="text-3xl font-bold" style={{ color: '#C41C3B' }}>
                0
              </p>
              <p style={{ color: '#404040' }}>Pénalités en attente</p>
            </div>
          </div>
        </div>
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
