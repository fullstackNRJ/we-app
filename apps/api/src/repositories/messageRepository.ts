import { Message, IMessage } from '../models/Message';

export const MessageRepository = {
  async create(text: string): Promise<IMessage> {
    const message = new Message({ text });
    return await message.save();
  },

  async findAll(): Promise<IMessage[]> {
    return await Message.find().sort({ createdAt: -1 }).exec();
  },
}; 