import mongoose, { Schema, Document } from 'mongoose';

export interface IShoppingItem extends Document {
  user: mongoose.Types.ObjectId;
  item: string;
  priority: 'low' | 'med' | 'high';
  isBought: boolean;
  type: 'shopping' | 'wishlist';
  price?: number;
  externalLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShoppingItemSchema = new Schema<IShoppingItem>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: String, required: true },
  priority: { type: String, enum: ['low', 'med', 'high'], default: 'med' },
  isBought: { type: Boolean, default: false },
  type: { type: String, enum: ['shopping', 'wishlist'], required: true },
  price: Number,
  externalLink: String,
}, { timestamps: true });

export const ShoppingItem = mongoose.model<IShoppingItem>('ShoppingItem', ShoppingItemSchema); 