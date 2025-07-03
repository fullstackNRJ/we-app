import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  text: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema); 