import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    landmark?: string;
    city: string;
    pincode: string;
  };
  product: {
    name: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    weight: string;
    pieces: string;
    breadHalwa: boolean;
  };
  payment: {
    method: string;
    amount: number;
    status: 'PAYMENT_PENDING' | 'SCREENSHOT_UPLOADED' | 'PAYMENT_VERIFIED' | 'PAYMENT_REJECTED';
    screenshotUrl?: string;
    screenshotPublicId?: string;
    uploadedAt?: Date;
    verifiedAt?: Date;
    verifiedBy?: string;
  };
  orderStatus: 'PAYMENT_PENDING' | 'PAYMENT_VERIFICATION' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  feedback?: {
    rating: number;
    comment: string;
    isApproved: boolean;
    submittedAt: Date;
  };
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    address: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  product: {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    weight: { type: String, required: true },
    pieces: { type: String, required: true },
    breadHalwa: { type: Boolean, default: false }
  },
  payment: {
    method: { type: String, required: true, default: 'UPI' },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PAYMENT_PENDING', 'SCREENSHOT_UPLOADED', 'PAYMENT_VERIFIED', 'PAYMENT_REJECTED'],
      default: 'PAYMENT_PENDING',
      index: true
    },
    screenshotUrl: { type: String },
    screenshotPublicId: { type: String },
    uploadedAt: { type: Date },
    verifiedAt: { type: Date },
    verifiedBy: { type: String },
  },
  orderStatus: {
    type: String,
    enum: ['PAYMENT_PENDING', 'PAYMENT_VERIFICATION', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    default: 'PAYMENT_PENDING',
    index: true
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    isApproved: { type: Boolean, default: false },
    submittedAt: { type: Date }
  },
  adminNote: { type: String },
}, {
  timestamps: true
});

export default mongoose.model<IOrder>('Order', OrderSchema);
