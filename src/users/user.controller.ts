import express , { Router, Request, Response, NextFunction } from "express";
import { resolve } from 'path';

import Controller from "../interfaces/controller.interface";
import authorize from "../middlewares/authorization.middelware";
import validate from "../middlewares/validation.middleware";
import User from "./user.interface";
import userService from "./user.service";
import VerifySellerDto from "./verify-seller.dto";
import upload from "../middlewares/upload.middleware";
import privateUpload from "../middlewares/private-upload.middleware";
import UpdateUserDto from "./update-user.dto";
import UserRole from "./user-role.enum";

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private userService = userService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/public-profile/:id`, this.getPublicProfile);
    this.router.get(`${this.path}`, authorize(), this.getUserProfile);
    this.router.patch(`${this.path}`, [...authorize(), upload.single('profileImage'), validate(UpdateUserDto)], this.updateUserProfile);
    this.router.post(`${this.path}/verify-seller`, [...authorize(), /*privateUpload.single('citizenIdVerificationImage'),*/ validate(VerifySellerDto)], this.verifySeller);
    this.router.get(`${this.path}/verify-seller/:token`, this.promoteToSeller);
    
  }

  private getPublicProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;
    try {
      const publicProfile = await this.userService.getPublicProfile(userId);
      res.status(200).send({
        status: 200,
        message: 'get the public profile successfully',
        metaData: publicProfile
      })
    } catch(error) {
      next(error);
    }
  }

  private getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    try {
      const userProfile = this.userService.getUserProfile(user);
      res.status(200).send({
        status: 200,
        message: 'get the user profile successfully',
        metaData: userProfile
      });
    } catch(error) {
      next(error);
    }
  }

  private updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const updateUserDto = {
      ...req.body,
      profileImage: req.file? req.file: undefined
    } as UpdateUserDto;
    try {
      const userProfile = await this.userService.updateUserProfile(user, updateUserDto);
      res.status(200).send({
        status: 200,
        message: 'update the user profile successfully',
        metaData: userProfile
      });
    } catch(error) {
      next(error);
    }
  }

  private verifySeller = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const verifySellerDto = {
      ...req.body,
      // citizenIdVerificationImage: req.file? req.file: undefined
    } as VerifySellerDto;
    // console.log(verifySellerDto)
    try {
      await this.userService.verifySeller(user, verifySellerDto);
      res.status(200).send({
        status: 200,
        message: 'send verification information successfully'
      });
    } catch(error) {
      next(error);
    }
  }

  private promoteToSeller = async (req: Request, res: Response, next: NextFunction) => {
    const verifySellerToken = req.params.token as string;
    try {
      await this.userService.promoteToSeller(verifySellerToken);
      res.status(200).send({
        status: 200,
        message: 'promote user to seller successfully'
      })
    } catch(error) {
      next(error);
    }
  }
}

export default new UserController();
