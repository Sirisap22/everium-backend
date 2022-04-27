import { NextFunction, Request, Response, Router } from 'express';

import Controller from '../interfaces/controller.interface';
import UserRole from '../users/user-role.enum';
import authorize from '../middlewares/authorization.middelware';
import validate from '../middlewares/validation.middleware';
import AdminUpdatePostDto from './admin-update-post.dto';
import adminService from './admin.service';
import AdminUpdateUserDto from './admin-update-user.dto';
import GetPostsFilterDto from '../posts/get-posts-filter.dto';
import AdminGetUserFilterDto from './admin-get-user-filter.dto';

class AdminController implements Controller {
  public path = '/admin';
  public router = Router();
  private adminService = adminService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const adminAccessLevel = [UserRole.Admin];

    this.router.get(`${this.path}/seller-candidates`, authorize(adminAccessLevel), this.getSellerCandidates);

    this.router.get(`${this.path}/users`, [...authorize(adminAccessLevel)], this.getUsers);
    this.router.get(`${this.path}/users/:id`, authorize(adminAccessLevel), this.getUserById);
    this.router.patch(`${this.path}/users/:id`, [...authorize(adminAccessLevel), validate(AdminUpdateUserDto)], this.updateUserById);
    this.router.delete(`${this.path}/users/:id`, authorize(adminAccessLevel), this.deleteUserById);

    this.router.get(`${this.path}/posts`, [...authorize(adminAccessLevel)], this.getPosts);
    this.router.get(`${this.path}/posts/:id`, authorize(adminAccessLevel), this.getPostById);
    this.router.patch(`${this.path}/posts/:id`, [...authorize(adminAccessLevel), validate(AdminUpdatePostDto)], this.updatePostById);
    this.router.delete(`${this.path}/posts/:id`, authorize(adminAccessLevel), this.deletePostById);
  }

  private getSellerCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidates = await this.adminService.getSellerCandidates();
      res.status(200).send({
        status: 200,
        message: 'get seller candidates successfully',
        metaData: candidates
      });
    } catch(error) {
      next(error);
    }
  } 

  private getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const adminGetUserFilterDto = req.query as AdminGetUserFilterDto;
    try {
      const users = await this.adminService.getUsers(adminGetUserFilterDto);
      res.status(200).send({
        status: 200,
        message: 'get users successfully',
        metaData: users
      });
    } catch(error) {
      next(error);
    }
  }

  private getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string
    try {
      const user = await this.adminService.getUserById(userId);
      res.status(200).send({
        status: 200,
        message: 'get the user successfully',
        metaData: user
      });
    } catch(error) {
      next(error);
    }
  }

  private updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;
    const adminUpdateUserDto = req.body as AdminUpdateUserDto;
    try {
      const user = await this.adminService.updateUserById(userId, adminUpdateUserDto);
      res.status(200).send({
        status: 200,
        message: 'update the user successfully',
        metaData: user
      });
    } catch(error) {
      next(error);
    }
  }

  private deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;
    try {
      await this.adminService.deleteUserById(userId);
      res.status(200).send({
        status: 200,
        message: 'delete the user successfully',
      });
    } catch(error) {
      next(error);
    }
  }

  private getPosts = async (req: Request, res: Response, next: NextFunction) => {
    const getPostFiltersDto = req.query as GetPostsFilterDto;
    try {
      const posts = await this.adminService.getPosts(getPostFiltersDto);
      res.status(200).send({
        status: 200,
        message: 'get posts successfully',
        metaData: posts
      })
    } catch(error) {
      next(error);
    }
  }

  private getPostById = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id as string;
    try {
      const post = await this.adminService.getPostById(postId);
      res.status(200).send({
        status: 200,
        message: 'get the post successfully',
        metaData: post
      });
    } catch(error) {
      next(error);
    }
  }

  private updatePostById = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id as string;
    const adminUpdatePostDto = req.body as AdminUpdatePostDto;
    try {
      const post = await this.adminService.updatePostById(postId, adminUpdatePostDto);
      res.status(200).send({
        status: 200,
        message: 'update the post successfully',
        metaData: post
      })
    } catch(error) {
      next(error);
    }
  }

  private deletePostById = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id as string;
    try {
      await this.adminService.deletePostById(postId);
      res.status(200).send({
        status: 200,
        message: 'delete the post successfully'
      });
    } catch(error) {
      next(error);
    }
  }

}

export default new AdminController();
