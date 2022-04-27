import { Router, Request, Response, NextFunction } from "express";

import Controller from "../interfaces/controller.interface";
import authorize from '../middlewares/authorization.middelware';
import validate from '../middlewares/validation.middleware';
import User from "../users/user.interface";
import GetRealEstatesFilterDto from "./get-real-estates-filter.dto";
import PostRealEstateReviewDto from "./post-real-estate-review.dto";
import realEstateService from "./real-estate.service";

class RealEstateController implements Controller {
  public path = '/real-estates';
  public router = Router();
  private realEstateService = realEstateService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getRealEstates)
    this.router.get(`${this.path}/:id`, this.getRealEstateById)
    this.router.post(`${this.path}/:id/reviews`, [...authorize(), validate(PostRealEstateReviewDto)], this.reviewRealEstateById)
    this.router.delete(`${this.path}/:id/reviews`, [...authorize()],this.deleteReviewRealEstateById)
  }

  private getRealEstates = async (req: Request, res: Response, next: NextFunction) => {
    const getRealEstatesFilterDto = req.query as GetRealEstatesFilterDto;
    try {
      const realEstates = await this.realEstateService.getRealEstates(getRealEstatesFilterDto);
      res.status(200).send({
        status: 200,
        message: 'get real estates successfully',
        metaData: realEstates
      });
    } catch(error) {
      next(error);
    }
  }

  private getRealEstateById = async (req: Request, res: Response, next: NextFunction) => {
    const realEstateId = req.params.id as string;;
    try {
      const realEstate = await this.realEstateService.getRealEstateById(realEstateId);
      res.status(200).send({
        status: 200, 
        message: 'get the real estate successfully',
        metaData: realEstate
      });
    } catch(error) {
      next(error);
    }
  }

  private reviewRealEstateById = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const realEstateId = req.params.id as string;
    const postRealEstateReviewDto = req.body as PostRealEstateReviewDto;
    try {
      const review = await this.realEstateService.reviewRealEstateById(user, realEstateId, postRealEstateReviewDto);
      res.status(201).send({
        status: 201,
        message: 'create the review successfully',
        metaData: review
      })
    } catch(error) {
      next(error);
    }
  }

  private deleteReviewRealEstateById = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const realEstateId = req.params.id as string;
    try {
      await this.realEstateService.deleteReviewRealEstateById(user, realEstateId);
      res.status(200).send({
        status: 200,
        message: 'delete the review successfully',
      });
    } catch(error) {
      next(error);
    }
  }


}

export default new RealEstateController();