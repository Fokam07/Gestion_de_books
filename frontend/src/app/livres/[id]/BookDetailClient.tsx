'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createEmprunt, createReservation, Livre } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';

const FALLBACK = 'https://placehold.co/300x450/1e1b4b/ffffff?text=📚';

export default function BookDetailClient({ livre }: { livre: Livre }) {
  const { user, token } = useAuth();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const exemplaires = livre.exemplaires ?? [];
  const disponibles = exemplaires.filter((e) => e.statut === 'DISPONIBLE');
  const tousEmpruntes = exemplaires.length > 0 && disponibles.length === 0;

  const handleEmprunt = async (exemplaireId: number) => {
    if (!token) return;
    setLoading('emprunt');
    setMessage(null);
    try {
      await createEmprunt([exemplaireId], token);
      setMessage({ type: 'success', text: '✅ Emprunt enregistré ! Rendez-vous dans "Mon compte" pour le suivre.' });
    } catch (err: unknown) {
      const e = err as { status?: number };
      const text = e.status === 409 ? 'Cet exemplaire est déjà emprunté.' : "Impossible d'emprunter pour l'instant.";
      setMessage({ type: 'error', text });
    } finally {
      setLoading(null);
    }
  };

  const handleReservation = async () => {
    if (!token) return;
    setLoading('reservation');
    setMessage(null);
    try {
      await createReservation(livre.id, token);
      setMessage({ type: 'success', text: "✅ Réservation effectuée ! Vous serez notifié dès qu'un exemplaire est disponible." });
    } catch (err: unknown) {
      const e = err as { status?: number };
      const text =
        e.status === 409 ? "Vous avez déjà réservé ce livre, ou un exemplaire est disponible." : "Impossible de réserver pour l'instant.";
      setMessage({ type: 'error', text });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        ← Retour au catalogue
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-0">
          {/* Cover */}
          <div className="relative w-full md:w-64 shrink-0 aspect-[2/3] md:aspect-auto bg-slate-100">
            <Image
              src={livre.imageUrl || FALLBACK}
              alt={livre.titre}
              fill
              className="object-cover"
              unoptimized={!!livre.imageUrl}
              priority
            />
          </div>

          {/* Info */}
          <div className="flex-1 p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{livre.titre}</h1>
                <p className="text-indigo-600 font-medium mt-1">{livre.auteur}</p>
              </div>
              {livre.annee && (
                <span className="shrink-0 text-sm text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1">
                  {livre.annee}
                </span>
              )}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {livre.editeur && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Éditeur</p>
                  <p className="text-sm font-medium text-gray-700">{livre.editeur}</p>
                </div>
              )}
              {livre.collection && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Collection</p>
                  <p className="text-sm font-medium text-gray-700">{livre.collection}</p>
                </div>
              )}
              {livre.isbn && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">ISBN</p>
                  <p className="text-sm font-medium text-gray-700 font-mono">{livre.isbn}</p>
                </div>
              )}
            </div>

            {/* Exemplaires */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Exemplaires ({exemplaires.length})
              </h2>
              {exemplaires.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucun exemplaire enregistré.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {exemplaires.map((ex) => (
                    <div key={ex.id} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                      <span className="text-xs font-mono text-gray-600">{ex.codeBarre}</span>
                      <StatusBadge statut={ex.statut} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-6 rounded-xl px-4 py-3 text-sm ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                {message.text}
              </div>
            )}

            {/* Actions */}
            {!user ? (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-700">
                <Link href="/auth/login" className="font-semibold hover:underline">Connectez-vous</Link>{' '}
                pour emprunter ou réserver ce livre.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                {disponibles.length > 0 ? (
                  <button
                    onClick={() => handleEmprunt(disponibles[0].id)}
                    disabled={loading !== null}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    {loading === 'emprunt' ? 'Traitement…' : '📖 Emprunter'}
                  </button>
                ) : tousEmpruntes ? (
                  <button
                    onClick={handleReservation}
                    disabled={loading !== null}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    {loading === 'reservation' ? 'Traitement…' : '🔔 Réserver'}
                  </button>
                ) : (
                  <p className="text-gray-400 text-sm py-3">Aucun exemplaire disponible à l'emprunt pour l'instant.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
