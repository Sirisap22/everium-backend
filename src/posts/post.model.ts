import mongoose, { model, Schema } from 'mongoose';
import { utcToThailandDateString } from '../utils/chronologer.utils';
import PostStatus from './post-status.enum';
import Post from './post.interface';

const postSchema = new Schema({
  author: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId
  },
  status: { type: String, required: true, enum: Object.values(PostStatus) },
  postNameTH: { type: String, required: true },
  postNameEN: { type: String, required: true },
  realEstate: {
    ref: 'RealEstate',
    type: mongoose.Schema.Types.ObjectId
  },
  detail: [{ type: String, required: true }],
  size: { type: String, required: true },
  floor: { type: String, required: true },
  bedRoom: { type: String, required: true },
  bathRoom: { type: String, required: true },
  type: { type: String, required: true },
  contractType: { type: String, required: true },
  price: { type: String, required: true },
  pricePerMonth: { type: String },
  images: [{ type: String, required: true }],
  lastModified: { type: Date, required: true },
  moreDetailTH: { type: String, required: true },
  moreDetailEN: { type: String, required: true },
  publishDate: { type: Date, required: true },
  views: { type: Number, required: true, default: 0 }
});

postSchema.virtual('isDrafting').get(function (this: { status: PostStatus }) {
  return this.status === PostStatus.Drafting;
});

postSchema.virtual('isSuspended').get(function (this: { status: PostStatus }) {
  return this.status === PostStatus.Suspended;
});

postSchema.virtual('isPublished').get(function (this: { status: PostStatus }) {
  return this.status === PostStatus.Published;
});

postSchema.virtual('isPublished')

postSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // replace lastModifed UTC Date Object to Asia/Thailand Date String
    // ret.lastModified = utcToThailandDateString(ret.lastModified as Date)
    delete ret._id;
    delete ret.__v;
  }
});

const postModel = model<Post>('Post', postSchema);

export default postModel;