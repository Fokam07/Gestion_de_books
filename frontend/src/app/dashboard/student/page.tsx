'use client';

import StudentNavbar from '@/components/StudentNavbar';
import { useAuth } from '@/context/AuthContext';
import {
  livresApi, empruntsApi, reservationsApi,
  Livre, Emprunt, Reservation, Categorie,
} from '@/lib/api';
import { FaBook, FaClock, FaCheckCircle, FaSearch, FaTimes, FaInfoCircle, FaBookmark, FaFilter } from 'react-icons/fa';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { AxiosError } from 'axios';

type BookStatus = 'DISPONIBLE' | 'PENDING_VALIDATION' | 'RESERVABLE' | 'ALREADY_BORROWED' | 'ALREADY_RESERVED' | 'INDISPONIBLE';

const CATEGORY_LABELS: Record<string, string> = {
  ROMAN: 'Roman', SCIENCE_FICTION: 'Sci-Fi', FANTASY: 'Fantasy',
  POLICIER: 'Policier', BIOGRAPHIE: 'Biographie', HISTOIRE: 'Histoire',
  SCIENCE: 'Science', DEVELOPPEMENT_PERSONNEL: 'Dev. Personnel',
  JEUNESSE: 'Jeunesse', PHILOSOPHIE: 'Philo', INFORMATIQUE: 'Info',
};

const STATUS_CONFIG: Record<BookStatus, { label: string; cls: string }> = {
  DISPONIBLE:         { label: 'Disponible',  cls: 'bg-emerald-500 text-white' },
  PENDING_VALIDATION: { label: 'À valider',   cls: 'bg-amber-500 text-white' },
  ALREADY_BORROWED:   { label: 'En lecture',  cls: 'bg-blue-500 text-white' },
  ALREADY_RESERVED:   { label: 'Réservé',     cls: 'bg-purple-500 text-white' },
  RESERVABLE:         { label: 'Réservable',  cls: 'bg-orange-500 text-white' },
  INDISPONIBLE:       { label: 'Indisponible',cls: 'bg-slate-400 text-white' },
};

