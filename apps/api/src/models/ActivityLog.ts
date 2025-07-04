import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  user: mongoose.Types.ObjectId;
  action: string;
  meta: any;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  meta: { type: Schema.Types.Mixed },
}, { timestamps: true });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema); 