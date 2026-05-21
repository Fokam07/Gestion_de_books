'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import {
  getLivres,
  deleteLivre,
  createExemplaire,
  getAllEmprunts,
  validerEmprunt,
  validerRetourAdmin,
  CATEGORIES,
  Livre,
  Emprunt,
} from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';

const FALLBACK = 'https://placehold.co/60x90/1e1b4b/ffffff?text=📚';

type Tab = 'catalogue' | 'emprunts' | 'retours';

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function AdminPage() {
  const { user, token, isAdmin, loading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('catalogue');
  const [livres, setLivres] = useState<Livre[]>([]);
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newExemplaire, setNewExemplaire] = useState<{ livreId: number; codeBarre: string } | null>(null);

  // Filtres catalogue
  const [searchLivre, setSearchLivre] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('');

  // Filtres emprunts/retours
  const [searchUser, setSearchUser] = useState('');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/');
  }, [user, isAdmin, loading, router]);

  const refresh = () => {
    if (!token) return;
    getLivres().then(setLivres).catch(() => {});
    getAllEmprunts(token).then(setEmprunts).catch(() => {});
  };

  useEffect(() => {
    if (token) refresh();
  }, [token]);

  // ── Catalogue filters ─────────────────────────────────────────────────────
  const filteredLivres = useMemo(() => {
    const q = searchLivre.toLowerCase().trim();
    return livres.filter((l) => {
      const matchQ = !q || l.titre.toLowerCase().includes(q) || l.auteur.toLowerCase().includes(q);
      const matchC = !filterCategorie || l.categorie === filterCategorie;
      return matchQ && matchC;
    });
  }, [livres, searchLivre, filterCategorie]);

  // ── Emprunt filters ────────────────────────────────────────────────────────
  const empruntsFiltres = useMemo(() => {
    const q = searchUser.toLowerCase().trim();
    return emprunts.filter((e) => {
      const nom = e.user?.nom?.toLowerCase() ?? '';
      const email = e.user?.email?.toLowerCase() ?? '';
      return !q || nom.includes(q) || email.includes(q);
    });
  }, [emprunts, searchUser]);

  const empruntAttente = empruntsFiltres.filter((e) => e.statut === 'ATTENTE');
  const empruntEnCours = empruntsFiltres.filter((e) => e.statut === 'EN_COURS');

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number, titre: string) => {
    if (!token || !confirm(`Supprimer "${titre}" ?`)) return;
    setBusy(`del-${id}`);
    try {
      await deleteLivre(id, token);
      setMsg({ type: 'success', text: `"${titre}" supprimé.` });
      refresh();
    } catch {
      setMsg({ type: 'error', text: 'Impossible de supprimer (exemplaires actifs ?).' });
    } finally {
      setBusy(null);
    }
  };

  const handleAddExemplaire = async () => {
    if (!token || !newExemplaire?.codeBarre) return;
    setBusy('exemplaire');
    try {
      await createExemplaire(newExemplaire.livreId, newExemplaire.codeBarre, token);
      setMsg({ type: 'success', text: `Exemplaire ${newExemplaire.codeBarre} ajouté.` });
      setNewExemplaire(null);
      refresh();
    } catch {
      setMsg({ type: 'error', text: 'Code barre déjà utilisé ou erreur serveur.' });
    } finally {
      setBusy(null);
    }
  };

  const handleValiderEmprunt = async (id: number) => {
    if (!token) return;
    setBusy(`valider-${id}`);
    try {
      await validerEmprunt(id, token);
      setMsg({ type: 'success', text: `Emprunt #${id} validé — en cours.` });
      refresh();
    } catch {
      setMsg({ type: 'error', text: "Impossible de valider cet emprunt." });
    } finally {
      setBusy(null);
    }
  };

  const handleValiderRetour = async (id: number) => {
    if (!token) return;
    setBusy(`retour-${id}`);
    try {
      await validerRetourAdmin(id, token);
      setMsg({ type: 'success', text: `Retour de l'emprunt #${id} enregistré.` });
      refresh();
    } catch {
      setMsg({ type: 'error', text: "Impossible d'enregistrer ce retour." });
    } finally {
      setBusy(null);
    }
  };

  if (loading || !user || !isAdmin) return null;

  // Stats
  const totalExemplaires = livres.reduce((s, l) => s + (l.exemplaires?.length ?? 0), 0);
  const empruntés = livres.reduce((s, l) => s + (l.exemplaires?.filter((e) => e.statut === 'EMPRUNTE').length ?? 0), 0);
  const disponibles = livres.reduce((s, l) => s + (l.exemplaires?.filter((e) => e.statut === 'DISPONIBLE').length ?? 0), 0);
  const enAttente = emprunts.filter((e) => e.statut === 'ATTENTE').length;

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: 'catalogue', label: 'Catalogue' },
    { key: 'emprunts', label: 'Emprunts en attente', badge: enAttente },
    { key: 'retours', label: 'Retours à valider', badge: empruntEnCours.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord admin</h1>
          <p className="text-gray-500 mt-1">Gérez le catalogue, les emprunts et les retours.</p>
        </div>
        <Link
          href="/admin/livres/nouveau"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          + Ajouter un livre
        </Link>
      </div>

      {msg && (
        <div
          className={`mb-6 rounded-xl px-4 py-3 text-sm border flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}
        >
          {msg.text}
          <button onClick={() => setMsg(null)} className="opacity-60 hover:opacity-100 ml-3">✕</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Livres', value: livres.length, bg: 'bg-indigo-50', text: 'text-indigo-700' },
          { label: 'Exemplaires', value: totalExemplaires, bg: 'bg-slate-50', text: 'text-slate-700' },
          { label: 'Disponibles', value: disponibles, bg: 'bg-emerald-50', text: 'text-emerald-700' },
          { label: 'En circulation', value: empruntés, bg: 'bg-amber-50', text: 'text-amber-700' },
        ].map(({ label, value, bg, text }) => (
          <div key={label} className={`${bg} rounded-2xl p-5`}>
            <p className={`text-3xl font-bold ${text}`}>{value}</p>
            <p className={`text-sm mt-1 ${text} opacity-80`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8">
        {tabs.map(({ key, label, badge }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
            {badge !== undefined && badge > 0 && (
              <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5 leading-none">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB : CATALOGUE ── */}
      {tab === 'catalogue' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Rechercher par titre ou auteur…"
                value={searchLivre}
                onChange={(e) => setSearchLivre(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterCategorie}
              onChange={(e) => setFilterCategorie(e.target.value)}
              className="sm:w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Toutes les catégories</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="divide-y divide-gray-50">
            {filteredLivres.map((livre) => {
              const dispo = livre.exemplaires?.filter((e) => e.statut === 'DISPONIBLE').length ?? 0;
              const total = livre.exemplaires?.length ?? 0;
              return (
                <div key={livre.id} className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-12 h-[72px] shrink-0 rounded-lg overflow-hidden bg-slate-100">
                      <Image
                        src={livre.imageUrl || FALLBACK}
                        alt={livre.titre}
                        fill
                        className="object-cover"
                        unoptimized={!!livre.imageUrl}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm truncate">{livre.titre}</p>
                          <p className="text-xs text-gray-500">{livre.auteur}{livre.annee && ` — ${livre.annee}`}</p>
                          {livre.collection && (
                            <span className="inline-block mt-1 text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full px-2 py-0.5">
                              {livre.collection}
                            </span>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {total} exemplaire(s) · {dispo} disponible(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setNewExemplaire({ livreId: livre.id, codeBarre: '' })}
                            className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors"
                          >
                            + Exemplaire
                          </button>
                          <button
                            onClick={() => handleDelete(livre.id, livre.titre)}
                            disabled={busy === `del-${livre.id}`}
                            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1.5 rounded-lg border border-red-100 transition-colors disabled:opacity-50"
                          >
                            {busy === `del-${livre.id}` ? '…' : 'Supprimer'}
                          </button>
                        </div>
                      </div>

                      {(livre.exemplaires?.length ?? 0) > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {livre.exemplaires!.map((ex) => (
                            <div key={ex.id} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1">
                              <span className="text-xs font-mono text-gray-500">{ex.codeBarre}</span>
                              <StatusBadge statut={ex.statut} />
                            </div>
                          ))}
                        </div>
                      )}

                      {newExemplaire?.livreId === livre.id && (
                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            placeholder="Code barre (ex: LP-004)"
                            value={newExemplaire.codeBarre}
                            onChange={(e) => setNewExemplaire({ ...newExemplaire, codeBarre: e.target.value })}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            onClick={handleAddExemplaire}
                            disabled={!newExemplaire.codeBarre || busy === 'exemplaire'}
                            className="text-xs bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Ajouter
                          </button>
                          <button
                            onClick={() => setNewExemplaire(null)}
                            className="text-xs text-gray-400 hover:text-gray-600 px-2"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB : EMPRUNTS EN ATTENTE ── */}
      {tab === 'emprunts' && (
        <div>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Filtrer par nom ou email…"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          {empruntAttente.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400">
              <p className="text-4xl mb-3">✅</p>
              <p>Aucun emprunt en attente de validation.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {empruntAttente.map((e) => (
                <EmpruntAdminCard
                  key={e.id}
                  emprunt={e}
                  action={{
                    label: "Valider la remise",
                    busyKey: `valider-${e.id}`,
                    busy,
                    onClick: () => handleValiderEmprunt(e.id),
                    color: 'bg-indigo-600 hover:bg-indigo-500 text-white',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB : RETOURS À VALIDER ── */}
      {tab === 'retours' && (
        <div>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Filtrer par nom ou email…"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          {empruntEnCours.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400">
              <p className="text-4xl mb-3">📚</p>
              <p>Aucun retour en attente.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {empruntEnCours.map((e) => (
                <EmpruntAdminCard
                  key={e.id}
                  emprunt={e}
                  action={{
                    label: "Valider le retour",
                    busyKey: `retour-${e.id}`,
                    busy,
                    onClick: () => handleValiderRetour(e.id),
                    color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmpruntAdminCard({
  emprunt,
  action,
}: {
  emprunt: Emprunt;
  action: {
    label: string;
    busyKey: string;
    busy: string | null;
    onClick: () => void;
    color: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const livres = emprunt.exemplaires.map((ee) => ee.exemplaire?.livre).filter(Boolean);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-4 flex-1 text-left">
          {/* Miniatures */}
          <div className="flex -space-x-2">
            {livres.slice(0, 3).map((livre, i) => (
              <div
                key={i}
                className="relative w-9 h-[54px] rounded shadow-sm overflow-hidden border-2 border-white bg-slate-200"
              >
                <Image
                  src={livre?.imageUrl || 'https://placehold.co/60x90/1e1b4b/ffffff?text=📚'}
                  alt={livre?.titre || ''}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Emprunt #{emprunt.id}
              {emprunt.user && (
                <span className="ml-2 font-normal text-gray-500">— {emprunt.user.nom}</span>
              )}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {emprunt.user?.email} · depuis le {fmt(emprunt.dateEmprunt)} · {emprunt.exemplaires.length} livre(s)
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge statut={emprunt.statut} />
          <button
            onClick={action.onClick}
            disabled={action.busy === action.busyKey}
            className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-50 ${action.color}`}
          >
            {action.busy === action.busyKey ? '…' : action.label}
          </button>
          <button onClick={() => setOpen((o) => !o)} className="text-gray-400 text-sm">
            {open ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-50 px-5 py-4 bg-gray-50 space-y-3">
          {emprunt.exemplaires.map((ee) => {
            const livre = ee.exemplaire?.livre;
            return (
              <div key={ee.exemplaireId} className="flex items-center gap-4">
                <div className="relative w-10 h-[60px] shrink-0 rounded-lg overflow-hidden bg-slate-100">
                  <Image
                    src={livre?.imageUrl || 'https://placehold.co/60x90/1e1b4b/ffffff?text=📚'}
                    alt={livre?.titre || ''}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{livre?.titre ?? `Exemplaire #${ee.exemplaireId}`}</p>
                  {livre?.auteur && <p className="text-xs text-gray-400">{livre.auteur}</p>}
                  <p className="text-xs text-gray-400">Code : {ee.exemplaire?.codeBarre ?? '—'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
