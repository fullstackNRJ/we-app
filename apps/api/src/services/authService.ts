import { createUser, findByPhone, findByInviteCode, findById } from '../repositories/userRepository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { IUser } from '../models/User';

export async function register({ inviteCode, name, pin, phone }: { inviteCode: string, name: string, pin: string, phone: string }) {
  if (!inviteCode) throw new Error('Invite code required');
  const existingInvite = await findByInviteCode(inviteCode);
  if (existingInvite) throw new Error('Invite code already used');
  const existingPhone = await findByPhone(phone);
  if (existingPhone) throw new Error('Phone already registered');
  const user = await createUser({ name, pin, phone, inviteCode });
  const accessToken = signAccessToken({ id: user.id, name: user.name });
  const refreshToken = signRefreshToken({ id: user.id });
  return { accessToken, refreshToken, user: { id: user.id, name: user.name } };
}

export async function login({ phone, pin }: { phone: string, pin: string }) {
  const user = await findByPhone(phone);
  if (!user || user.pin !== pin) throw new Error('Invalid credentials');
  const accessToken = signAccessToken({ id: user.id, name: user.name });
  const refreshToken = signRefreshToken({ id: user.id });
  return { accessToken, refreshToken, user: { id: user.id, name: user.name } };
}

export async function refreshToken({ refreshToken }: { refreshToken: string }) {
  const payload = verifyRefreshToken(refreshToken) as { id: string };
  const user = await findById(payload.id);
  if (!user) throw new Error('User not found');
  return { accessToken: signAccessToken({ id: user.id, name: user.name }) };
} 