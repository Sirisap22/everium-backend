import { Router, Request, Response, NextFunction  } from "express";
import Controller from "../interfaces/controller.interface";
import authorize from "../middlewares/authorization.middelware";
import upload from "../middlewares/upload.middleware";
import validate from "../middlewares/validation.middleware";
import UserRole from "../users/user-role.enum";
import User from "../users/user.interface";
import { excludeRoles } from "../utils/authorizer.utils";
import CreatePostDto from "./create-post.dto";
import GetPostsFilterDto from "./get-posts-filter.dto";
import GetPostsDto from "./get-posts-filter.dto";
import postService from "./post.service";
import UpdatePostDto from "./update-post.dto";

class PostController implements Controller {
  public path = '/posts';
  public router = Router();
  private postService = postService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const sellerAccessLevel = excludeRoles([UserRole.Consumer]);

    this.router.get(`${this.path}/`, authorize(sellerAccessLevel), this.getPosts);
  
    this.router.get(`${this.path}/draft`, authorize(sellerAccessLevel), this.getDraftingPosts);
    this.router.post(`${this.path}/draft`, [...authorize(sellerAccessLevel), upload.array('images'), validate(CreatePostDto)],this.createDraftingPost);
    this.router.get(`${this.path}/draft/:id`, authorize(sellerAccessLevel), this.getDraftingPostById);
    this.router.patch(`${this.path}/draft/:id`, [...authorize(sellerAccessLevel), upload.array('images'), validate(UpdatePostDto, true)],this.updateDraftingPostById);
    this.router.delete(`${this.path}/draft/:id`, authorize(sellerAccessLevel), this.deleteDraftingPostById);

    this.router.get(`${this.path}/publish`, this.getPublishedPosts);
    this.router.get(`${this.path}/user-publish`, authorize(sellerAccessLevel), this.getUserPublishedPosts);
    this.router.post(`${this.path}/publish`, [...authorize(sellerAccessLevel), upload.array('images'), validate(CreatePostDto)], this.createPublishedPost);
    this.router.get(`${this.path}/publish/:id`, this.getPublishedPostById);
    this.router.patch(`${this.path}/publish/:id`, [...authorize(sellerAccessLevel), upload.array('images') ,validate(UpdatePostDto, true)],this.updatePublishedPostById);
    this.router.delete(`${this.path}/publish/:id`, authorize(sellerAccessLevel), this.deletePublishedPostById);

    this.router.get(`${this.path}/suspend`, authorize(sellerAccessLevel), this.getSuspendedPosts);
    this.router.get(`${this.path}/suspend/:id`, authorize(sellerAccessLevel), this.getSuspendedPostById);
    this.router.delete(`${this.path}/suspend/:id`, authorize(sellerAccessLevel), this.deleteSuspendedPostById);

