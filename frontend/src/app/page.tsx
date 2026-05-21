import HeroBanner from '@/components/HeroBanner';
import CatalogueSection from '@/components/CatalogueSection';
import { getLivres, Livre } from '@/lib/api';

async function fetchLivres(): Promise<Livre[]> {
  try {
    return await getLivres();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const livres = await fetchLivres();

  return (
    <>
      <HeroBanner totalLivres={livres.length} />
      <CatalogueSection livres={livres} />
    </>
  );
}
