import { getLivre, getLivres } from '@/lib/api';
import BookDetailClient from './BookDetailClient';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const livres = await getLivres();
    if (livres.length > 0) return livres.map((l) => ({ id: String(l.id) }));
  } catch {}
  // Fallback si l'API est hors ligne au moment du build (ex: Render en veille)
  return Array.from({ length: 20 }, (_, i) => ({ id: String(i + 1) }));
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const livre = await getLivre(Number(id));
    if (!livre) return notFound();
    return <BookDetailClient livre={livre} />;
  } catch {
    return notFound();
  }
}
