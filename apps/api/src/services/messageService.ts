import { MessageRepository } from '../repositories/messageRepository';

export const MessageService = {
  async createMessage(text: string) {
    // Add business logic/validation here if needed
    return await MessageRepository.create(text);
  },

  async getMessages() {
    return await MessageRepository.findAll();
  },
}; 