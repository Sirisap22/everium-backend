import mongoose from "mongoose";
import ConflictException from "../exceptions/ConflictException";
import NotFoundException from "../exceptions/NotFoundException";
import User from "../users/user.interface";
import GetRealEstatesFilterDto from "./get-real-estates-filter.dto";
import PostRealEstateReviewDto from "./post-real-estate-review.dto";
import realEstateModel from "./real-estate.model";

class RealEstateService {
  private realEstateModel = realEstateModel;

  public async getRealEstates(getRealEstatesFilterDto: GetRealEstatesFilterDto) {
    let { limit, averageStar } = getRealEstatesFilterDto;
    const { name, area } = getRealEstatesFilterDto;

    if (!limit) limit = '10'
    if (!averageStar) averageStar = '0.0'

    const filtersRegex: {[key:string]: {[key:string]:RegExp}} = {}
    if (name) filtersRegex['name'] = { $regex: new RegExp(name, 'i') }
    if (area) filtersRegex['area'] = { $regex: new RegExp(area, 'i') }
  
    const realEstatesWithOutReviews = await this.realEstateModel.find({ ...filtersRegex, averageStar: { $gte: parseFloat(averageStar) } }).limit(parseInt(limit));
    return realEstatesWithOutReviews;
  }

  public async getRealEstateById(realEstateId: string) {
    const realEstate = await this.realEstateModel.findById(realEstateId);

    if (!realEstate)
      throw new NotFoundException(`the real estate with id ${realEstateId} not found`);

    return realEstate;
  }

  public async reviewRealEstateById(user: User, realEstateId: string, postRealEstateReview: PostRealEstateReviewDto) {
    const realEstate = await this.getRealEstateById(realEstateId);
    const { comment, star } = postRealEstateReview;

    const review = {
      reviewer: user._id,
      comment,
      star: parseFloat(star)
    }

    for (const review of realEstate.reviews) {
      const reviewer = review.reviewer.toString();
      const userId = user._id.toString();
      if (reviewer === userId)
        throw new ConflictException('user already review');
    }

    await realEstate.updateOne({ $push: { reviews: review } });

    return review;
  }

  public async deleteReviewRealEstateById(user: User, realEstateId: string) {
    const realEstate = await this.getRealEstateById(realEstateId);

    await realEstate.updateOne({
      $pull: { reviews: {reviewer : user._id} }
    })
  }
}

export default new RealEstateService();