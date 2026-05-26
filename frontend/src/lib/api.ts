import axios from 'axios';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://gestion-de-books.onrender.com';
const API_URL = rawApiUrl.trim().replace(/^['"]|['"]$/g, '').replace(/\/$/, '');

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as typeof error.config & {
      _retry?: boolean;
      url?: string;
      headers: { Authorization?: string };
    };

    if (error.response?.status === 401 && !original._retry && !original.url?.startsWith('/auth/')) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${API_URL}/api/auth/refresh`,
          { refreshToken }
        );

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export interface RegisterPayload {
  nom: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  nom: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<{ user: AuthUser }>('/auth/register', payload),

  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  me: () => api.get<AuthUser>('/auth/me'),
};

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

export interface Exemplaire {
  id: number;
  codeBarre: string;
  statut: 'DISPONIBLE' | 'EMPRUNTE' | 'RESERVE' | 'MAINTENANCE';
}

export interface Livre {
  id: number;
  titre: string;
  auteur: string;
  isbn?: string;
  annee?: number;
  editeur?: string;
  collection?: string;
  imageUrl?: string;
  categorie?: Categorie;
  exemplaires: Exemplaire[];
}

export interface CreateLivrePayload {
  titre: string;
  auteur: string;
  annee?: number;
  isbn?: string;
  editeur?: string;
  collection?: string;
  imageUrl?: string;
  categorie?: Categorie;
}

export const livresApi = {
  getAll: () => api.get<Livre[]>('/livres'),
  getOne: (id: number) => api.get<Livre>(`/livres/${id}`),
  create: (data: CreateLivrePayload) => api.post<Livre>('/livres', data),
  delete: (id: number) => api.delete(`/livres/${id}`),
};

export interface EmpruntLivre {
  id: number;
  titre: string;
  auteur: string;
  imageUrl?: string;
}

export interface EmpruntExemplaire {
  exemplaireId: number;
  exemplaire: {
    id: number;
    codeBarre: string;
    statut: string;
    livre: EmpruntLivre;
  };
}

export interface Emprunt {
  id: number;
  userId: number;
  statut: 'ATTENTE' | 'EN_COURS' | 'RETOURNE';
  dateEmprunt: string;
  dateRetour: string | null;
  exemplaires: EmpruntExemplaire[];
  user?: { id: number; nom: string; email: string };
}

export const empruntsApi = {
  creer: (exemplaireIds: number[]) =>
    api.post<Emprunt>('/emprunts', { exemplaireIds }),
  getAll: () => api.get<Emprunt[]>('/emprunts'),
  getMes: () => api.get<Emprunt[]>('/emprunts/mes-emprunts'),
  valider: (id: number) => api.patch<Emprunt>(`/emprunts/${id}/valider`),
  retourner: (id: number) => api.patch<Emprunt>(`/emprunts/${id}/retourner`),
  validerRetourAdmin: (id: number) => api.patch<Emprunt>(`/emprunts/${id}/retourner`),
};

export interface Reservation {
  id: number;
  userId: number;
  exemplaireId: number;
  statut: 'ACTIVE' | 'HONOREE' | 'ANNULEE';
  createdAt: string;
  exemplaire: {
    id: number;
    codeBarre: string;
    statut: 'DISPONIBLE' | 'EMPRUNTE' | 'RESERVE' | 'MAINTENANCE';
    livre: EmpruntLivre;
  };
  user?: { id: number; nom: string; email: string };
}

export const reservationsApi = {
  creer: (livreId: number) =>
    api.post<Reservation>('/reservations', { livreId }),
  getAll: () => api.get<Reservation[]>('/reservations'),
  getMes: () => api.get<Reservation[]>('/reservations/mes-reservations'),
  honorer: (id: number) => api.post<Emprunt>(`/reservations/${id}/honorer`),
  annuler: (id: number) => api.delete(`/reservations/${id}`),
};

export const exemplaireApi = {
  creerPourLivre: (livreId: number, codeBarre: string) =>
    api.post<Exemplaire>(`/livres/${livreId}/exemplaires`, { codeBarre }),
  updateStatut: (id: number, statut: Exemplaire['statut']) =>
    api.patch<Exemplaire>(`/livres/exemplaires/${id}/statut`, { statut }),
};

export default api;