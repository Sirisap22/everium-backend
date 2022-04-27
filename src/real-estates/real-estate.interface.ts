import { Document } from 'mongoose';
import User from '../users/user.interface';

interface RealEstate extends Document {
  name: string;
  area: string;
  reviews: {
    reviewer: User;
    comment: string;
    star: number; 
  }[];
  // virtual properties
  numberOfReviews: number;
  averageStar: number;
}

export default RealEstate;