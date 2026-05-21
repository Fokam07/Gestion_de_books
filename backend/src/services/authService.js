import prisma from '../db/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const generateTokens = async (user) => {
  // 1. Access Token (Court : 15 min)
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  // 2. Refresh Token (Long : 7 jours)
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // 3. Hachage et stockage du Refresh Token pour la sécurité (Section 1 & 4)
  const hashedToken = await bcrypt.hash(refreshToken, 10);
  
  await prisma.refreshToken.create({
    data: {
      hashedToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
    }
  });

  return { accessToken, refreshToken };
};

const register = async (userData) => {
    
  const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
  if (existingUser) throw new Error('EMAIL_ALREADY_USED');

  // Hachage du mot de passe (Section 2 : cost >= 10)
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword
    }
  });

  // On ne renvoie pas le password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('INVALID_CREDENTIALS');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('INVALID_CREDENTIALS');

  const { accessToken, refreshToken } = await generateTokens(user);
  
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token: accessToken, refreshToken };
};

export { register, login , generateTokens};