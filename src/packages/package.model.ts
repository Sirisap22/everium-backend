import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';
import PackageType from './package-type.enum';
import Package from './package.interface';

const packageSchema = new Schema({
  owner: { ref: 'User', type: mongoose.Types.ObjectId },
  type: { type: String, required: true, enum: Object.values(PackageType) },
  issued: { 
    type: Date, 
    default: Date.now , 
    index: {
      expires: process.env.PACKAGE_EXPIRE || '1y'
    }
  }
});

packageSchema.virtual('promoteLimitPerMonth').get(function (this: { type: PackageType }) {
  if (this.type === PackageType.Starter)
    return 200; 
  if (this.type === PackageType.Premium)
    return 500;
  return 20;
});

packageSchema.virtual('postLimitPerUser').get(function (this: { type: PackageType }) {
  if (this.type === PackageType.Starter)
    return 60; 
  if (this.type === PackageType.Premium)
    return 100;
  return 5;
});

packageSchema.set('toJSON', {
  virtuals: true,
});


const packageModel = model<Package>('Package', packageSchema);

export default packageModel;