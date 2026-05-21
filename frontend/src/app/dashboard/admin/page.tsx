'use client';

import AdminNavbar from '@/components/AdminNavbar';
import { FaBook, FaUsers, FaTags, FaClipboard, FaPlus, FaEdit, FaTrash, FaSearch, FaChartLine } from 'react-icons/fa';
import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = {
    totalBooks: 5000,
    availableBooks: 3200,
    borrowedBooks: 1800,
    totalUsers: 1250,
    activeUsers: 980,
    totalReservations: 145,
    penalties: 250.50,
  };

  const books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', available: 45, borrowed: 12 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Littérature', available: 32, borrowed: 8 },
    { id: 3, title: '1984', author: 'George Orwell', category: 'Fiction', available: 28, borrowed: 10 },
  ];

  const categories = [
    { id: 1, name: 'Fiction', booksCount: 1200 },
    { id: 2, name: 'Science', booksCount: 850 },
    { id: 3, name: 'Histoire', booksCount: 680 },
    { id: 4, name: 'Littérature', booksCount: 920 },
    { id: 5, name: 'Développement Personnel', booksCount: 550 },
  ];

  const users = [
    { id: 1, name: 'Jean Dupont', email: 'jean@email.com', role: 'Étudiant', active: true, joinDate: '15 Jan 2024' },
    { id: 2, name: 'Marie Martin', email: 'marie@email.com', role: 'Étudiant', active: true, joinDate: '20 Feb 2024' },
    { id: 3, name: 'Pierre Lefebvre', email: 'pierre@email.com', role: 'Étudiant', active: false, joinDate: '10 Mar 2024' },
  ];

  const topBooks = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', borrowCount: 256 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', borrowCount: 234 },
    { id: 3, title: '1984', author: 'George Orwell', borrowCount: 189 },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', borrowCount: 156 },
    { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', borrowCount: 145 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <AdminNavbar />
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-orange-850 to-orange-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="max-w-7xl mx-auto relative z-10">
            <span className="bg-orange-500/20 text-orange-300 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/30 uppercase tracking-widest">
              Contrôle Central
            </span>
            <h1 className="text-4xl font-extrabold mt-3 mb-2 font-serif">
              Panneau d'Administration
            </h1>
            <p className="text-orange-100 font-light">Supervision globale, rapports et gestion de sécurité</p>
          </div>
        </section>

        {/* Main Statistics */}
        <section className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      Total Livres
                    </p>
                    <p className="text-4xl font-black mt-2 text-[#C41C3B]">
                      {stats.totalBooks}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-[#C41C3B] flex items-center justify-center text-xl">
                    <FaBook />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      Livres Disponibles
                    </p>
                    <p className="text-4xl font-black mt-2 text-emerald-600">
                      {stats.availableBooks}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                    <FaChartLine />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      Total Utilisateurs
                    </p>
                    <p className="text-4xl font-black mt-2 text-blue-600">
                      {stats.totalUsers}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                    <FaUsers />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      Pénalités Totales
                    </p>
                    <p className="text-4xl font-black mt-2 text-amber-500">
                      {stats.penalties.toFixed(2)} €
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl">
                    <FaClipboard />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-200 flex-wrap">
              {[
                { id: 'dashboard', label: 'Aperçu Statistique', icon: FaClipboard, activeColor: 'border-orange-600 text-orange-600' },
                { id: 'books', label: 'Gestion Livres', icon: FaBook, activeColor: 'border-emerald-600 text-emerald-600' },
                { id: 'categories', label: 'Catégories', icon: FaTags, activeColor: 'border-purple-600 text-purple-600' },
                { id: 'users', label: 'Utilisateurs', icon: FaUsers, activeColor: 'border-blue-600 text-blue-600' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id ? tab.activeColor : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <tab.icon /> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Quick Stats */}
                  <div className="p-8 bg-white rounded-xl border border-slate-100 shadow-xs">
                    <h2 className="text-xl font-bold mb-6 font-serif text-slate-800">
                      Statistiques Rapides d'Activité
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-slate-600">Livres Empruntés Actuellement</span>
                        <span className="font-extrabold text-[#C41C3B]">
                          {stats.borrowedBooks}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-slate-600">Utilisateurs Actifs ce Mois</span>
                        <span className="font-extrabold text-emerald-600">
                          {stats.activeUsers}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-600">Réservations en Attente</span>
                        <span className="font-extrabold text-purple-600">
                          {stats.totalReservations}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Borrowed Books */}
                  <div className="p-8 bg-white rounded-xl border border-slate-100 shadow-xs">
                    <h2 className="text-xl font-bold mb-6 font-serif text-slate-800">
                      Top Livres les Plus Empruntés
                    </h2>
                    <div className="space-y-3">
                      {topBooks.slice(0, 5).map((book, idx) => (
                        <div key={book.id} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                          <div>
                            <span className="inline-block text-xs font-bold px-2 py-1 bg-orange-50 text-orange-600 rounded-md mr-3">
                              #{idx + 1}
                            </span>
                            <span className="font-medium text-slate-800 text-sm font-sans">
                              {book.title}
                            </span>
                          </div>
                          <span className="font-extrabold text-[#C41C3B] text-sm">
                            {book.borrowCount} prêtes
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'books' && (
              <div className="animate-fade-in">
                <div className="mb-6 flex gap-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-4 top-4 text-slate-400 animate-pulse" />
                    <input
                      type="text"
                      placeholder="Rechercher un livre..."
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-sm bg-white"
                    />
                  </div>
                  <button className="px-6 py-3 rounded-xl bg-[#C41C3B] hover:bg-red-800 text-white font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer text-sm">
                    <FaPlus /> Ajouter Livre
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-xs">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-100">
                        <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Titre
                        </th>
                        <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Auteur
                        </th>
                        <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Catégorie
                        </th>
                        <th className="p-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                          Disponibles
                        </th>
                        <th className="p-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                          Empruntés
                        </th>
                        <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {books.map((book) => (
                        <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-semibold text-slate-800 text-sm">
                            {book.title}
                          </td>
                          <td className="p-4 text-slate-600 text-sm">
                            {book.author}
                          </td>
                          <td className="p-4 text-slate-600 text-sm">
                            <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium">
                              {book.category}
                            </span>
                          </td>
                          <td className="p-4 text-center font-bold text-emerald-600 text-sm">
                            {book.available}
                          </td>
                          <td className="p-4 text-center font-bold text-amber-500 text-sm">
                            {book.borrowed}
                          </td>
                          <td className="p-4 flex gap-2">
                            <button className="p-2 bg-blue-50 text-blue-600 hover:bg-[#2196F3] hover:text-white rounded-lg transition-colors cursor-pointer">
                              <FaEdit className="text-sm" />
                            </button>
                            <button className="p-2 bg-red-50 text-red-600 hover:bg-rose-600 hover:text-white rounded-lg transition-colors cursor-pointer">
                              <FaTrash className="text-sm" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="animate-fade-in">
                <div className="mb-6 animate-slide-up">
                  <button className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer text-sm">
                    <FaPlus /> Ajouter Catégorie
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up-delayed">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-800 font-sans">
                          {cat.name}
                        </h3>
                        <div className="flex gap-1">
                          <button className="p-2 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer">
                            <FaEdit className="text-xs" />
                          </button>
                          <button className="p-2 bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer">
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500">
                        {cat.booksCount} livres enregistrés
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="animate-fade-in">
                <div className="mb-6 relative animate-slide-up">
                  <FaSearch className="absolute left-4 top-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden transition-all text-sm bg-white"
                  />
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-100 shadow-xs animate-slide-up-delayed">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-100">
                        <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Nom
                        </th>
                        <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Email
                        </th>
                        <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Rôle
                        </th>
                        <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Date Inscription
                        </th>
                        <th className="p-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                          Statut
                        </th>
                        <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-semibold text-slate-800 text-sm">
                            {user.name}
                          </td>
                          <td className="p-4 text-slate-600 text-sm">
                            {user.email}
                          </td>
                          <td className="p-4 text-slate-600 text-sm">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded-md text-xs">
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 text-sm">
                            {user.joinDate}
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                user.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {user.active ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="p-4 flex gap-2">
                            <button className="p-2 bg-blue-50 text-blue-600 hover:bg-[#2196F3] hover:text-white rounded-lg transition-colors cursor-pointer">
                              <FaEdit className="text-sm" />
                            </button>
                            <button className="p-2 bg-red-50 text-red-600 hover:bg-rose-600 hover:text-white rounded-lg transition-colors cursor-pointer">
                              <FaTrash className="text-sm" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
