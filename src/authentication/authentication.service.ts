import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import * as tokenizer from '../utils/tokenizer.utils';
import ConflictException from '../exceptions/ConflictException';
import CreateUserDto from '../users/create-user.dto';
import userModel from '../users/user.model';
import User from '../users/user.interface';
import emailService from '../email/email.service';
import VerifyEmailDto from './verfify-email.dto';
import BadRequestException from '../exceptions/BadRequestException';
import UserRole from '../users/user-role.enum';
import AuthenticateDto from './authenticate.dto';
import NotFoundException from '../exceptions/NotFoundException';
import ForbiddenException from '../exceptions/ForbiddenException';
import refreshTokenModel from './refresh-token.model';
import RefreshTokenDto from './refresh-token.dto';
import UnauthorizedException from '../exceptions/UnauthorizedException';
import ForgotPasswordDto from './forgot-password.dto';
import ResetPasswordDto from './reset-password.dto';
import ChangePasswordDto from './change-password.dto';

class AuthenticationService {
  public userModel = userModel;
  public refreshTokenModel = refreshTokenModel;
  private emailService = emailService;

  public async register(createUserDto: CreateUserDto) {
    const {
      username,
      email,
      firstName,
      lastName,
      password
    } = createUserDto;

    if (await this.userModel.findOne({ email }))
      throw new ConflictException(`มีผู้ใช้งานอีเมล ${email} อยู่แล้ว`);
    
    if (await this.userModel.findOne({ username }))
      throw new ConflictException(`มีผู้ใช้งาน Username ${username} อยู่แล้ว`);

    const hashedPassword = await this.hashPassword(password);

    const role = UserRole.Consumer;

    const verificationToken = tokenizer.generateToken();

    const user: User = new this.userModel({
      firstName,
      lastName,
      username,
      email,
      hashedPassword,
      role,
      verificationToken
    })

    await user.save();

    await this.emailService.sendRegisterVerificationEmail(email, verificationToken);

    return {
      firstName,
      lastName,
      username,
      email,
      role
    }
  }

  public async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { verificationToken } = verifyEmailDto;

    const user = await this.userModel.findOne({ verificationToken });

    if (!user)
      throw new BadRequestException('Verification Token ผิดรูปแบบ');

    user.verified = new Date();
    user.verificationToken = undefined;
    
    await user.save();
  }

  public async authenticate(authenticateDto: AuthenticateDto) {
    const {
      email,
      password
    } = authenticateDto;
    
    const user = await this.userModel.findOne({ email });

    if (!user)
      throw new NotFoundException(`ไม่พบอีเมล ${email}`);

    if (!user.isVerified)
      throw new NotFoundException(`ไม่พบอีเมล ${email}`);
    
    if (!bcrypt.compareSync(password, user.hashedPassword))
      throw new ForbiddenException('รหัสผ่านไม่ถูกต้อง');

    const jwtToken = this.generateUserJwtToken(user._id);
    const { token: refreshToken } = await this.generateUserRefreshToken(user._id);
  
    return {
      jwtToken,
      refreshToken
    };
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken: token } = refreshTokenDto;

    const refreshToken = await this.getRefreshToken(token);
    const { user } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = await this.generateUserRefreshToken(user._id);
    refreshToken.revoked = new Date();
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = this.generateUserJwtToken(user._id);

    return {
      jwtToken,
      refreshToken: newRefreshToken.token
    };
  }

  public async revokeToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken: token } = refreshTokenDto;
    const refreshToken = await this.getRefreshToken(token);
    refreshToken.revoked = new Date();
    return await refreshToken.save();
  }

  public async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userModel.findOne({ email });

    if (!user)
      return;
    
    // expires after 24 hour
    const alivetime = parseInt(process.env.RESET_EXPIRES_IN_DAYS || '1')
    const resetToken = tokenizer.generateToken();
    user.resetToken = {
      token: resetToken,
      expires: this.addDays(new Date(), alivetime)
    }

    await user.save();

    await this.emailService.sendResetPasswordEmail(email, resetToken);
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { resetToken, password } = resetPasswordDto;
    
    const user = await this.userModel.findOne({
      'resetToken.token': resetToken,
      'resetToken.expires': { $gt: new Date() }
    });

    if (!user)
      throw new BadRequestException('reset token รูปแบบไม่ถูกต้อง');

    user.hashedPassword = await this.hashPassword(password);
    user.resetToken = undefined;

    await user.save();
  }

  public async changePassword(user: User, changePassword: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePassword;

    if (!bcrypt.compareSync(oldPassword, user.hashedPassword))
      throw new ForbiddenException('รหัสผ่านไม่ถูกต้อง');

    const hashedNewPassword = await this.hashPassword(newPassword);

    await user.updateOne({ hashedPassword: hashedNewPassword });
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  private generateUserJwtToken(id: mongoose.Types.ObjectId) {
    return tokenizer.generateJwtToken({ id: id.toString() });
  }

  private async generateUserRefreshToken(id: mongoose.Types.ObjectId) {
    const refreshToken = tokenizer.generateToken();
    const alivetime = parseInt(process.env.REFRESH_EXPIRES_IN_DAYS || '7');

    // save refreshToken in database
    const newRefreshToken = new this.refreshTokenModel({
      user: id,
      token: refreshToken,
      expires: this.addDays(new Date(), alivetime),
      issued: new Date()
    });

    return await newRefreshToken.save();
  }

  private addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private async getRefreshToken(token: string) {
    // validated token with checksome
    if (!tokenizer.verifyId(token)) 
      throw new UnauthorizedException('กรุณาเข้าสู่ระบบก่อน');
    
    const refreshToken = await refreshTokenModel.findOne({ token });

    if (!refreshToken || !refreshToken.isActive) 
      throw new UnauthorizedException('access token ไม่ถูกรูปแบบหรือหมดอายู');
    
    return refreshToken;
  }

  

}

export default new AuthenticationService();