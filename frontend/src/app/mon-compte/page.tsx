'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import {
  getMesEmprunts,
  getMesReservations,
  annulerReservation,
  Emprunt,
  Reservation,
} from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';

const FALLBACK = 'https://placehold.co/60x90/1e1b4b/ffffff?text=📚';

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function EmpruntCard({ emprunt }: { emprunt: Emprunt }) {
  const [open, setOpen] = useState(false);
  const livres = emprunt.exemplaires.map((ee) => ee.exemplaire?.livre).filter(Boolean);

  const statusInfo = {
    ATTENTE: {
      border: 'border-amber-200',
      bg: 'bg-amber-50',
      msg: "En attente de validation par l'agent de bibliothèque. Présentez-vous au comptoir pour récupérer votre (vos) livre(s).",
    },
    EN_COURS: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      msg: "Emprunt en cours. Le retour sera validé par un agent lors de la restitution physique.",
    },
    RETOURNE: { border: 'border-emerald-200', bg: 'bg-emerald-50', msg: null },
    EN_RETARD: { border: 'border-red-200', bg: 'bg-red-50', msg: "Retour en retard ! Veuillez rapporter ce(s) livre(s) dès que possible." },
  }[emprunt.statut] ?? { border: 'border-gray-200', bg: 'bg-white', msg: null };

  return (
    <div className={`border ${statusInfo.border} rounded-2xl overflow-hidden`}>
      {/* Header de la carte */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full ${statusInfo.bg} px-5 py-4 flex items-center justify-between gap-4 text-left hover:brightness-95 transition-all`}
      >
        <div className="flex items-center gap-4">
          {/* Miniatures des livres */}
          <div className="flex -space-x-2">
            {livres.slice(0, 3).map((livre, i) => (
              <div
                key={i}
                className="relative w-9 h-[54px] rounded shadow-sm overflow-hidden border-2 border-white bg-slate-200"
              >
                <Image
                  src={livre?.imageUrl || FALLBACK}
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
              Emprunt #{emprunt.id} · {emprunt.exemplaires.length} exemplaire(s)
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Depuis le {fmt(emprunt.dateEmprunt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge statut={emprunt.statut} />
          <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Détails dépliables */}
      {open && (
        <div className="bg-white px-5 py-4 space-y-4">
          {statusInfo.msg && (
            <p className="text-xs text-gray-500 italic border-l-4 border-indigo-300 pl-3">
              {statusInfo.msg}
            </p>
          )}

          <div className="space-y-3">
            {emprunt.exemplaires.map((ee) => {
              const livre = ee.exemplaire?.livre;
              return (
                <div key={ee.exemplaireId} className="flex items-center gap-4">
                  <div className="relative w-12 h-[72px] shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-gray-100">
                    <Image
                      src={livre?.imageUrl || FALLBACK}
                      alt={livre?.titre || ''}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    {livre ? (
                      <>
                        <Link
                          href={`/livres/${livre.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                        >
                          {livre.titre}
                        </Link>
                        <p className="text-xs text-gray-400">{livre.auteur}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-400">Exemplaire #{ee.exemplaireId}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      Code : {ee.exemplaire?.codeBarre ?? '—'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {emprunt.dateRetour && (
            <p className="text-xs text-gray-400">Retourné le {fmt(emprunt.dateRetour)}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function MonComptePage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!token) return;
    getMesEmprunts(token).then(setEmprunts).catch(() => {});
    getMesReservations(token).then(setReservations).catch(() => {});
  }, [token]);

  const refresh = () => {
    if (!token) return;
    getMesEmprunts(token).then(setEmprunts).catch(() => {});
    getMesReservations(token).then(setReservations).catch(() => {});
  };

  const handleAnnuler = async (id: number) => {
    if (!token) return;
    setBusy(`annuler-${id}`);
    try {
      await annulerReservation(id, token);
      setMsg('Réservation annulée.');
      refresh();
    } catch {
      setMsg("Impossible d'annuler cette réservation.");
    } finally {
      setBusy(null);
    }
  };

  if (loading || !user) return null;

  const empruntsCours = emprunts.filter((e) => e.statut === 'ATTENTE' || e.statut === 'EN_COURS');
  const empruntsPasses = emprunts.filter((e) => e.statut === 'RETOURNE' || e.statut === 'EN_RETARD');
  const reservationsActives = reservations.filter((r) => r.statut === 'ACTIVE');
  const reservationsPasses = reservations.filter((r) => r.statut !== 'ACTIVE');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Mon compte</h1>
        <p className="text-gray-500 mt-1">
          Bonjour, <strong>{user.nom}</strong> — gérez vos emprunts et réservations.
        </p>
      </div>

      {msg && (
        <div
          className={`mb-6 rounded-xl px-4 py-3 text-sm border flex items-center justify-between ${
            msg.startsWith('Impossible') || msg.includes('erreur')
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          {msg}
          <button onClick={() => setMsg(null)} className="opacity-60 hover:opacity-100 ml-3">✕</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          {
            label: 'En attente',
            value: emprunts.filter((e) => e.statut === 'ATTENTE').length,
            color: 'bg-amber-50 text-amber-700',
          },
          {
            label: 'En cours',
            value: emprunts.filter((e) => e.statut === 'EN_COURS').length,
            color: 'bg-blue-50 text-blue-700',
          },
          {
            label: 'Réservations',
            value: reservationsActives.length,
            color: 'bg-purple-50 text-purple-700',
          },
          {
            label: 'Livres rendus',
            value: empruntsPasses.length,
            color: 'bg-emerald-50 text-emerald-700',
          },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-2xl p-5`}>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm mt-1 opacity-80">{label}</p>
          </div>
        ))}
      </div>

      {/* Emprunts actifs (ATTENTE + EN_COURS) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mes emprunts actifs</h2>
        {empruntsCours.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-400">
            <p className="mb-2">Aucun emprunt actif.</p>
            <Link href="/" className="text-indigo-600 text-sm hover:underline">
              Parcourir le catalogue →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {empruntsCours.map((emprunt) => (
              <EmpruntCard key={emprunt.id} emprunt={emprunt} />
            ))}
          </div>
        )}
      </section>

      {/* Réservations actives */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Réservations actives</h2>
        {reservationsActives.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-400">
            Aucune réservation en attente.
          </div>
        ) : (
          <div className="space-y-3">
            {reservationsActives.map((r) => (
              <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {r.exemplaire?.livre?.imageUrl && (
                      <div className="relative w-10 h-[60px] shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-slate-100">
                        <Image
                          src={r.exemplaire.livre.imageUrl}
                          alt={r.exemplaire.livre.titre ?? ''}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div>
                      {r.exemplaire?.livre && (
                        <p className="text-sm font-medium text-gray-900">
                          {r.exemplaire.livre.titre}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        Réservation #{r.id} · le {fmt(r.dateReservation)}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <StatusBadge statut={r.statut} />
                        <span className="text-xs text-gray-400 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
                          En attente de disponibilité
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAnnuler(r.id)}
                    disabled={busy === `annuler-${r.id}`}
                    className="shrink-0 text-sm bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 font-medium px-3 py-2 rounded-xl border border-red-100 transition-colors"
                  >
                    {busy === `annuler-${r.id}` ? '…' : 'Annuler'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Historique */}
      {(empruntsPasses.length > 0 || reservationsPasses.length > 0) && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Historique</h2>
          <div className="space-y-2">
            {empruntsPasses.map((e) => (
              <EmpruntCard key={e.id} emprunt={e} />
            ))}
            {reservationsPasses.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-gray-100 rounded-2xl flex items-center justify-between px-5 py-4"
              >
                <div>
                  <p className="text-sm text-gray-700">
                    Réservation #{r.id}
                    {r.exemplaire?.livre && ` — ${r.exemplaire.livre.titre}`}
                  </p>
                  <p className="text-xs text-gray-400">{fmt(r.dateReservation)}</p>
                </div>
                <StatusBadge statut={r.statut} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
