import mongoose, { Document } from 'mongoose';
import User from '../users/user.interface';

interface RefreshToken extends Document {
  user: mongoose.Types.ObjectId | User;
  token: string;
  expires: Date;
  issued: Date;
  revoked?: Date;
  replacedByToken?: string;
  // virtual properties
  isExpired: boolean;
  isActive: boolean;
};

export default RefreshToken;