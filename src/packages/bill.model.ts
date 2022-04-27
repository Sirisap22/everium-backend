import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';
import Bill from './bill.interface';
import PackageType from './package-type.enum';

const billSchema = new Schema({
  owner: { ref: 'User', type: mongoose.Types.ObjectId },
  packageType: { type: String, required: true, enum: Object.values(PackageType) },
  issued: { type: Date, default: () => new Date(Date.now()) },
  expires: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) } // + 1 year
});

billSchema.virtual('isExpired').get(function (this: { expires: Date }) {
  return this.expires < new Date();
});

const billModel = model<Bill>('Bill', billSchema);

export default billModel;