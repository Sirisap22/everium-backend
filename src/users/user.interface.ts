import { Document } from 'mongoose';
import Package from '../packages/package.interface';
import UserRole from './user-role.enum';

interface User extends Document {
  profileImage?: string;
  username: string;
  email: string;
  hashedPassword: string;
  role: UserRole;
  usedPromote: number;
  createdPosts: number;
  verified?: Date;
  verificationToken?: string;
  resetToken?: {
    token: string;
    expires: Date;
  }
  firstName?: string;
  lastName?: string;
  citizenId?: string;
  citizenIdVerificationImage?: string;
  phoneNumber?: string;
  package?: Package;
  verifySellerToken?: string;
  // virtual properties
  isVerified: boolean;
  promoteLimit: number;
  postLimit: number;
};

export default User;