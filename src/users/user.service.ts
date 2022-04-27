import { verify } from "jsonwebtoken";
import PackageType from "../packages/package-type.enum";
import UserRole from './user-role.enum';
import packageModel from "../packages/package.model";
import UpdateUserDto from "./update-user.dto";
import User from "./user.interface";
import userModel from "./user.model";
import VerifySellerDto from "./verify-seller.dto";
import * as tokenizer from '../utils/tokenizer.utils';
import NotFoundException from '../exceptions/NotFoundException';
import emailService from "../email/email.service";
import ConfirmSellerDto from "../email/confirm-seller.dto";

class UserService {
  private userModel = userModel;
  private packageModel = packageModel;
  private emailService = emailService;

  public async getPublicProfile(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user)
      throw new NotFoundException(`ไม่พบผู้ใช้งานที่มีไอดี ${userId} ในระบบ`)

    return {
      profileImage: user.profileImage ?? null,
      username: user.username
    }
  }

  public getUserProfile(user: User) {
    return user
  }

  public async updateUserProfile(user: User, updateUserDto: UpdateUserDto) {
    const { profileImage } = updateUserDto;
    if (profileImage) {
      const updatedUser = await this.userModel.findByIdAndUpdate(user._id, {
        ...updateUserDto,
        profileImage: this.imageFileToImagePath(profileImage)
      }, { new: true })
      return updatedUser;
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(user._id, updateUserDto, { new: true });
    return updatedUser;
  }

  public async verifySeller(user: User, verifySellerDto: VerifySellerDto) {
    // do not upgrade role from consumer to seller right away wait for admin to approve 
    // const { citizenIdVerificationImage } = verifySellerDto;
    // if (citizenIdVerificationImage) {
    //   await user.updateOne({
    //     ...verifySellerDto,
    //     citizenIdVerificationImage: this.imageFileToImagePath(citizenIdVerificationImage)
    //   });
    // } else {
    //   await user.updateOne(verifySellerDto);
    // }

    const verifySellerToken = tokenizer.generateToken()
    const updateData = {
      ...verifySellerDto,
      verifySellerToken
    }
    await user.updateOne(updateData);
    //send email to staff
    await this.emailService.sendVerifySellerToStaff(verifySellerDto, verifySellerToken)
  }

  public async promoteToSeller(verifySellerToken: string) {
    const user = await this.userModel.findOne({ verifySellerToken })
    if (!user)
      throw new NotFoundException(`user with token ${verifySellerToken} not found`)
    // promote to seller
    await user.updateOne({ role: UserRole.Seller });
    // send email to user
    const { firstName, lastName, phoneNumber, email } = user;
    const confirmSellerDto = {
      email,
      firstName,
      lastName,
      phoneNumber
    } as ConfirmSellerDto;
    await this.emailService.sendConfirmSellerToUser(confirmSellerDto);
  }

  private imageFileToImagePath(image: Express.Multer.File) {
    const splitedPath = image.path.split('/uploads/');
    return `uploads/${splitedPath[splitedPath.length - 1]}`
  }

}

export default new UserService();