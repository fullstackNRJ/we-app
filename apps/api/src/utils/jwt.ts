import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const ACCESS_SECRET = env.JWT_SECRET + '_access';
const REFRESH_SECRET = env.JWT_SECRET + '_refresh';

export function signAccessToken(user: { id: string; name: string; role: string }) {
  return jwt.sign({ id: user.id, name: user.name, role: user.role }, ACCESS_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(user: { id: string }) {
  return jwt.sign(user, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
} 