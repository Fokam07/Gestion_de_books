'use client';

import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { empruntsApi, reservationsApi, Emprunt, Reservation } from '@/lib/api';
import { FaUser, FaEnvelope, FaBook, FaCheckCircle, FaClock, FaSignOutAlt } from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) { setIsLoading(false); return; }
    try {
      const [e, r] = await Promise.all([
        empruntsApi.getMes(),
        reservationsApi.getMes(),
      ]);
      setEmprunts(e.data);
      setReservations(r.data);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const activeEmprunts = emprunts.filter(e => e.statut === 'EN_COURS');
  const activeReservations = reservations.filter(r => r.statut === 'ACTIVE');
  const pastEmprunts = emprunts.filter(e => e.statut === 'RETOURNE');

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#C41C3B] flex items-center justify-center text-3xl text-white">
                    <FaUser />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{user?.nom ?? '—'}</h2>
                  <p className="text-[#C41C3B] font-semibold text-sm">
                    {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </p>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-0.5">
                      <FaEnvelope className="inline mr-1.5" />Email
                    </span>
                    <p className="text-slate-700 break-all">{user?.email ?? '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-0.5">Membre depuis</span>
                    <p className="text-slate-700">{user?.createdAt ? formatDate(user.createdAt) : '—'}</p>
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  className="mt-6 w-full py-2.5 rounded-xl border-2 border-[#C41C3B] text-[#C41C3B] font-bold text-sm hover:bg-[#C41C3B] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt /> Se deconnecter
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-xl border border-slate-100 text-center shadow-sm">
                  <p className="text-2xl font-black text-[#C41C3B]">{activeEmprunts.length}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Emprunts actifs</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-100 text-center shadow-sm">
                  <p className="text-2xl font-black text-orange-500">{activeReservations.length}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Reservations</p>
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="md:col-span-2 space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <span className="w-8 h-8 border-4 border-[#C41C3B] border-t-transparent rounded-full animate-spin inline-block" />
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 font-serif flex items-center gap-2">
                      <FaBook className="text-[#C41C3B]" /> Emprunts en cours
                    </h3>
                    {activeEmprunts.length === 0 ? (
                      <p className="text-slate-400 text-sm">Aucun emprunt actif.</p>
                    ) : (
                      <div className="space-y-3">
                        {activeEmprunts.map(emprunt => (
                          <div key={emprunt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                              {emprunt.exemplaires.map(ex => (
                                <div key={ex.exemplaireId}>
                                  <p className="font-semibold text-slate-800 text-sm">{ex.exemplaire.livre.titre}</p>
                                  <p className="text-xs text-slate-500">{ex.exemplaire.livre.auteur}</p>
                                </div>
                              ))}
                              <p className="text-xs text-slate-400 mt-1">Emprunte le {formatDate(emprunt.dateEmprunt)}</p>
                            </div>
                            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 shrink-0">En cours</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 font-serif flex items-center gap-2">
                      <FaClock className="text-orange-500" /> Reservations actives
                    </h3>
                    {activeReservations.length === 0 ? (
                      <p className="text-slate-400 text-sm">Aucune reservation active.</p>
                    ) : (
                      <div className="space-y-3">
                        {activeReservations.map(res => (
                          <div key={res.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{res.exemplaire.livre.titre}</p>
                              <p className="text-xs text-slate-500">{res.exemplaire.livre.auteur}</p>
                              <p className="text-xs text-slate-400 mt-1">Reserve le {formatDate(res.createdAt)}</p>
                            </div>
                            <span className="text-xs font-bold px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-200 shrink-0">Active</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {pastEmprunts.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 font-serif flex items-center gap-2">
                        <FaCheckCircle className="text-slate-400" /> Historique
                      </h3>
                      <div className="space-y-2">
                        {pastEmprunts.map(emprunt => (
                          <div key={emprunt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                              {emprunt.exemplaires.map(ex => (
                                <p key={ex.exemplaireId} className="text-sm text-slate-700 font-medium">{ex.exemplaire.livre.titre}</p>
                              ))}
                              <p className="text-xs text-slate-400">
                                {formatDate(emprunt.dateEmprunt)}{emprunt.dateRetour ? ` → ${formatDate(emprunt.dateRetour)}` : ''}
                              </p>
                            </div>
                            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full shrink-0">Retourne</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 px-4 border-t border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto text-center text-slate-400 text-sm">
          <p>2026 Shelfio — Tous droits reserves</p>
        </div>
      </footer>
    </div>
  );
}
