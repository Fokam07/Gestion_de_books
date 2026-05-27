'use client';

import AdminNavbar from '@/components/AdminNavbar';
import { useAuth } from '@/context/AuthContext';
import {
  livresApi, empruntsApi, reservationsApi, exemplaireApi,
  Livre, Emprunt, Reservation, CreateLivrePayload, Categorie
} from '@/lib/api';
import { FaBook, FaClipboard, FaPlus, FaTrash, FaSearch, FaChartLine, FaBoxOpen, FaTimes, FaHourglassHalf, FaBookReader } from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

const categories: { value: Categorie; label: string }[] = [
  { value: 'ROMAN', label: 'Roman' },
  { value: 'SCIENCE_FICTION', label: 'Science Fiction' },
  { value: 'FANTASY', label: 'Fantasy' },
  { value: 'POLICIER', label: 'Policier' },
  { value: 'BIOGRAPHIE', label: 'Biographie' },
  { value: 'HISTOIRE', label: 'Histoire' },
  { value: 'SCIENCE', label: 'Science' },
  { value: 'DEVELOPPEMENT_PERSONNEL', label: 'Développement Personnel' },
  { value: 'JEUNESSE', label: 'Jeunesse' },
  { value: 'PHILOSOPHIE', label: 'Philosophie' },
  { value: 'INFORMATIQUE', label: 'Informatique' },
];

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [livres, setLivres] = useState<Livre[]>([]);
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchBooks, setSearchBooks] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState<CreateLivrePayload>({ 
    titre: '', auteur: '', isbn: '', annee: undefined, editeur: '', imageUrl: '', categorie: undefined 
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [addExemplaireModal, setAddExemplaireModal] = useState<{ livreId: number; titreLivre: string } | null>(null);
  const [addExemplaireCodeBarre, setAddExemplaireCodeBarre] = useState('');
  const [addExemplaireLoading, setAddExemplaireLoading] = useState(false);
  const [addExemplaireError, setAddExemplaireError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [l, e, r] = await Promise.all([
        livresApi.getAll(),
        empruntsApi.getAll(),
        reservationsApi.getAll(),
      ]);
      setLivres(l.data);
      setEmprunts(e.data);
      setReservations(r.data);
      setError(null);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Impossible de charger les donnees d'administration.");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading || user?.role !== 'admin') return;
    loadData();
  }, [isLoading, loadData, user?.role]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      setError('Session invalide. Reconnectez-vous.');
      return;
    }
    if (user.role !== 'admin') {
      setError("Cette session n'a pas les droits administrateur.");
    }
  }, [isLoading, user]);

  const handleDeleteBook = async (id: number, titre: string) => {
    if (!confirm(`Supprimer "${titre}" et tous ses exemplaires ?`)) return;
    setActionLoading(`book-${id}`);
    try {
      await livresApi.delete(id);
      setLivres(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError(e.response?.data?.message || 'Erreur lors de la suppression.');
      setTimeout(() => setError(null), 4000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      const payload: CreateLivrePayload = {
        titre: newBook.titre,
        auteur: newBook.auteur,
        ...(newBook.isbn && { isbn: newBook.isbn }),
        ...(newBook.annee && { annee: Number(newBook.annee) }),
        ...(newBook.editeur && { editeur: newBook.editeur }),
        ...(newBook.imageUrl && { imageUrl: newBook.imageUrl }),
        ...(newBook.categorie && { categorie: newBook.categorie }),
      };
      await livresApi.create(payload);
      await loadData();
      setShowAddModal(false);
      setNewBook({ titre: '', auteur: '', isbn: '', annee: undefined, editeur: '', imageUrl: '', categorie: undefined });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string } | Array<{ message: string }>>;
      if (Array.isArray(axiosErr.response?.data)) {
        setAddError((axiosErr.response?.data as Array<{ message: string }>)[0]?.message || 'Erreur de validation.');
      } else {
        setAddError((axiosErr.response?.data as { message: string })?.message || "Erreur lors de l'ajout.");
      }
    } finally {
      setAddLoading(false);
    }
  };

  const handleValiderEmprunt = async (id: number) => {
    setActionLoading(`emprunt-valider-${id}`);
    try {
      await empruntsApi.valider(id);
      await loadData();
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError(e.response?.data?.message || 'Erreur lors de la validation.');
      setTimeout(() => setError(null), 4000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetournerEmprunt = async (id: number) => {
    setActionLoading(`emprunt-retourner-${id}`);
    try {
      await empruntsApi.validerRetourAdmin(id);
      await loadData();
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError(e.response?.data?.message || 'Erreur lors du retour.');
      setTimeout(() => setError(null), 4000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddExemplaire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addExemplaireModal) return;
    setAddExemplaireLoading(true);
    setAddExemplaireError(null);
    try {
      await exemplaireApi.creerPourLivre(addExemplaireModal.livreId, addExemplaireCodeBarre);
      await loadData();
      setAddExemplaireModal(null);
      setAddExemplaireCodeBarre('');
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setAddExemplaireError(e.response?.data?.message || "Erreur lors de l'ajout de l'exemplaire.");
    } finally {
      setAddExemplaireLoading(false);
    }
  };

  const totalExemplaires = livres.flatMap(l => l.exemplaires);
  const disponibles = totalExemplaires.filter(e => e.statut === 'DISPONIBLE').length;
  const listAttente = emprunts.filter(e => e.statut === 'ATTENTE');
  const listEnCours = emprunts.filter(e => e.statut === 'EN_COURS');
  const reservationsActives = reservations.filter(r => r.statut === 'ACTIVE');

  const filteredLivres = livres.filter(l =>
    l.titre.toLowerCase().includes(searchBooks.toLowerCase()) ||
    l.auteur.toLowerCase().includes(searchBooks.toLowerCase())
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50/50">
      <AdminNavbar />
      <main className="pt-20">
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-slate-800 to-slate-950 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest">
              Contrôle Central
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold mt-3 mb-2 font-serif">Panneau d'Administration</h1>
            <p className="text-slate-300 text-sm sm:text-base font-light">Bienvenue, {user?.nom ?? 'Administrateur'}</p>
          </div>
        </section>

        <section className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between">
                <p className="font-semibold text-sm">{error}</p>
                <button onClick={() => setError(null)} className="text-red-500 cursor-pointer ml-4"><FaTimes /></button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
              <div className="p-3 sm:p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">Total Livres</p>
                <p className="text-2xl sm:text-4xl font-black mt-1 sm:mt-2 text-[#C41C3B]">{livres.length}</p>
                <div className="hidden sm:flex w-8 h-8 rounded-lg bg-red-50 text-[#C41C3B] items-center justify-center mt-2"><FaBook /></div>
              </div>
              <div className="p-3 sm:p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">Dispo.</p>
                <p className="text-2xl sm:text-4xl font-black mt-1 sm:mt-2 text-blue-600">{disponibles}</p>
                <div className="hidden sm:flex w-8 h-8 rounded-lg bg-blue-50 text-blue-600 items-center justify-center mt-2"><FaChartLine /></div>
              </div>
              <div className="p-3 sm:p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">En attente</p>
                <p className="text-2xl sm:text-4xl font-black mt-1 sm:mt-2 text-yellow-600">{listAttente.length}</p>
                <div className="hidden sm:flex w-8 h-8 rounded-lg bg-amber-50 text-yellow-600 items-center justify-center mt-2"><FaHourglassHalf /></div>
              </div>
              <div className="p-3 sm:p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">En cours</p>
                <p className="text-2xl sm:text-4xl font-black mt-1 sm:mt-2 text-emerald-600">{listEnCours.length}</p>
                <div className="hidden sm:flex w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 items-center justify-center mt-2"><FaBookReader /></div>
              </div>
            </div>

            {/* Tabs Restructurés */}
            <div className="mb-6 sm:mb-8 border-b border-slate-200 overflow-x-auto">
              <div className="flex gap-1 sm:gap-4 min-w-max">
                {[
                  { id: 'dashboard',       label: 'Aperçu',           shortLabel: 'Aperçu',    icon: FaClipboard,    activeColor: 'border-[#C41C3B] text-[#C41C3B]' },
                  { id: 'books',           label: 'Livres',            shortLabel: 'Livres',    icon: FaBook,         activeColor: 'border-blue-600 text-blue-600' },
                  { id: 'emprunts_attente',label: 'Valider Remises',  shortLabel: 'Remises',   icon: FaHourglassHalf,activeColor: 'border-amber-500 text-amber-500' },
                  { id: 'emprunts_cours',  label: 'En Cours/Retours', shortLabel: 'En Cours',  icon: FaBookReader,   activeColor: 'border-emerald-500 text-emerald-500' },
                  { id: 'reservations',    label: 'Réservations',     shortLabel: 'Réserv.',   icon: FaBoxOpen,      activeColor: 'border-orange-500 text-orange-500' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 sm:pb-4 px-1 sm:px-0 font-semibold whitespace-nowrap flex items-center gap-1.5 border-b-2 transition-all cursor-pointer text-xs sm:text-sm ${
                      activeTab === tab.id ? tab.activeColor : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <tab.icon className="shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {isLoadingData && (
              <div className="flex justify-center items-center py-20">
                <span className="inline-block w-8 h-8 border-4 border-[#C41C3B] border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!isLoadingData && (
              <>
                {/* APERCU */}
                {activeTab === 'dashboard' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-8 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <h2 className="text-xl font-bold mb-6 font-serif text-slate-800">Activité Globale</h2>
                      <div className="space-y-4">
                        {[
                          { label: 'Total exemplaires', value: totalExemplaires.length, color: 'text-slate-800' },
                          { label: 'Exemplaires disponibles', value: disponibles, color: 'text-blue-600' },
                          { label: 'Exemplaires empruntés', value: totalExemplaires.filter(e => e.statut === 'EMPRUNTE').length, color: 'text-[#C41C3B]' },
                          { label: 'Emprunts en attente de remise', value: listAttente.length, color: 'text-yellow-600' },
                          { label: 'Emprunts en cours de lecture', value: listEnCours.length, color: 'text-emerald-500' },
                          { label: 'Réservations actives', value: reservationsActives.length, color: 'text-orange-500' },
                        ].map(({ label, value, color }) => (
                          <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                            <span className="text-slate-600">{label}</span>
                            <span className={`font-extrabold ${color}`}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* LIVRES */}
                {activeTab === 'books' && (
                  <div>
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        <FaSearch className="absolute left-4 top-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Rechercher un livre..."
                          value={searchBooks}
                          onChange={(e) => setSearchBooks(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#C41C3B] outline-none text-sm bg-white text-slate-800"
                        />
                      </div>
                      <button onClick={() => setShowAddModal(true)} className="px-6 py-3 rounded-xl bg-[#C41C3B] hover:bg-[#a81430] text-white font-semibold flex items-center justify-center gap-2 shadow-sm text-sm">
                        <FaPlus /> Ajouter
                      </button>
                    </div>
                    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50/75 border-b border-slate-100">
                            <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Titre</th>
                            <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Auteur</th>
                            <th className="p-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Total</th>
                            <th className="p-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Dispo.</th>
                            <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredLivres.map((livre) => (
                            <tr key={livre.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 font-semibold text-slate-800 text-sm">{livre.titre}</td>
                              <td className="p-4 text-slate-600 text-sm">{livre.auteur}</td>
                              <td className="p-4 text-center text-slate-600 text-sm">{livre.exemplaires.length}</td>
                              <td className="p-4 text-center font-bold text-blue-600 text-sm">{livre.exemplaires.filter(e => e.statut === 'DISPONIBLE').length}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => { setAddExemplaireModal({ livreId: livre.id, titreLivre: livre.titre }); setAddExemplaireCodeBarre(''); }} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors">
                                    <FaPlus className="text-sm" />
                                  </button>
                                  <button onClick={() => handleDeleteBook(livre.id, livre.titre)} disabled={actionLoading === `book-${livre.id}`} className="p-2 bg-red-50 text-red-600 hover:bg-rose-600 hover:text-white rounded-lg transition-colors">
                                    <FaTrash className="text-sm" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ONGLET 1 : VALIDATION DES REMISES */}
                {activeTab === 'emprunts_attente' && (
                  <div>
                    {/* Table desktop */}
                    <div className="hidden sm:block overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50/75 border-b border-slate-100">
                            <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Lecteur</th>
                            <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Livre demandé</th>
                            <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Date Demande</th>
                            <th className="p-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {listAttente.map((emprunt) => (
                            <tr key={emprunt.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4">
                                <p className="font-semibold text-slate-800 text-sm">{emprunt.user?.nom ?? '-'}</p>
                                <p className="text-xs text-slate-400">{emprunt.user?.email ?? ''}</p>
                              </td>
                              <td className="p-4 text-slate-700 text-sm font-medium">{emprunt.exemplaires.map(ex => ex.exemplaire.livre.titre).join(', ')}</td>
                              <td className="p-4 text-slate-500 text-sm">{formatDate(emprunt.dateEmprunt)}</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleValiderEmprunt(emprunt.id)}
                                  disabled={actionLoading === `emprunt-valider-${emprunt.id}`}
                                  className="px-4 py-2 rounded-lg text-white font-bold bg-blue-600 hover:bg-blue-700 text-xs disabled:opacity-60 flex items-center gap-1.5 mx-auto transition-all"
                                >
                                  {actionLoading === `emprunt-valider-${emprunt.id}` ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> : null}
                                  Valider la remise
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {listAttente.length === 0 && <div className="py-12 text-center text-slate-400">Aucune remise de livre en attente.</div>}
                    </div>
                    {/* Cards mobile */}
                    <div className="sm:hidden space-y-3">
                      {listAttente.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">Aucune remise en attente.</div>
                      ) : listAttente.map((emprunt) => (
                        <div key={emprunt.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{emprunt.user?.nom ?? '-'}</p>
                              <p className="text-xs text-slate-400">{emprunt.user?.email ?? ''}</p>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold shrink-0">Attente</span>
                          </div>
                          <p className="text-sm text-slate-700 font-medium mb-1">{emprunt.exemplaires.map(ex => ex.exemplaire.livre.titre).join(', ')}</p>
                          <p className="text-xs text-slate-400 mb-3">{formatDate(emprunt.dateEmprunt)}</p>
                          <button
                            onClick={() => handleValiderEmprunt(emprunt.id)}
                            disabled={actionLoading === `emprunt-valider-${emprunt.id}`}
                            className="w-full py-2.5 rounded-xl text-white font-bold bg-blue-600 text-xs disabled:opacity-60 flex items-center justify-center gap-2"
                          >
                            {actionLoading === `emprunt-valider-${emprunt.id}` ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                            Valider — Donner le livre
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ONGLET 2 : EN COURS & RETOURS */}
                {activeTab === 'emprunts_cours' && (
                  <div>
                    {/* Table desktop */}
                    <div className="hidden sm:block overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50/75 border-b border-slate-100">
                            <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Lecteur</th>
                            <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Livre en possession</th>
                            <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Date Sortie</th>
                            <th className="p-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {listEnCours.map((emprunt) => (
                            <tr key={emprunt.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4">
                                <p className="font-semibold text-slate-800 text-sm">{emprunt.user?.nom ?? '-'}</p>
                                <p className="text-xs text-slate-400">{emprunt.user?.email ?? ''}</p>
                              </td>
                              <td className="p-4 text-slate-700 text-sm">{emprunt.exemplaires.map(ex => ex.exemplaire.livre.titre).join(', ')}</td>
                              <td className="p-4 text-slate-500 text-sm">{formatDate(emprunt.dateEmprunt)}</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleRetournerEmprunt(emprunt.id)}
                                  disabled={actionLoading === `emprunt-retourner-${emprunt.id}`}
                                  className="px-4 py-2 rounded-lg text-white font-bold bg-[#C41C3B] hover:bg-[#a81430] text-xs disabled:opacity-60 flex items-center gap-1.5 mx-auto transition-all"
                                >
                                  {actionLoading === `emprunt-retourner-${emprunt.id}` ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> : null}
                                  Valider le retour
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {listEnCours.length === 0 && <div className="py-12 text-center text-slate-400">Aucun livre n'est actuellement en circulation.</div>}
                    </div>
                    {/* Cards mobile */}
                    <div className="sm:hidden space-y-3">
                      {listEnCours.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">Aucun livre en circulation.</div>
                      ) : listEnCours.map((emprunt) => (
                        <div key={emprunt.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{emprunt.user?.nom ?? '-'}</p>
                              <p className="text-xs text-slate-400">{emprunt.user?.email ?? ''}</p>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold shrink-0">En cours</span>
                          </div>
                          <p className="text-sm text-slate-700 font-medium mb-1">{emprunt.exemplaires.map(ex => ex.exemplaire.livre.titre).join(', ')}</p>
                          <p className="text-xs text-slate-400 mb-3">{formatDate(emprunt.dateEmprunt)}</p>
                          <button
                            onClick={() => handleRetournerEmprunt(emprunt.id)}
                            disabled={actionLoading === `emprunt-retourner-${emprunt.id}`}
                            className="w-full py-2.5 rounded-xl text-white font-bold bg-[#C41C3B] text-xs disabled:opacity-60 flex items-center justify-center gap-2 hover:bg-[#a81430]"
                          >
                            {actionLoading === `emprunt-retourner-${emprunt.id}` ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                            Valider le retour
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* RESERVATIONS */}
                {activeTab === 'reservations' && (
                  <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50/75 border-b border-slate-100">
                          <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Utilisateur</th>
                          <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Livre</th>
                          <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Code barre</th>
                          <th className="p-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {reservationsActives.map((res) => (
                          <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4">
                              <p className="font-semibold text-slate-800 text-sm">{res.user?.nom ?? '-'}</p>
                            </td>
                            <td className="p-4 font-medium text-slate-800 text-sm">{res.exemplaire.livre.titre}</td>
                            <td className="p-4 text-slate-500 text-xs font-mono">{res.exemplaire.codeBarre}</td>
                            <td className="p-4 text-center">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">Active</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-serif text-slate-900">Ajouter un Livre</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><FaTimes /></button>
            </div>
            {addError && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{addError}</div>}
            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Titre *</label>
                <input required value={newBook.titre} onChange={e => setNewBook({ ...newBook, titre: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Auteur *</label>
                <input required value={newBook.auteur} onChange={e => setNewBook({ ...newBook, auteur: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Catégorie *</label>
                <select required value={newBook.categorie || ''} onChange={e => setNewBook({ ...newBook, categorie: e.target.value as Categorie })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-700">
                  <option value="" disabled>Choisir une catégorie</option>
                  {categories.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">ISBN</label>
                  <input value={newBook.isbn ?? ''} onChange={e => setNewBook({ ...newBook, isbn: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Année</label>
                  <input type="number" value={newBook.annee ?? ''} onChange={e => setNewBook({ ...newBook, annee: e.target.value ? parseInt(e.target.value) : undefined })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-800" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50">Annuler</button>
                <button type="submit" disabled={addLoading} className="flex-1 py-3 bg-[#C41C3B] text-white rounded-xl font-bold disabled:opacity-60 flex items-center justify-center gap-2">
                  {addLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaPlus />}
                  {addLoading ? 'Ajout...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Exemplaire Modal */}
      {addExemplaireModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">Ajouter un Exemplaire</h2>
                <p className="text-xs text-slate-500 mt-1 truncate max-w-xs">{addExemplaireModal.titreLivre}</p>
              </div>
              <button onClick={() => setAddExemplaireModal(null)} className="text-slate-400 hover:text-slate-700"><FaTimes /></button>
            </div>
            <form onSubmit={handleAddExemplaire} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Code Barre *</label>
                <input required value={addExemplaireCodeBarre} onChange={e => setAddExemplaireCodeBarre(e.target.value)} placeholder="ex: EX-001" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-800" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="button" onClick={() => setAddExemplaireModal(null)} className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50">Annuler</button>
                <button type="submit" disabled={addExemplaireLoading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                  {addExemplaireLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaPlus />}
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
