import { createUser, findByPhone, findByInviteCode, findById, findUnusedInviteCode, markInviteCodeUsed, createInviteCode } from '../repositories/userRepository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { IUser } from '../models/User';
import crypto from 'crypto';

export async function register({ inviteCode, name, pin, phone, role }: { inviteCode: string, name: string, pin: string, phone: string, role?: 'admin' | 'user' }) {
  if (!inviteCode) throw new Error('Invite code required');
  const invite = await findUnusedInviteCode(inviteCode);
  if (!invite) throw new Error('Invalid or already used invite code');
  const existingPhone = await findByPhone(phone);
  if (existingPhone) throw new Error('Phone already registered');
  // Update the invite code user with registration details
  invite.name = name || '';
  invite.pin = pin || '';
  invite.phone = phone || '';
  invite.used = true;
  if (role) invite.role = role;
  await invite.save();
  //await markInviteCodeUsed(inviteCode);
  const accessToken = signAccessToken({ id: invite.id, name: invite.name || '', role: invite.role });
  const refreshToken = signRefreshToken({ id: invite.id });
  return { accessToken, refreshToken, user: { id: invite.id, name: invite.name || '', role: invite.role } };
}

export async function login({ phone, pin }: { phone: string, pin: string }) {
  const user = await findByPhone(phone);
  if (!user || user.pin !== pin) throw new Error('Invalid credentials');
  const accessToken = signAccessToken({ id: user.id, name: user.name || '', role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });
  return { accessToken, refreshToken, user: { id: user.id, name: user.name || '', role: user.role } };
}

export async function refreshToken({ refreshToken }: { refreshToken: string }) {
  const payload = verifyRefreshToken(refreshToken) as { id: string };
  const user = await findById(payload.id);
  if (!user) throw new Error('User not found');
  return { accessToken: signAccessToken({ id: user.id, name: user.name || '', role: user.role }) };
}

export async function generateInviteCode(role: 'admin' | 'user' = 'user') {
  try {
    // 8-char alphanumeric
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    await createInviteCode(code, role);
    return code;
  } catch (err) {
    console.error('Error generating invite code:', err);
    throw new Error('Failed to generate invite code');
  }
} 