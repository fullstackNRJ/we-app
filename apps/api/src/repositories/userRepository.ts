import { User, IUser } from '../models/User';

export const findByPhone = async (phone: string) => User.findOne({ phone });
export const findByInviteCode = async (inviteCode: string) => User.findOne({ inviteCode });
export const createUser = async (user: Partial<IUser>) => User.create(user);
export const findById = async (id: string) => User.findById(id); 