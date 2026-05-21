'use client';

import LibrarianNavbar from '@/components/LibrarianNavbar';
import { FaSearch, FaPlus, FaCheckCircle, FaClock, FaUser, FaBook, FaHistory } from 'react-icons/fa';
import { useState } from 'react';

export default function LibrarianDashboard() {
  const [activeTab, setActiveTab] = useState('returns');

  const pendings = [
    { id: 1, user: 'Jean Dupont', email: 'jean.dupont@email.com', book: 'The Great Gatsby', borrowDate: '10 Mai', borrowLimit: '24 Mai', status: 'En cours' },
    { id: 2, user: 'Marie Martin', email: 'marie.martin@email.com', book: 'To Kill a Mockingbird', borrowDate: '12 Mai', borrowLimit: '26 Mai', status: 'En cours' },
  ];

  const reservations = [
    { id: 1, user: 'Pierre Lefebvre', book: '1984', reservedDate: '18 Mai', position: '1ère' },
    { id: 2, user: 'Sophie Bernard', book: 'Sapiens', reservedDate: '19 Mai', position: '2ème' },
    { id: 3, user: 'Thomas Durand', book: 'Pride and Prejudice', reservedDate: '19 Mai', position: '3ème' },
  ];

  const lateBorrowings = [
    { id: 1, user: 'Claire Rousseau', book: 'The Hobbit', dueDate: '15 Mai', penalty: '2.50 €' },
  ];

  const users = [
    { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', role: 'Étudiant', borrowCount: 2 },
    { id: 2, name: 'Marie Martin', email: 'marie.martin@email.com', role: 'Étudiant', borrowCount: 1 },
    { id: 3, name: 'Pierre Lefebvre', email: 'pierre.lefebvre@email.com', role: 'Étudiant', borrowCount: 3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <LibrarianNavbar />
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-800 to-blue-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="max-w-7xl mx-auto relative z-10">
            <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30 uppercase tracking-widest">
              Portail Gestion
            </span>
            <h1 className="text-4xl font-extrabold mt-3 mb-2 font-serif">
              Gestion de la Bibliothèque
            </h1>
            <p className="text-blue-100 font-light font-sans">Bienvenue de retour, Sarah | Administration des flux</p>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 text-center">
                <p className="text-4xl font-black text-blue-600">
                  {pendings.length}
                </p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-3">
                  Emprunts en cours
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 text-center">
                <p className="text-4xl font-black text-amber-500">
                  {reservations.length}
                </p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-3">
                  Réservations
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 text-center animate-pulse">
                <p className="text-4xl font-black text-red-500">
                  {lateBorrowings.length}
                </p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-3">
                  Retards signalés
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 text-center">
                <p className="text-4xl font-black text-emerald-600">
                  {users.length}
                </p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-3">
                  Lecteurs Actifs
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-200 flex-wrap">
              {[
                { id: 'returns', label: 'Gestion des Retours', icon: FaCheckCircle, color: 'text-blue-600 border-blue-600' },
                { id: 'reservations', label: 'Réservations en cours', icon: FaClock, color: 'text-amber-500 border-amber-500' },
                { id: 'late', label: 'Retards & Pénalités', icon: FaHistory, color: 'text-red-500 border-red-500' },
                { id: 'users', label: 'Liste Lecteurs', icon: FaUser, color: 'text-emerald-600 border-emerald-600' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id ? tab.color : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <tab.icon className="text-xs" /> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'returns' && (
              <div className="animate-fade-in">
                <div className="mb-6 flex gap-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom de lecteur, livre..."
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg text-slate-850 text-sm focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>
                  <button className="px-6 py-3 rounded-lg text-white font-bold bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer flex items-center gap-2 text-sm shadow-md">
                    <FaPlus className="text-xs" /> Nouvel Emprunt
                  </button>
                </div>

                <div className="space-y-4">
                  {pendings.map((borrow) => (
                    <div key={borrow.id} className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:scale-[1.005] transition-all">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div>
                          <p className="font-bold text-slate-900">
                            {borrow.user}
                          </p>
                          <p className="text-slate-500 text-xs font-semibold">
                            {borrow.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-700 font-semibold text-sm">
                            {borrow.book}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs">
                            Emprunté le : <span className="font-semibold text-slate-700">{borrow.borrowDate}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-700 font-bold text-xs bg-blue-50 px-2 py-1 rounded border border-blue-100 inline-block font-sans">
                            Retour : {borrow.borrowLimit}
                          </p>
                        </div>
                        <button
                          className="px-4 py-2 rounded-lg text-white font-bold bg-emerald-600 hover:bg-emerald-700 transition-all text-xs cursor-pointer shadow-xs"
                        >
                          ✓ Valider Retour
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reservations' && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 font-serif">
                  Réservations en Attente
                </h2>
                {reservations.map((res) => (
                  <div key={res.id} className="p-6 bg-white rounded-xl border border-slate-100 flex justify-between items-center hover:scale-[1.005] transition-all shadow-xs">
                    <div>
                      <p className="font-bold text-slate-900">
                        {res.user}
                      </p>
                      <p style={{ color: '#404040' }} className="text-sm">
                        Livre: {res.book} | Position: {res.position}
                      </p>
                      <p style={{ color: '#404040' }} className="text-sm">
                        Réservé: {res.reservedDate}
                      </p>
                    </div>
                    <button
                      className="px-4 py-2.5 rounded-lg text-white font-bold bg-[#C41C3B] hover:bg-[#a3132e] text-xs cursor-pointer shadow-xs transition-colors"
                    >
                      Convertir en Emprunt
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'late' && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 font-serif">
                  Retards & Pénalités Actives
                </h2>
                {lateBorrowings.map((late) => (
                  <div key={late.id} className="p-6 bg-rose-50/20 rounded-xl border border-rose-100 flex justify-between items-center hover:scale-[1.005] transition-all shadow-xs">
                    <div>
                      <p className="font-bold text-slate-900">
                        {late.user}
                      </p>
                      <p className="text-slate-600 text-sm mt-0.5">
                        Livre : <span className="font-semibold text-slate-800">{late.book}</span>
                      </p>
                      <p className="text-rose-600 text-xs font-bold mt-1.5 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded inline-block">
                        ⚠️ En retard depuis le : {late.dueDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-rose-600 font-sans">
                        {late.penalty}
                      </p>
                      <button
                        className="px-4 py-2 rounded-lg text-white text-xs font-bold bg-rose-500 hover:bg-rose-600 transition-colors mt-2 cursor-pointer shadow-xs"
                      >
                        Notifier par mail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="animate-fade-in">
                <div className="mb-6 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, adresse e-mail d'un lecteur..."
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg text-slate-850 text-sm focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-100 shadow-xs">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Nom Complet
                        </th>
                        <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Adresse Email
                        </th>
                        <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Rôle
                        </th>
                        <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Emprunts Actifs
                        </th>
                        <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 text-sm font-semibold text-slate-900">
                            {user.name}
                          </td>
                          <td className="p-4 text-sm text-slate-500">
                            {user.email}
                          </td>
                          <td className="p-4 text-sm">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 text-sm font-bold text-slate-700">
                            {user.borrowCount} livres
                          </td>
                          <td className="p-4">
                            <button
                              className="px-3 py-1.5 rounded-lg text-white text-xs font-bold bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                              Détails
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