function getBookStatus(livre: Livre, emprunts: Emprunt[], reservations: Reservation[]): BookStatus {
  // 1. On vérifie d'abord si l'utilisateur a une demande en attente pour ce livre
  const pendingIds = emprunts
    .filter(e => e.statut === 'ATTENTE')
    .flatMap(e => e.exemplaires.map(ex => ex.exemplaire.livre.id));

  if (pendingIds.includes(livre.id)) return 'PENDING_VALIDATION';

  // 2. On vérifie si l'utilisateur possède déjà le livre en cours de lecture
  const borrowedIds = emprunts
    .filter(e => e.statut === 'EN_COURS')
    .flatMap(e => e.exemplaires.map(ex => ex.exemplaire.livre.id));
  
  const reservedIds = reservations
    .filter(r => r.statut === 'ACTIVE')
    .map(r => r.exemplaire.livre.id);

  if (borrowedIds.includes(livre.id)) return 'ALREADY_BORROWED';
  if (reservedIds.includes(livre.id)) return 'ALREADY_RESERVED';
  if (livre.exemplaires.some(e => e.statut === 'DISPONIBLE')) return 'DISPONIBLE';
  if (livre.exemplaires.some(e => e.statut === 'EMPRUNTE')) return 'RESERVABLE';
  return 'INDISPONIBLE';
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<Livre | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [livres, setLivres] = useState<Livre[]>([]);
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [l, e, r] = await Promise.all([
        livresApi.getAll(),
        empruntsApi.getMes(),
        reservationsApi.getMes(),
      ]);
      setLivres(l.data);
      setEmprunts(e.data);
      setReservations(r.data);
    } catch {
      // silent
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 5000);
  };
  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const handleBorrow = async (livreId: number) => {
    const livre = livres.find(l => l.id === livreId);
    if (!livre) return;
    const exemplaire = livre.exemplaires.find(e => e.statut === 'DISPONIBLE');
    if (!exemplaire) return;
    setActionLoading(livreId);
    try {
      await empruntsApi.creer([exemplaire.id]);
      await loadData();
      
      showSuccess(`Demande enregistrée pour "${livre.titre}". Veuillez la faire valider par l'administration.`);
      setActiveTab('borrowings'); 
      setSelectedBook(null);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      showError(e.response?.data?.message || "Erreur lors de l'emprunt.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReserve = async (livreId: number) => {
    const livre = livres.find(l => l.id === livreId);
    if (!livre) return;
    setActionLoading(livreId);
    try {
      await reservationsApi.creer(livreId);
      await loadData();
      showSuccess(`Réservation de "${livre.titre}" enregistrée.`);
      setActiveTab('reservations');
      setSelectedBook(null);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      showError(e.response?.data?.message || 'Erreur lors de la réservation.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelReservation = async (resId: number) => {
    setActionLoading(resId);
    try {
      await reservationsApi.annuler(resId);
      await loadData();
      showSuccess('Réservation annulée avec succès.');
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      showError(e.response?.data?.message || "Erreur lors de l'annulation.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleHonorReservation = async (resId: number) => {
    setActionLoading(resId);
    try {
      await reservationsApi.honorer(resId);
      await loadData();
      showSuccess('Réservation convertie ! Présentez-vous à l\'accueil pour récupérer le livre.');
      setActiveTab('borrowings');
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      showError(e.response?.data?.message || 'Erreur lors de la conversion.');
    } finally {
      setActionLoading(null);
    }
  };

  const activeReservations = reservations.filter(r => r.statut === 'ACTIVE');
  const attenteEmprunts = emprunts.filter(e => e.statut === 'ATTENTE');
  const activeEmprunts = emprunts.filter(e => e.statut === 'EN_COURS');
  const pastEmprunts = emprunts.filter(e => e.statut === 'RETOURNE');

  const allCategories = useMemo(() => {
    const cats = Array.from(new Set(livres.map(l => l.categorie).filter(Boolean))) as Categorie[];
    return cats.sort();
  }, [livres]);

  const filteredLivres = useMemo(() => {
    return livres.filter(livre => {
      const matchesSearch =
        livre.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        livre.auteur.toLowerCase().includes(searchQuery.toLowerCase());
      const status = getBookStatus(livre, emprunts, reservations);
      const matchesAvailability =
        availabilityFilter === 'All' ||
        (availabilityFilter === 'available' && status === 'DISPONIBLE') ||
        (availabilityFilter === 'unavailable' && status !== 'DISPONIBLE');
      const matchesCategory =
        categoryFilter === 'All' || livre.categorie === categoryFilter;
      return matchesSearch && matchesAvailability && matchesCategory;
    });
  }, [livres, searchQuery, availabilityFilter, categoryFilter, emprunts, reservations]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50/50">
      <StudentNavbar />
      <main className="pt-20">
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-[#C41C3B] to-[#8B1220] text-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 uppercase tracking-widest">
              Portail Lecteur
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold mt-3 mb-2 font-serif">Mon Espace Lecteur</h1>
            <p className="text-red-100 text-sm sm:text-base font-light">Bienvenue, {user?.nom ?? 'Utilisateur'}</p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4">
          {successMessage && (
            <div className="mt-4 sm:mt-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl flex items-start gap-3 justify-between shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <FaCheckCircle className="text-emerald-600 text-lg shrink-0" />
                <p className="font-semibold text-xs sm:text-sm">{successMessage}</p>
              </div>
              <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-800 cursor-pointer shrink-0"><FaTimes /></button>
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 sm:mt-6 bg-red-50 border border-red-200 text-red-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl flex items-start gap-3 justify-between shadow-sm">
              <p className="font-semibold text-xs sm:text-sm min-w-0">{errorMessage}</p>
              <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-800 cursor-pointer shrink-0 ml-2"><FaTimes /></button>
            </div>
          )}
        </div>

        <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
              <div className="p-3 sm:p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Empruntés</p>
                    <p className="text-2xl sm:text-4xl font-black mt-1 sm:mt-2 text-[#C41C3B]">{attenteEmprunts.length + activeEmprunts.length}</p>
                  </div>
                  <div className="hidden sm:flex w-12 h-12 rounded-xl bg-red-50 text-[#C41C3B] items-center justify-center text-xl"><FaBook /></div>
                </div>
              </div>
              <div className="p-3 sm:p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Réservations</p>
                    <p className="text-2xl sm:text-4xl font-black mt-1 sm:mt-2 text-orange-500">{activeReservations.length}</p>
                  </div>
                  <div className="hidden sm:flex w-12 h-12 rounded-xl bg-orange-50 text-orange-500 items-center justify-center text-xl"><FaClock /></div>
                </div>
              </div>
              <div className="p-3 sm:p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Historique</p>
                    <p className="text-2xl sm:text-4xl font-black mt-1 sm:mt-2 text-slate-700">{pastEmprunts.length}</p>
                  </div>
                  <div className="hidden sm:flex w-12 h-12 rounded-xl bg-slate-100 text-slate-500 items-center justify-center text-xl"><FaCheckCircle /></div>
                </div>
              </div>
            </div>

            <div className="mb-6 sm:mb-8 border-b border-slate-200 overflow-x-auto">
              <div className="flex gap-1 sm:gap-4 min-w-max">
                {[
                  { id: 'catalog',      label: 'Catalogue',    icon: FaSearch, activeColor: 'text-blue-600 border-blue-600',      count: 0 },
                  { id: 'borrowings',   label: 'Mes Emprunts', icon: FaBook,   activeColor: 'text-[#C41C3B] border-[#C41C3B]',   count: attenteEmprunts.length + activeEmprunts.length },
                  { id: 'reservations', label: 'Réservations', icon: FaClock,  activeColor: 'text-orange-500 border-orange-500',  count: activeReservations.length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 sm:pb-4 px-1 sm:px-0 font-bold whitespace-nowrap flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all cursor-pointer text-xs sm:text-sm ${
                      activeTab === tab.id ? tab.activeColor : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <tab.icon className="text-[11px] sm:text-xs shrink-0" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-bold ${
                        tab.id === 'reservations' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-[#C41C3B]'
                      }`}>{tab.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {!isLoadingData && (
              <>
                {/* ── CATALOGUE ── */}
                {activeTab === 'catalog' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900 font-serif">Catalogue des ouvrages</h2>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                          <input
                            type="text"
                            placeholder="Rechercher par titre, auteur…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#C41C3B] text-sm bg-white"
                          />
                        </div>
                        <div className="flex gap-2 sm:gap-3">
                          <div className="relative">
                            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                            <select
                              value={availabilityFilter}
                              onChange={(e) => setAvailabilityFilter(e.target.value)}
                              className="pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-sm bg-white cursor-pointer focus:outline-none focus:border-[#C41C3B]"
                            >
                              <option value="All">Tous</option>
                              <option value="available">Disponibles</option>
                              <option value="unavailable">Indisponibles</option>
                            </select>
                          </div>
                          {allCategories.length > 0 && (
                            <select
                              value={categoryFilter}
                              onChange={(e) => setCategoryFilter(e.target.value)}
                              className="px-3 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-sm bg-white cursor-pointer focus:outline-none focus:border-[#C41C3B] max-w-[140px]"
                            >
                              <option value="All">Catégories</option>
                              {allCategories.map(c => (
                                <option key={c} value={c}>{CATEGORY_LABELS[c] ?? c}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-3">
                        {filteredLivres.length} ouvrage{filteredLivres.length !== 1 ? 's' : ''} trouvé{filteredLivres.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {filteredLivres.length === 0 ? (
                      <div className="border border-dashed border-slate-200 rounded-2xl py-16 text-center bg-white">
                        <FaBook className="text-4xl text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-medium">Aucun ouvrage ne correspond à vos filtres.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {filteredLivres.map((livre) => {
                          const status = getBookStatus(livre, emprunts, reservations);
                          const isLoading = actionLoading === livre.id;
                          const sc = STATUS_CONFIG[status];
                          return (
                            <div key={livre.id} className="bg-white rounded-xl border border-slate-100 hover:shadow-lg transition-all overflow-hidden flex flex-col group">
                              {/* Cover */}
                              <div className="relative w-full aspect-[2/3] bg-slate-100 overflow-hidden">
                                {livre.imageUrl ? (
                                  <img
                                    src={livre.imageUrl}
                                    alt={livre.titre}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-2 text-center">
                                    <FaBook className="text-2xl sm:text-3xl mb-1 sm:mb-2 text-slate-300" />
                                    <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 line-clamp-3 leading-tight">{livre.titre}</span>
                                  </div>
                                )}
                                <span className={`absolute top-1.5 left-1.5 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full ${sc.cls}`}>
                                  {sc.label}
                                </span>
                                {livre.categorie && (
                                  <span className="absolute bottom-1.5 right-1.5 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-sm">
                                    {CATEGORY_LABELS[livre.categorie] ?? livre.categorie}
                                  </span>
                                )}
                              </div>
                              {/* Info */}
                              <div className="p-2 sm:p-3 flex flex-col flex-1">
                                <h3 className="font-bold text-[11px] sm:text-xs text-slate-900 line-clamp-2 leading-tight mb-0.5">{livre.titre}</h3>
                                <p className="text-slate-400 text-[10px] sm:text-[11px] line-clamp-1 mb-2 flex-1">{livre.auteur}</p>
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() => setSelectedBook(livre)}
                                    className="w-full py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold text-[10px] sm:text-[11px] flex items-center justify-center gap-1 hover:bg-slate-200 transition-colors"
                                  >
                                    <FaInfoCircle className="text-[9px]" /> Détails
                                  </button>
                                  {status === 'DISPONIBLE' && (
                                    <button
                                      disabled={isLoading}
                                      onClick={() => handleBorrow(livre.id)}
                                      className="w-full py-1.5 rounded-lg font-bold text-[10px] sm:text-[11px] bg-[#C41C3B] text-white flex items-center justify-center gap-1 hover:bg-[#a81430] transition-colors disabled:opacity-60"
                                    >
                                      {isLoading ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaBook className="text-[9px]" />}
                                      Emprunter
                                    </button>
                                  )}
                                  {status === 'RESERVABLE' && (
                                    <button
                                      disabled={isLoading}
                                      onClick={() => handleReserve(livre.id)}
                                      className="w-full py-1.5 rounded-lg font-bold text-[10px] sm:text-[11px] bg-orange-500 text-white flex items-center justify-center gap-1 hover:bg-orange-600 transition-colors disabled:opacity-60"
                                    >
                                      {isLoading ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaBookmark className="text-[9px]" />}
                                      Réserver
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* MES EMPRUNTS */}
                {activeTab === 'borrowings' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900 font-serif">Suivi de mes Emprunts</h2>

                    {/* Section 1 : En attente de validation */}
                    {attenteEmprunts.length > 0 && (
                      <div className="bg-amber-50/40 p-6 rounded-2xl border border-amber-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-2">
                          <FaClock /> Demandes en attente à l'accueil ({attenteEmprunts.length})
                        </h3>
                        <div className="space-y-3">
                          {attenteEmprunts.map(emprunt => (
                            <div key={emprunt.id} className="p-4 bg-white rounded-xl border border-amber-100 shadow-xs flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                              <div>
                                <h4 className="font-bold text-slate-900">{emprunt.exemplaires[0]?.exemplaire.livre.titre}</h4>
                                <p className="text-xs text-slate-500">Demande effectuée le {formatDate(emprunt.dateEmprunt)}</p>
                                <p className="text-xs font-semibold text-amber-600 mt-2">👉 Présentez-vous devant l'administration pour récupérer l'ouvrage physique.</p>
                              </div>
                              <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold">À valider</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 2 : Emprunts Actifs */}
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Livres en ma possession ({activeEmprunts.length})</h3>
                      {activeEmprunts.length === 0 ? (
                        <p className="text-slate-400 text-sm bg-white p-4 rounded-xl border border-slate-100">Vous n'avez aucun livre en cours de lecture.</p>
                      ) : (
                        <div className="space-y-3">
                          {activeEmprunts.map(emprunt => (
                            <div key={emprunt.id} className="p-4 bg-white rounded-xl border border-slate-100 shadow-xs flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                              <div>
                                <h4 className="font-bold text-slate-900">{emprunt.exemplaires[0]?.exemplaire.livre.titre}</h4>
                                <p className="text-xs text-slate-500">Emprunté le {formatDate(emprunt.dateEmprunt)}</p>
                              </div>
                              <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">En cours de lecture</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Section 3 : Historique */}
                    {pastEmprunts.length > 0 && (
                      <div className="opacity-75">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Livres retournés ({pastEmprunts.length})</h3>
                        <div className="space-y-2">
                          {pastEmprunts.map(emprunt => (
                            <div key={emprunt.id} className="p-3 bg-slate-100 rounded-xl text-xs flex flex-col sm:flex-row gap-1 sm:justify-between">
                              <span className="font-medium text-slate-700">{emprunt.exemplaires[0]?.exemplaire.livre.titre}</span>
                              <span className="text-slate-400">Rendu</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* RESERVATIONS */}
                {activeTab === 'reservations' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900 font-serif">Mes Réservations</h2>
                    {activeReservations.length === 0 ? (
                      <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center bg-white">
                        <p className="text-slate-500">Aucune réservation en cours.</p>
                      </div>
                    ) : (
                      activeReservations.map(res => (
                        <div key={res.id} className="p-4 bg-white rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                          <div>
                            <h3 className="font-bold text-slate-900">{res.exemplaire.livre.titre}</h3>
                            <p className="text-xs text-slate-400">Réservé le {formatDate(res.createdAt)}</p>
                          </div>
                          <button onClick={() => handleCancelReservation(res.id)} className="w-full sm:w-auto px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">Annuler</button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* ── Modal Détails ── */}
      {selectedBook && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
            >
              <FaTimes />
            </button>
            <div className="flex gap-4 sm:gap-6">
              <div className="w-24 sm:w-32 h-36 sm:h-48 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                {selectedBook.imageUrl ? (
                  <img src={selectedBook.imageUrl} alt={selectedBook.titre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><FaBook className="text-3xl text-slate-300" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {selectedBook.categorie && (
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C41C3B]">
                    {CATEGORY_LABELS[selectedBook.categorie] ?? selectedBook.categorie}
                  </span>
                )}
                <h2 className="text-base sm:text-xl font-bold text-slate-900 mt-1 font-serif leading-tight">{selectedBook.titre}</h2>
                <p className="text-slate-500 text-sm">par {selectedBook.auteur}</p>
                {selectedBook.annee && <p className="text-xs text-slate-400 mt-1">{selectedBook.annee}</p>}
                {selectedBook.editeur && <p className="text-xs text-slate-400">{selectedBook.editeur}</p>}
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              {getBookStatus(selectedBook, emprunts, reservations) === 'DISPONIBLE' && (
                <button
                  onClick={() => handleBorrow(selectedBook.id)}
                  disabled={actionLoading === selectedBook.id}
                  className="w-full py-3 bg-[#C41C3B] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#a81430] transition-colors disabled:opacity-60"
                >
                  {actionLoading === selectedBook.id ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaBook />}
                  Confirmer la demande d'emprunt
                </button>
              )}
              {getBookStatus(selectedBook, emprunts, reservations) === 'RESERVABLE' && (
                <button
                  onClick={() => handleReserve(selectedBook.id)}
                  disabled={actionLoading === selectedBook.id}
                  className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors disabled:opacity-60"
                >
                  {actionLoading === selectedBook.id ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaBookmark />}
                  Réserver ce livre
                </button>
              )}
              <button onClick={() => setSelectedBook(null)} className="w-full py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

