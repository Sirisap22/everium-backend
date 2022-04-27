import { Document } from 'mongoose';

import User from "../users/user.interface";
import PackageType from './package-type.enum';

class Bill extends Document {
  owner: User;
  package: PackageType;
  cost: string;
  issued: Date;
  expires: Date;
}

export default Bill;