import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../db/prisma.js';
import { registerSchema, loginSchema } from '../utils/validators.js';
import * as authService from '../services/authService.js';   

export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await authService.register(validatedData);
    res.status(201).json({ user });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json(error.errors);
    if (error.message === 'EMAIL_ALREADY_USED') return res.status(409).json({ message: "Email déjà utilisé" });
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json(error.errors);
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Refresh Token requis" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const savedTokens = await prisma.refreshToken.findMany({
      where: { userId: decoded.id, revoked: false }
    });

    let validTokenRecord = null;
    for (const record of savedTokens) {
      const isMatch = await bcrypt.compare(refreshToken, record.hashedToken);
      if (isMatch) {
        validTokenRecord = record;
        break;
      }
    }

    if (!validTokenRecord || validTokenRecord.expiresAt < new Date()) {
      return res.status(403).json({ message: "Refresh Token invalide ou expiré" });
    }

    await prisma.refreshToken.delete({ where: { id: validTokenRecord.id } });
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    const tokens = await authService.generateTokens(user);

    res.json(tokens);
  } catch (error) {
    res.status(403).json({ message: "Session expirée" });
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      const savedTokens = await prisma.refreshToken.findMany({
        where: { userId: req.user.id, revoked: false }
      });

      for (const record of savedTokens) {
        const isMatch = await bcrypt.compare(refreshToken, record.hashedToken);
        if (isMatch) {
          await prisma.refreshToken.update({
            where: { id: record.id },
            data: { revoked: true }
          });
        }
      }
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, nom: true, email: true, role: true, createdAt: true }
  });
  res.json(user);
};