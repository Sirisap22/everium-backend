import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';
import Package from '../packages/package.interface';
import UserRole from './user-role.enum';
import User from './user.interface';

const userSchema = new Schema({
  profileImage: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  role: { type: String, required: true, enum: Object.values(UserRole) },
  usedPromote: { type: Number, default: 0, required: true },
  createdPosts: { type: Number, default: 0, required: true },
  verificationToken: { type: String },
  verified: { type: Date },
  resetToken: {
    token: { type: String },
    expires: { type: Date }
  },
  verifySellerToken: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  citizenId: { type: String },
  citizenIdVerificationImage: { type: String },
  phoneNumber: { type: String },
  package: { ref: 'Package', type: mongoose.Types.ObjectId },
});

userSchema.virtual('isVerified').get(function (this: { verified: Date, passwordReset: Date }) {
  // !! to convert to boolean
  return !!(this.verified);
})

userSchema.virtual('promoteLimit').get(function (this: { package?: Package} ) {
  if (this.package) 
    return this.package.promoteLimitPerMonth;
  return 20;
})

userSchema.virtual('postLimit').get(function (this: { package?: Package }) {
  if (this.package) 
    return this.package.postLimitPerUser;
  return 5;
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret.hashedPassword;
        delete ret._id;
        delete ret.__v;
        delete ret.isVerified;
        delete ret.verified;
    }
});


const userModel = model<User>('User', userSchema);

export default userModel;