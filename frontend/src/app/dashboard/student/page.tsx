'use client';

import StudentNavbar from '@/components/StudentNavbar';
import { useAuth } from '@/context/AuthContext';
import {
  livresApi, empruntsApi, reservationsApi,
  Livre, Emprunt, Reservation,
} from '@/lib/api';
import { FaBook, FaClock, FaCheckCircle, FaSearch, FaTimes, FaInbox, FaArrowRight, FaInfoCircle, FaCalendarAlt, FaBarcode, FaBuilding, FaBookmark } from 'react-icons/fa';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { AxiosError } from 'axios';

type BookStatus = 'DISPONIBLE' | 'PENDING_VALIDATION' | 'RESERVABLE' | 'ALREADY_BORROWED' | 'ALREADY_RESERVED' | 'INDISPONIBLE';

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
      return matchesSearch && matchesAvailability;
    });
  }, [livres, searchQuery, availabilityFilter, emprunts, reservations]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50/50">
      <StudentNavbar />
      <main className="pt-20">
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-[#C41C3B] to-[#8B1220] text-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 uppercase tracking-widest">
              Portail Lecteur
            </span>
            <h1 className="text-4xl font-extrabold mt-3 mb-2 font-serif">Mon Espace Lecteur</h1>
            <p className="text-red-100 font-light">Bienvenue, {user?.nom ?? 'Utilisateur'}</p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4">
          {successMessage && (
            <div className="mt-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-emerald-600 text-xl shrink-0" />
                <p className="font-semibold text-sm">{successMessage}</p>
              </div>
              <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-800 cursor-pointer ml-4"><FaTimes /></button>
            </div>
          )}
          {errorMessage && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center justify-between shadow-sm">
              <p className="font-semibold text-sm">{errorMessage}</p>
              <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-800 cursor-pointer ml-4"><FaTimes /></button>
            </div>
          )}
        </div>

        <section className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Livres Empruntés</p>
                    <p className="text-4xl font-black mt-2 text-[#C41C3B]">{attenteEmprunts.length + activeEmprunts.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-[#C41C3B] flex items-center justify-center text-xl"><FaBook /></div>
                </div>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Réservations Actives</p>
                    <p className="text-4xl font-black mt-2 text-orange-500">{activeReservations.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-xl"><FaClock /></div>
                </div>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Emprunts Passés</p>
                    <p className="text-4xl font-black mt-2 text-slate-700">{pastEmprunts.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-xl"><FaCheckCircle /></div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-8 border-b border-slate-200 flex-wrap">
              {[
                { id: 'catalog', label: 'Catalogue', icon: FaSearch, activeColor: 'text-blue-600 border-blue-600', count: 0 },
                { id: 'borrowings', label: 'Mes Emprunts', icon: FaBook, activeColor: 'text-[#C41C3B] border-[#C41C3B]', count: attenteEmprunts.length + activeEmprunts.length },
                { id: 'reservations', label: 'Mes Réservations', icon: FaClock, activeColor: 'text-orange-500 border-orange-500', count: activeReservations.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id ? tab.activeColor : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <tab.icon className="text-xs" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      tab.id === 'reservations' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-[#C41C3B]'
                    }`}>{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            {!isLoadingData && (
              <>
                {/* CATALOGUE */}
                {activeTab === 'catalog' && (
                  <div>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4 text-slate-900 font-serif">Catalogue des ouvrages</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="relative">
                          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Rechercher par titre, auteur..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#C41C3B] text-sm bg-white"
                          />
                        </div>
                        <select
                          value={availabilityFilter}
                          onChange={(e) => setAvailabilityFilter(e.target.value)}
                          className="px-4 py-3 border border-slate-200 rounded-lg text-slate-700 text-sm bg-white cursor-pointer focus:outline-none focus:border-[#C41C3B]"
                        >
                          <option value="All">Tous les livres</option>
                          <option value="available">Disponibles</option>
                          <option value="unavailable">Indisponibles</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredLivres.map((livre) => {
                        const status = getBookStatus(livre, emprunts, reservations);
                        const isLoading = actionLoading === livre.id;
                        return (
                          <div key={livre.id} className="p-5 bg-white rounded-xl border border-slate-100 hover:shadow-lg transition-all flex gap-5">
                            <div className="w-24 h-36 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200/60 relative shadow-sm">
                              {livre.imageUrl ? (
                                <img src={livre.imageUrl} alt={livre.titre} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                                  <FaBook className="text-2xl mb-1 text-slate-300" />
                                  <span className="text-[10px] font-semibold">Pas d'image</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start gap-2 mb-1">
                                  <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-tight">{livre.titre}</h3>
                                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                    status === 'DISPONIBLE' ? 'bg-emerald-50 text-emerald-700' :
                                    status === 'PENDING_VALIDATION' ? 'bg-amber-50 text-amber-700' : 
                                    status === 'ALREADY_BORROWED' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                                  }`}>
                                    {status === 'DISPONIBLE' ? 'Disponible' : 
                                     status === 'PENDING_VALIDATION' ? 'À valider à l\'accueil' : 
                                     status === 'ALREADY_BORROWED' ? 'En votre possession' : 'Indisponible'}
                                  </span>
                                </div>
                                <p className="text-slate-500 text-sm font-medium">{livre.auteur}</p>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <button onClick={() => setSelectedBook(livre)} className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs flex items-center gap-1.5"><FaInfoCircle /> Détails</button>
                                {status === 'DISPONIBLE' && (
                                  <button disabled={isLoading} onClick={() => handleBorrow(livre.id)} className="flex-1 py-2 rounded-lg font-bold text-xs bg-[#C41C3B] text-white flex items-center justify-center gap-1.5">
                                    {isLoading ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> : <FaBook />} Demande d'emprunt
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
                            <div key={emprunt.id} className="p-4 bg-white rounded-xl border border-amber-100 shadow-xs flex justify-between items-center">
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
                            <div key={emprunt.id} className="p-4 bg-white rounded-xl border border-slate-100 shadow-xs flex justify-between items-center">
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
                            <div key={emprunt.id} className="p-3 bg-slate-100 rounded-xl text-xs flex justify-between">
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
                        <div key={res.id} className="p-4 bg-white rounded-xl border border-slate-100 flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-slate-900">{res.exemplaire.livre.titre}</h3>
                            <p className="text-xs text-slate-400">Réservé le {formatDate(res.createdAt)}</p>
                          </div>
                          <button onClick={() => handleCancelReservation(res.id)} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">Annuler</button>
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

      {/* Détails Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 relative flex gap-6">
            <button onClick={() => setSelectedBook(null)} className="absolute top-4 right-4 p-2 bg-slate-50 rounded-full"><FaTimes /></button>
            <div className="w-32 h-48 bg-slate-100 rounded-xl overflow-hidden shrink-0 border">
              {selectedBook.imageUrl && <img src={selectedBook.imageUrl} alt={selectedBook.titre} className="w-full h-full object-cover" />}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C41C3B]">{selectedBook.categorie || 'Général'}</span>
              <h2 className="text-xl font-bold text-slate-900 mt-1 font-serif">{selectedBook.titre}</h2>
              <p className="text-slate-500 text-sm mb-4">par {selectedBook.auteur}</p>
              {getBookStatus(selectedBook, emprunts, reservations) === 'DISPONIBLE' && (
                <button onClick={() => handleBorrow(selectedBook.id)} className="w-full py-2.5 bg-[#C41C3B] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2">
                  <FaBook /> Confirmer la demande d'emprunt
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

