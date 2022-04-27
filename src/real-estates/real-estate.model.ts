import mongoose, { model, Schema } from 'mongoose';
import RealEstate from './real-estate.interface';

const realEstateSchema = new Schema({
  name: { type: String, required: true },
  area: { type: String, required: true },
  reviews: {
    type: 
    [{
      reviewer: { ref: 'User', type: mongoose.Types.ObjectId, required: true },
      comment: { type: String, required: true },
      star: { type: Number, default: 0 },
    }],
    default: []
  }
});

realEstateSchema.virtual('numberOfReviews').get(function (this: RealEstate) {
  return this.reviews.length;
});

realEstateSchema.virtual('averageStar').get(function (this: RealEstate) {
  if (this.reviews.length <= 0)
    return 0;

  let sum = 0;
  for(const review of this.reviews)
    sum += review.star;
  
  return sum/this.reviews.length;
});

realEstateSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.__v;
    }
});


const realEstateModel = model<RealEstate>('RealEstate', realEstateSchema);

export default realEstateModel;