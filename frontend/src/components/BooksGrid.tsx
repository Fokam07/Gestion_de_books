'use client';

import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

// --- DONNÉES FICTIVES AMÉLIORÉES ---
// Nous enlevons les paramètres de dimension des URLs pour laisser Next.js optimiser
const books = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
    rating: 4.5,
    available: true,
    category: 'Fiction',
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319',
    rating: 4.8,
    available: true,
    category: 'Littérature',
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    image: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0',
    rating: 4.6,
    available: false,
    category: 'Fiction',
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    image: 'https://images.unsplash.com/photo-1543002588-d83cea6bfb4f',
    rating: 4.7,
    available: true,
    category: 'Littérature',
  },
  {
    id: 5,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6',
    rating: 4.9,
    available: true,
    category: 'Fiction',
  },
  {
    id: 6,
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    image: 'https://images.unsplash.com/photo-1476275466078-4007374d2dba',
    rating: 4.4,
    available: true,
    category: 'Science',
  },
  {
    id: 7,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    image: 'https://images.unsplash.com/photo-1491841573634-28fb1df537d3',
    rating: 4.2,
    available: true,
    category: 'Littérature',
  },
  {
    id: 8,
    title: 'Atomic Habits',
    author: 'James Clear',
    image: 'https://images.unsplash.com/photo-1553632032-e5bf4bfaae6c',
    rating: 4.7,
    available: false,
    category: 'Développement Personnel',
  },
  {
    id: 9,
    title: 'The Book Thief',
    author: 'Markus Zusak',
    image: 'https://images.unsplash.com/photo-1484627580022-9937c1cb63d0',
    rating: 4.6,
    available: true,
    category: 'Littérature',
  },
  {
    id: 10,
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    image: 'https://images.unsplash.com/photo-1508284307175-bc9cab375b1d',
    rating: 4.3,
    available: true,
    category: 'Science',
  },
];

export default function BooksGrid() {
  return (
    <section className="py-24 px-6 md:px-10 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Decorative radial gradients for high-end look */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-red-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-slate-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-extrabold text-center mb-5 text-slate-950 font-serif tracking-tight animate-fade-in">
          Nos Ouvrages <span className="text-[#C41C3B] relative inline-block after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-[#C41C3B]/20 after:rounded-full">Populaires</span>
        </h2>
        <p className="text-center mb-16 text-slate-600 text-xl font-light tracking-wide max-w-2xl mx-auto">
          Découvrez une sélection de livres recommandés par nos membres et notre équipe éditoriale.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex flex-col rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:border-red-100 transition-all duration-500 transform hover:-translate-y-3 cursor-pointer bg-white group"
            >
              {/* Book Image Container */}
              <div className="relative aspect-[2/3] w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-w-7xl) 20vw" // Optimisation Next.js
                />
                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors duration-500" />
                {!book.available && (
                  <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center backdrop-blur-xs">
                    <span className="text-white font-bold text-center px-4 py-1.5 bg-slate-900/90 rounded-lg uppercase tracking-wider text-xs border border-white/10 shadow-lg">
                      🔒 Réservé
                    </span>
                  </div>
                )}
              </div>

              {/* Book Info */}
              <div className="p-5 flex flex-col flex-grow relative bg-white">
                <p
                  className="inline-block text-[11px] font-bold px-3 py-1 rounded-full mb-3 self-start uppercase tracking-wider transition-all duration-300 group-hover:scale-105"
                  style={{
                    backgroundColor: '#FDF2F2', // Rouge très pâle
                    color: '#C41C3B',
                  }}
                >
                  {book.category}
                </p>

                <h3 className="font-bold text-base line-clamp-1 mb-1.5 text-slate-900 font-serif group-hover:text-[#C41C3B] transition-colors duration-300">
                  {book.title}
                </h3>
                <p className="text-xs mb-4 text-slate-500 font-medium tracking-wide">
                  par <span className="text-slate-700">{book.author}</span>
                </p>

                {/* Rating & Button Container */}
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={13}
                          className="transition-transform duration-300 group-hover:scale-120"
                          style={{
                            color: i < Math.floor(book.rating) ? '#FFC107' : '#E2E8F0', // slate-200
                            transitionDelay: `${i * 50}ms`
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-500">
                      {book.rating.toFixed(1)}
                    </span>
                  </div>

                  <button
                    className={`w-full py-3 rounded-lg font-bold text-white text-xs uppercase tracking-wider transition-all duration-300 shadow-md ${
                      book.available
                        ? 'bg-slate-900 hover:bg-[#C41C3B] hover:shadow-red-200/50 hover:shadow-lg active:scale-95'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                    disabled={!book.available}
                  >
                    {book.available ? '⚡ Réserver' : 'Indisponible'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
