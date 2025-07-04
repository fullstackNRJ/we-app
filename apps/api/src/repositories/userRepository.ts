import { User, IUser } from '../models/User';

export const findByPhone = async (phone: string) => User.findOne({ phone });
export const findByInviteCode = async (inviteCode: string) => User.findOne({ inviteCode });
export const createUser = async (user: Partial<IUser>) => User.create(user);
export const findById = async (id: string) => User.findById(id);

export const createInviteCode = async (inviteCode: string, role: 'admin' | 'user' = 'user') => 
  User.create({ inviteCode, role, used: false });

export const findUnusedInviteCode = async (inviteCode: string) =>
  User.findOne({ inviteCode, used: false, name: { $exists: false } });

export const markInviteCodeUsed = async (inviteCode: string) =>
  User.updateOne({ inviteCode }, { used: true }); 