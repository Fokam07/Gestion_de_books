'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createLivre, CATEGORIES } from '@/lib/api';

export default function NouveauLivrePage() {
  const { token, isAdmin } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value.trim();

    const data = {
      titre: get('titre'),
      auteur: get('auteur'),
      isbn: get('isbn') || undefined,
      annee: get('annee') ? Number(get('annee')) : undefined,
      editeur: get('editeur') || undefined,
      collection: get('collection') || undefined,
      imageUrl: get('imageUrl') || undefined,
      categorie: (get('categorie') as import('@/lib/api').Categorie) || undefined,
    };

    try {
      await createLivre(data, token);
      router.push('/admin');
    } catch {
      setError('Erreur lors de la création. Vérifiez les champs (ISBN unique, URL valide…).');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        ← Retour au dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Ajouter un livre</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Titre <span className="text-red-400">*</span>
              </label>
              <input
                name="titre"
                required
                placeholder="Le Nom de la Rose"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Auteur <span className="text-red-400">*</span>
              </label>
              <input
                name="auteur"
                required
                placeholder="Umberto Eco"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Année</label>
              <input
                name="annee"
                type="number"
                min="1"
                max={new Date().getFullYear()}
                placeholder="1980"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ISBN</label>
              <input
                name="isbn"
                placeholder="9782070410026"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Éditeur</label>
              <input
                name="editeur"
                placeholder="Grasset"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Collection</label>
              <input
                name="collection"
                placeholder="Livre de poche"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Catégorie</label>
              <select
                name="categorie"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
              >
                <option value="">— Sélectionner une catégorie —</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL de la couverture</label>
              <input
                name="imageUrl"
                type="url"
                placeholder="https://covers.openlibrary.org/b/isbn/..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <p className="text-xs text-gray-400 mt-1">
                Astuce : utilisez{' '}
                <code className="bg-gray-100 px-1 py-0.5 rounded">covers.openlibrary.org/b/isbn/&lt;ISBN&gt;-L.jpg</code>
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Création…' : 'Ajouter au catalogue'}
            </button>
            <Link
              href="/admin"
              className="px-6 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
