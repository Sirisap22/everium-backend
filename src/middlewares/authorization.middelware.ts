import jwt from 'express-jwt';
import { Request, Response, NextFunction } from 'express';
import userModel from '../users/user.model';
import UserRole from '../users/user-role.enum';
import UnauthorizedException from '../exceptions/UnauthorizedException';

function authorizationMiddleware(roles: UserRole[] = Object.values(UserRole)) {
  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwt({
      secret: process.env.JWT_SECRET || 'DEV_SECRET',
      algorithms: ['HS256'],
      getToken: function fromHeaderOrQuerystring(req: Request) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          const token = req.headers.authorization.split(' ')[1];
          return token;
        }
        return null;
      }
    }),

    // authorize based on user role
    async (req: Request, res: Response, next: NextFunction) => {
      // invalid jwt
      if (!req.user) {
        throw new UnauthorizedException('unauthorized');
      }

      const userId = (req.user as { id: string }).id;

      // user account is no longer exists
      const user = await userModel.findById(userId);
      if (!user) {
        next(new UnauthorizedException('unauthorized'));
        return;
      }

      // roles guard
      if (!roles.includes(user.role)) {
        next(new UnauthorizedException('unauthorized'));
        return;
      }

      // get user information to req
      if (user.package) {
        req.user = await user.populate('package');
      } else {
        req.user = user;
      }
      next();
    }
  ];
}

export default authorizationMiddleware;