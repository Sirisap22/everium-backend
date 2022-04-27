import { Document } from 'mongoose'

import User from '../users/user.interface';
import PackageType from './package-type.enum';

interface Package extends Document {
  owner: User;
  type: PackageType;
  issued: Date;
  // virutal propertries
  promoteLimitPerMonth: number;
  postLimitPerUser: number;
}

export default Package;