    this.router.get(`${this.path}/promote-publish/:id`, authorize(sellerAccessLevel), this.promotePublishedPostById);
    this.router.get(`${this.path}/popular-publish`, this.getPublishedPostsSortedByViews);
  }

  private getPosts = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    try {
      const posts = await this.postService.getPosts(user);
      res.status(200).send({
        status: 200,
        message: 'get posts successfully',
        metaData: posts
      })
    } catch(error) {
      next(error);
    }
  } 

  private getUserPublishedPosts = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    try {
      const posts = await this.postService.getUserPublishedPosts(user);
      res.status(200).send({
        status: 200,
        message: 'get posts successfully',
        metaData: posts
      });
    } catch(error) {
      next(error);
    }
  }

  private getDraftingPosts = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    try {
      const posts = await this.postService.getDraftingPosts(user);
      res.status(200).send({
        status: 200,
        message: 'get drafting posts successfully',
        metaData: posts
      })
    } catch(error) {
      next(error)
    }
  }

  private createDraftingPost = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const createPostDto = {
      ...req.body,
      images: req.files
    } as CreatePostDto;
    try {
      const post = await this.postService.createDraftingPost(user, createPostDto);
      res.status(201).send({
        status: 201,
        message: 'create drafting posts successfully',
        metaData: post
      })
    } catch(error) {
      next(error)
    }
  }

  private getDraftingPostById = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const postId = req.params.id as string;
    try {
      const post = await this.postService.getDraftingPostById(user, postId);
      res.status(200).send({
        status: 200,
        message: 'get the post successfully',
        metaData: post
      })
    } catch(error) {
      next(error)
    }
  }

  private updateDraftingPostById = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const postId = req.params.id as string;
    const updateData = req.body= {
      ...req.body,
      images: req.files
    } as Partial<UpdatePostDto>;
    try {
      const post = await this.postService.updateDraftingPostById(user, postId, updateData);
      res.status(200).send({
        status: 200,
        message: 'update the drafting post successfully',
        metaData: post
      })
    } catch(error) {
      next(error)
    }
  }

  private deleteDraftingPostById = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const postId = req.params.id as string;
    try {
      await this.postService.deleteDraftingPostById(user, postId);
      res.status(200).send({
        status: 200,
        message: ' delete the drafting post successfully',
      })
    } catch(error) {
      next(error)
    }
  }

  private getPublishedPosts = async (req: Request, res: Response, next: NextFunction) => {
    const getPostsFilterDto = req.query as GetPostsFilterDto;
    try {
      const posts = await this.postService.getPublishedPosts(getPostsFilterDto);
      res.status(200).send({
        status: 200,
        message: 'get published posts successfully',
        metaData: posts
      })
    } catch(error) {
      next(error)
    }
  }

  private createPublishedPost = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const createPostDto = {
      ...req.body,
      images: req.files
    } as CreatePostDto;
    try {
      const post = await this.postService.createPublishedPost(user, createPostDto);
      res.status(201).send({
        status: 201,
        message: 'create the published post successfully',
        metaData: post
      })
    } catch(error) {
      next(error)
    }
  }

  private getPublishedPostById = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id as string;
    try {
      const posts = await this.postService.getPublishedPostById(postId);
      res.status(200).send({
        status: 200,
        message: 'get the published post successfully',
        metaData: posts
      })
    } catch(error) {
      next(error)
    }
  }

  private updatePublishedPostById = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const postId = req.params.id as string;
    const updateData = {
      ...req.body,
      images: req.files
    } as Partial<UpdatePostDto>;
    try {
      const post = await this.postService.updatePublishedPostById(user, postId, updateData);
      res.status(200).send({
        status: 200,
        message: 'update the published post successfully',
        metaData: post
      })
    } catch(error) {
      next(error)
    }
  }

  private deletePublishedPostById = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const postId = req.params.id as string;
    try {
      await this.postService.deletePublishedPostById(user, postId);
      res.status(200).send({
        status: 200,
        message: 'delete the published post successfully',
      })
    } catch(error) {
      next(error)
    }
  }

  private getSuspendedPosts = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    try {
      const posts = await this.postService.getSuspendedPosts(user);
      res.status(200).send({
        status: 200,
        message: 'get suspended posts successfully',
        metaData: posts
      })
    } catch(error) {
      next(error)
    }
  }

  private getSuspendedPostById = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const postId = req.params.id as string;
    try {
      const posts = await this.postService.getSuspendedPostsById(user, postId);
      res.status(200).send({
        status: 200,
        message: 'get the suspended post successfully',
        metaData: posts
      })
    } catch(error) {
      next(error)
    }
  }

  private deleteSuspendedPostById = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const postId = req.params.id as string;
    try {
      const posts = await this.postService.deleteSuspendedPostById(user, postId);
      res.status(200).send({
        status: 200,
        message: 'delete the suspended post successfully',
        metaData: posts
      })
    } catch(error) {
      next(error)
    }
  }

  private promotePublishedPostById = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const postId = req.params.id as string;
    try {
      const post = await this.postService.promotePublishedPostById(user, postId);
      res.status(200).send({
        status: 200,
        message: 'promote the published post successfully',
        metaData: post
      })
    } catch(error) {
      next(error);
    }
  }

  private getPublishedPostsSortedByViews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await this.postService.getPublishedPostsSortedByViews();
      res.status(200).send({
        status: 200,
        message: 'get popular posts successfully',
        metaData: posts
      })
    } catch(error) {
      next(error);
    }
  }

}

export default new PostController();