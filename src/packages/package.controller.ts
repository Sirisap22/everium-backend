import { Router, Request, Response, NextFunction } from "express";
import Controller from "../interfaces/controller.interface";
import UserRole from "../users/user-role.enum";
import authroize from '../middlewares/authorization.middelware';
import validate from '../middlewares/validation.middleware';
import PurchasePackageDto from "./purchase-package.dto";
import User from "../users/user.interface";
import packageService from "./package.service";

class PackageController implements Controller {
  public path = '/packages';
  public router = Router();
  private packageService = packageService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const sellerAccessLevel = [UserRole.Seller, UserRole.Admin]
    this.router.post(`${this.path}/purchase`, [...authroize(sellerAccessLevel), validate(PurchasePackageDto)], this.purchasePackage);
  }

  private purchasePackage = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const purchasePackageDto = req.body as PurchasePackageDto;
    try {
      const bill = await this.packageService.purchasePackage(user, purchasePackageDto);
      res.status(201).send({
        status: 201,
        message: 'purchase the package successfully',
        metaData: bill
      });
    } catch(error) {
      next(error);
    }
  }
}

export default new PackageController();