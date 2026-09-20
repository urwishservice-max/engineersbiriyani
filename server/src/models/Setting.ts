import mongoose, { Document, Schema } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  isOrdersClosed: boolean;
  closedMessage: string;
  updatedAt: Date;
}

const SettingSchema: Schema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'store_settings',
    },
    isOrdersClosed: {
      type: Boolean,
      required: true,
      default: false,
    },
    closedMessage: {
      type: String,
      default: 'Orders are currently closed. Please check back later!',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISetting>('Setting', SettingSchema);
