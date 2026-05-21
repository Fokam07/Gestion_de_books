const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function req<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}/api${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.message ?? 'Erreur réseau'), { status: res.status, body });
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const register = (data: { nom: string; email: string; password: string }) =>
  req<{ user: User; token: string; refreshToken: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) });

export const login = (data: { email: string; password: string }) =>
  req<{ user: User; token: string; refreshToken: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) });

export const getMe = (token: string) =>
  req<User>('/auth/me', {}, token);

export const logout = (token: string, refreshToken: string) =>
  req('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }, token);

// ── Livres ────────────────────────────────────────────────────────────────────
export const getLivres = () =>
  req<Livre[]>('/livres');

export const getLivre = (id: number) =>
  req<Livre>(`/livres/${id}`);

export const createLivre = (data: Partial<Livre>, token: string) =>
  req<Livre>('/livres', { method: 'POST', body: JSON.stringify(data) }, token);

export const deleteLivre = (id: number, token: string) =>
  req(`/livres/${id}`, { method: 'DELETE' }, token);

// ── Exemplaires ───────────────────────────────────────────────────────────────
export const getExemplaires = (livreId: number) =>
  req<Exemplaire[]>(`/livres/${livreId}/exemplaires`);

export const createExemplaire = (livreId: number, codeBarre: string, token: string) =>
  req<Exemplaire>(`/livres/${livreId}/exemplaires`, { method: 'POST', body: JSON.stringify({ codeBarre }) }, token);

// ── Emprunts ──────────────────────────────────────────────────────────────────
export const createEmprunt = (exemplaireIds: number[], token: string) =>
  req<Emprunt>('/emprunts', { method: 'POST', body: JSON.stringify({ exemplaireIds }) }, token);

export const getMesEmprunts = (token: string) =>
  req<Emprunt[]>('/emprunts/mes-emprunts', {}, token);

export const getAllEmprunts = (token: string) =>
  req<Emprunt[]>('/emprunts', {}, token);

// Admin : valider un emprunt en attente (ATTENTE → EN_COURS)
export const validerEmprunt = (id: number, token: string) =>
  req<Emprunt>(`/emprunts/${id}/valider`, { method: 'PATCH' }, token);

// Admin : valider un retour (EN_COURS → RETOURNE)
export const validerRetourAdmin = (id: number, token: string) =>
  req<Emprunt>(`/emprunts/${id}/retourner`, { method: 'PATCH' }, token);

// ── Réservations ──────────────────────────────────────────────────────────────
export const createReservation = (livreId: number, token: string) =>
  req<Reservation>('/reservations', { method: 'POST', body: JSON.stringify({ livreId }) }, token);

export const honorerReservation = (id: number, token: string) =>
  req<Emprunt>(`/reservations/${id}/honorer`, { method: 'POST' }, token);

export const annulerReservation = (id: number, token: string) =>
  req(`/reservations/${id}`, { method: 'DELETE' }, token);

export const getMesReservations = (token: string) =>
  req<Reservation[]>('/reservations/mes-reservations', {}, token);

// ── Types ─────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  nom: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Exemplaire {
  id: number;
  codeBarre: string;
  statut: 'DISPONIBLE' | 'EMPRUNTE' | 'RESERVE' | 'MAINTENANCE';
  livreId: number;
  livre?: Livre;
}

export type Categorie =
  | 'ROMAN'
  | 'SCIENCE_FICTION'
  | 'FANTASY'
  | 'POLICIER'
  | 'BIOGRAPHIE'
  | 'HISTOIRE'
  | 'SCIENCE'
  | 'DEVELOPPEMENT_PERSONNEL'
  | 'JEUNESSE'
  | 'PHILOSOPHIE'
  | 'INFORMATIQUE';

export const CATEGORIES: { value: Categorie; label: string }[] = [
  { value: 'ROMAN',                 label: 'Roman' },
  { value: 'SCIENCE_FICTION',       label: 'Science-Fiction' },
  { value: 'FANTASY',               label: 'Fantasy' },
  { value: 'POLICIER',              label: 'Policier' },
  { value: 'BIOGRAPHIE',            label: 'Biographie' },
  { value: 'HISTOIRE',              label: 'Histoire' },
  { value: 'SCIENCE',               label: 'Science' },
  { value: 'DEVELOPPEMENT_PERSONNEL', label: 'Développement personnel' },
  { value: 'JEUNESSE',              label: 'Jeunesse' },
  { value: 'PHILOSOPHIE',           label: 'Philosophie' },
  { value: 'INFORMATIQUE',          label: 'Informatique' },
];

export interface Livre {
  id: number;
  titre: string;
  auteur: string;
  isbn?: string;
  annee?: number;
  editeur?: string;
  collection?: string;
  categorie?: Categorie | null;
  imageUrl?: string;
  exemplaires?: Exemplaire[];
}

export interface EmpruntExemplaire {
  exemplaireId: number;
  exemplaire?: Exemplaire & { livre?: Livre };
}

export interface Emprunt {
  id: number;
  statut: 'ATTENTE' | 'EN_COURS' | 'RETOURNE' | 'EN_RETARD';
  dateEmprunt: string;
  dateRetour?: string;
  user?: User;
  exemplaires: EmpruntExemplaire[];
}

export interface Reservation {
  id: number;
  statut: 'ACTIVE' | 'HONOREE' | 'ANNULEE' | 'EXPIREE';
  dateReservation: string;
  exemplaireId: number;
  exemplaire?: Exemplaire & { livre?: Livre };
}
