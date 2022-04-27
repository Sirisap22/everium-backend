import omi from 'omise';
import ConflictException from '../exceptions/ConflictException';
import UnknownException from '../exceptions/UnknownException';

import User from "../users/user.interface";
import userModel from "../users/user.model";
import billModel from "./bill.model";
import PackageType from "./package-type.enum";
import packageModel from "./package.model";
import PurchasePackageDto from "./purchase-package.dto";

class PackageService {
  public billModel = billModel;
  public packageModel = packageModel;
  public userModel = userModel;

  public async purchasePackage(user: User, purchasePackageDto: PurchasePackageDto) {
    const omise = omi({
    'publicKey': process.env.OMISE_PUBLIC_KEY as string,
    'secretKey': process.env.OMISE_SECRET_KEY as string
    });
    const { packageType , amount, token } = purchasePackageDto;

    if (user.package && !(user.package.type === PackageType.Starter && packageType === PackageType.Premium))
      throw new ConflictException('ผู้ใช้งานมี Package อยู่แล้ว')

    const customer = await omise.customers.create({
      email: user.email,
      description: user.username,
      card: token
    });

    const charge = await omise.charges.create({
      amount: amount,
      currency: "thb",
      customer: customer.id
    })

    if (charge.failure_message)
      throw new UnknownException(charge.failure_message);

    // if already have starter package and want to upgrade to premium delete the old one first
    if (user.package) {
      await this.packageModel.deleteMany({ owner: user._id })
    }
    
    const userPackage = new this.packageModel({
      owner: user._id,
      type: packageType
    })
    await userPackage.save();
    await user.updateOne({ package: userPackage._id }, { new: true });
    const bill = new this.billModel({
      owner: user._id,
      packageType: userPackage.type
    });

    await bill.save();
    return bill;
  }
}

export default new PackageService();