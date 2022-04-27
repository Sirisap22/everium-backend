import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import authorize from '../middlewares/authorization.middelware';
import validate from '../middlewares/validation.middleware';
import CreateUserDto from '../users/create-user.dto';
import User from '../users/user.interface';
import AuthenticateDto from './authenticate.dto';
import authenticationService from './authentication.service';
import ChangePasswordDto from './change-password.dto';
import ForgotPasswordDto from './forgot-password.dto';
import RefreshTokenDto from './refresh-token.dto';
import ResetPasswordDto from './reset-password.dto';
import VerifyEmailDto from './verfify-email.dto';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private authenticationService = authenticationService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validate(CreateUserDto), this.register);
    this.router.post(`${this.path}/verify-email`, validate(VerifyEmailDto), this.verifyEmail);
    this.router.post(`${this.path}/forgot-password`, validate(ForgotPasswordDto), this.forgotPassword);
    this.router.post(`${this.path}/reset-password`, validate(ResetPasswordDto), this.resetPassword);
    this.router.post(`${this.path}/authenticate`, validate(AuthenticateDto), this.authenticate);
    this.router.post(`${this.path}/refresh-token`, [...authorize(), validate(RefreshTokenDto)], this.refreshToken);
    this.router.post(`${this.path}/revoke-token`, [...authorize(), validate(RefreshTokenDto)], this.revokeToken);
    this.router.post(`${this.path}/change-password`, [...authorize(), validate(ChangePasswordDto)], this.changePassword);
  }

  private register = async (req: Request, res: Response, next: NextFunction) => {
    const createUserDto: CreateUserDto = req.body;
    try {
      const user = await this.authenticationService.register(createUserDto);

      res.status(201).send({
        status: 201,
        message: 'user created and send verification to email successfully',
        metaData: {
          user
        }
      });
    } catch(error) {
      next(error);
    }
  }

  private verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const verifyEmailDto: VerifyEmailDto = req.body;
    try {
      await this.authenticationService.verifyEmail(verifyEmailDto);
      res.status(200).send({
        status: 200,
        message: 'email verified successfully'
      });
    } catch(error) {
      next(error);
    }
  }

  private authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authenticateDto: AuthenticateDto = req.body;
    try {
      const tokens = await this.authenticationService.authenticate(authenticateDto);
      res.status(200).send({
        status: 200,
        message: 'user authenticated successfully',
        metaData: {
          ...tokens
        }
      })
    } catch(error) {
      next(error);
    }
  }

  private refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshTokenDto: RefreshTokenDto = req.body;
    try {
      const tokens = await this.authenticationService.refreshToken(refreshTokenDto);
      res.status(201).send({
        status: 201,
        message: 'refresh token created successfully',
        metaData: {
          ...tokens
        }
      })
    } catch(error) {
      next(error);
    }
  }

  private revokeToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshTokenDto: RefreshTokenDto = req.body;
    try {
      await this.authenticationService.revokeToken(refreshTokenDto);
      res.status(200).send({
        status: 200,
        message: 'revoke token successfully',
      });
    } catch(error) {
      next(error);
    }
  }

  private forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const forgotPasswordDto: ForgotPasswordDto = req.body;
    try {
      await this.authenticationService.forgotPassword(forgotPasswordDto);
      res.status(200).send({
        status: 200,
        message: 'send reset password link to email successfully'
      });
    } catch(error) {
      next(error);
    }
  }
  
  private resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const resetPasswordDto: ResetPasswordDto = req.body;
    try {
      await this.authenticationService.resetPassword(resetPasswordDto);
      res.status(200).send({
        status: 200,
        message: 'reset password successfully'
      });
    } catch(error) {
      next(error);
    }
  }

  private changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const changePasswordDto: ChangePasswordDto = req.body;
    try {
      await this.authenticationService.changePassword(user, changePasswordDto);
      res.status(200).send({
        status: 200,
        message: 'changed password successfully',
      })
    } catch(error) {
      next(error);
    }
  }
  
}

export default new AuthenticationController();