const CONFIG: Record<string, { label: string; className: string }> = {
  DISPONIBLE:  { label: 'Disponible',  className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  EMPRUNTE:    { label: 'Emprunté',    className: 'bg-red-100 text-red-700 border-red-200' },
  RESERVE:     { label: 'Réservé',     className: 'bg-amber-100 text-amber-700 border-amber-200' },
  MAINTENANCE: { label: 'Maintenance', className: 'bg-gray-100 text-gray-500 border-gray-200' },
  ATTENTE:     { label: 'En attente',  className: 'bg-amber-100 text-amber-700 border-amber-200' },
  EN_COURS:    { label: 'En cours',    className: 'bg-blue-100 text-blue-700 border-blue-200' },
  RETOURNE:    { label: 'Retourné',    className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  EN_RETARD:   { label: 'En retard',   className: 'bg-red-100 text-red-700 border-red-200' },
  ACTIVE:      { label: 'Active',      className: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  HONOREE:     { label: 'Honorée',     className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  ANNULEE:     { label: 'Annulée',     className: 'bg-gray-100 text-gray-500 border-gray-200' },
  EXPIREE:     { label: 'Expirée',     className: 'bg-orange-100 text-orange-600 border-orange-200' },
};

export default function StatusBadge({ statut }: { statut: string }) {
  const { label, className } = CONFIG[statut] ?? { label: statut, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${className}`}>
      {label}
    </span>
  );
}
