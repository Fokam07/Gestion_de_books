import { getLivre } from '@/lib/api';
import BookDetailClient from './BookDetailClient';
import { notFound } from 'next/navigation';

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
