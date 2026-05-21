'use client';

import StudentNavbar from '@/components/StudentNavbar';
import { FaBook, FaClock, FaCheckCircle, FaSearch, FaStar, FaTimes, FaInbox } from 'react-icons/fa';
import { useState, useMemo } from 'react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('reservations');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [myReservations, setMyReservations] = useState([
    { id: 101, title: '1984', author: 'George Orwell', reservedDate: '18 Mai 2026', position: '3ème' },
    { id: 102, title: 'Sapiens', author: 'Yuval Noah Harari', reservedDate: '19 Mai 2026', position: '5ème' },
  ]);

  const [myBorrowings, setMyBorrowings] = useState([
    { id: 201, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', borrowDate: '10 Mai 2026', dueDate: '24 Mai 2026', status: 'En cours' },
    { id: 202, title: 'To Kill a Mockingbird', author: 'Harper Lee', borrowDate: '12 Mai 2026', dueDate: '26 Mai 2026', status: 'En cours' },
  ]);

  const [availableBooks, setAvailableBooks] = useState([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', rating: 4.5, available: true },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Littérature', rating: 4.8, available: true },
    { id: 3, title: '1984', author: 'George Orwell', category: 'Fiction', rating: 4.6, available: false },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Littérature', rating: 4.7, available: true },
    { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fiction', rating: 4.9, available: true },
    { id: 6, title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Science', rating: 4.4, available: true },
    { id: 7, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', category: 'Littérature', rating: 4.9, available: true },
    { id: 8, title: 'Cosmos', author: 'Carl Sagan', category: 'Science', rating: 4.8, available: true },
  ]);

  const handleReserve = (bookId: number) => {
    const book = availableBooks.find((b) => b.id === bookId);
    if (!book || !book.available) return;

    // Mark book as unavailable in state
    setAvailableBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, available: false } : b))
    );

    // Add to reservations state
    const newRes = {
      id: Date.now(),
      title: book.title,
      author: book.author,
      reservedDate: '21 Mai 2026',
      position: '1er (Disponible au guichet)',
    };
    setMyReservations((prev) => [newRes, ...prev]);

    setSuccessMessage(`Félicitations ! Vous avez réservé "${book.title}". Récupérez-le sous 48h.`);
    setActiveTab('reservations');

    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const handleCancelReservation = (resId: number, title: string) => {
    setMyReservations((prev) => prev.filter((r) => r.id !== resId));
    // Refactor matching book to be available again
    setAvailableBooks((prev) =>
      prev.map((b) => (b.title === title ? { ...b, available: true } : b))
    );
  };

  // Filter logic
  const filteredBooks = useMemo(() => {
    return availableBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All' || book.category === categoryFilter;

      const matchesAvailability =
        availabilityFilter === 'All' ||
        (availabilityFilter === 'available' ? book.available : !book.available);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [availableBooks, searchQuery, categoryFilter, availabilityFilter]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <StudentNavbar />
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-emerald-800 to-emerald-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="max-w-6xl mx-auto relative z-10">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest">
              Portail Universitaire
            </span>
            <h1 className="text-4xl font-extrabold mt-3 mb-2 font-serif">
              Mon Espace Lecteur
            </h1>
            <p className="text-emerald-100 font-light">Bienvenue, Jean Dupont | ID: #STU-2026-09</p>
          </div>
        </section>

        {/* Success Message Banner */}
        {successMessage && (
          <div className="max-w-6xl mx-auto px-4 mt-6">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl flex items-center justify-between shadow-xs animate-slide-in">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-emerald-600 text-xl" />
                <p className="font-semibold text-sm">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-emerald-500 hover:text-emerald-800 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Statistics */}
        <section className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      Livres Empruntés
                    </p>
                    <p className="text-4xl font-black mt-2 text-emerald-600">
                      {myBorrowings.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                    <FaBook />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      Réservations Actives
                    </p>
                    <p className="text-4xl font-black mt-2 text-orange-500">
                      {myReservations.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-xl">
                    <FaClock />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      Amendes / Pénalités
                    </p>
                    <p className="text-4xl font-black mt-2 text-emerald-500">
                      0 €
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl">
                    <FaCheckCircle />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-200">
              {[
                { id: 'reservations', label: 'Mes Réservations', icon: FaClock, color: 'text-orange-500 border-orange-500' },
                { id: 'borrowings', label: 'Mes Emprunts', icon: FaBook, color: 'text-emerald-600 border-emerald-600' },
                { id: 'catalog', label: 'Catalogue & Réservation', icon: FaSearch, color: 'text-blue-600 border-blue-600' },
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
            {activeTab === 'reservations' && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 font-serif">
                  Mes Réservations
                </h2>
                {myReservations.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center bg-white">
                    <FaInbox className="text-4xl text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Vous n'avez pas de réservation active pour le moment.</p>
                    <button
                      onClick={() => setActiveTab('catalog')}
                      className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-all cursor-pointer"
                    >
                      Consulter le catalogue
                    </button>
                  </div>
                ) : (
                  myReservations.map((res) => (
                    <div key={res.id} className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs flex justify-between items-center hover:scale-[1.005] transition-all">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">
                          {res.title}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          par {res.author}
                        </p>
                        <p className="text-amber-600 font-semibold text-xs mt-1 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
                          Position : {res.position}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCancelReservation(res.id, res.title)}
                        className="px-4 py-2 rounded-lg text-white font-semibold bg-red-650 hover:bg-red-700 transition-all cursor-pointer text-sm shadow-xs"
                      >
                        Annuler la réservation
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'borrowings' && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 font-serif">
                  Mes Emprunts
                </h2>
                {myBorrowings.map((borrow) => (
                  <div key={borrow.id} className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:scale-[1.005] transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">
                          {borrow.title}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          par {borrow.author}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Date d'Emprunt</span>
                            <span className="text-slate-700 text-sm font-semibold">{borrow.borrowDate}</span>
                          </div>
                          <div className="bg-red-50 p-2.5 rounded-lg border border-red-100">
                            <span className="text-[10px] uppercase font-bold text-red-400 block">Date de Retour Attendue</span>
                            <span className="text-red-700 text-sm font-semibold">{borrow.dueDate}</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                        {borrow.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'catalog' && (
              <div className="animate-fade-in">
                <div className="mb-8 font-sans">
                  <h2 className="text-2xl font-bold mb-4 text-slate-900 font-serif">
                    Catalogue Complet
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative">
                      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher par titre, auteur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg text-slate-850 focus:outline-none focus:border-emerald-500 text-sm bg-white"
                      />
                    </div>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-4 py-3 border border-slate-200 rounded-lg text-slate-700 text-sm bg-white cursor-pointer focus:outline-none focus:border-emerald-500"
                    >
                      <option value="All">Toutes les catégories</option>
                      <option value="Fiction">Fiction</option>
                      <option value="Littérature">Littérature</option>
                      <option value="Science">Science</option>
                    </select>
                    <select
                      value={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                      className="px-4 py-3 border border-slate-200 rounded-lg text-slate-700 text-sm bg-white cursor-pointer focus:outline-none focus:border-emerald-500"
                    >
                      <option value="All">Tous les livres</option>
                      <option value="available">Disponibles</option>
                      <option value="unavailable">Réservés / Indisponibles</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredBooks.map((book) => (
                    <div key={book.id} className="p-6 bg-white rounded-xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">
                            {book.title}
                          </h3>
                          <p className="text-slate-500 text-sm">
                            {book.author}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded-md text-xs">
                          <FaStar className="text-xs" /> {book.rating}
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">
                        Catégorie: <span className="text-slate-600">{book.category}</span>
                      </p>
                      <button
                        disabled={!book.available}
                        onClick={() => handleReserve(book.id)}
                        className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                          book.available 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        }`}
                      >
                        {book.available ? '📌 Réserver l\'ouvrage' : '🔒 Indisponible'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
