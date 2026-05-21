export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white font-semibold">
          <span className="text-xl">📚</span>
          Bibliothèque Numérique
        </div>
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} — Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
