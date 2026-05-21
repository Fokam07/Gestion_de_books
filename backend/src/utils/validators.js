
import { z } from 'zod';

const registerSchema = z.object({
  nom: z.string().min(2, "Le nom est trop court"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
  role: z.enum(["user", "admin"]).optional()
});

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis")
});

export { registerSchema, loginSchema };