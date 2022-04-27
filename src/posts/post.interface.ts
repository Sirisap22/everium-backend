import { Document } from 'mongoose';
import RealEstate from '../real-estates/real-estate.interface';
import User from '../users/user.interface';
import PostStatus from './post-status.enum';

interface Post extends Document {
  author: User;
  status: PostStatus;
  postNameTH: string;
  postNameEN: string;
  realEstate: RealEstate; 
  detail: string[];
  size: string;
  floor: string;
  bedRoom: string;
  bathRoom: string;
  type: string;
  contractType: string;
  price: string;
  pricePerMonth: string;
  images: string[];
  lastModified: Date; 
  moreDetailTH: string;
  moreDetailEN: string;
  publishDate: Date;
  views: Number;
  // virtual properties
  isDrafting: boolean;
  isSuspended: boolean;
  isPublish: boolean;
}

export default Post;

