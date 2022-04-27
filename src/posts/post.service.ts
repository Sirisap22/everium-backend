import { unlinkSync } from 'fs'
import ForbiddenException from "../exceptions/ForbiddenException";
import NotFoundException from "../exceptions/NotFoundException";
import User from "../users/user.interface";
import CreatePostDto from "./create-post.dto";
import Post from "./post.interface";
import postModel from "./post.model";
import UpdatePostDto from "./update-post.dto";
import PostStatus from "./post-status.enum";
import GetPostsFilterDto from './get-posts-filter.dto';

class PostService {
  public postModel = postModel;

  public async getPosts(user: User) {
    const posts = await this.postModel.find({ author: user._id });
    return posts;
  }

  public async getUserPublishedPosts(user: User) {
    const posts = await this.postModel.find({ author: user._id, status: PostStatus.Published });
    return posts;
  }

  public async getPublishedPosts(getPostsFilterDto: GetPostsFilterDto) {
    let { limit, realEstate } = getPostsFilterDto;
    const filters = {
      ...getPostsFilterDto,
      limit: undefined,
      realEstate: undefined
    } as GetPostsFilterDto;

    delete filters.limit;
    delete filters.realEstate;

    const filtersRegex: {[key:string]: { $regex: RegExp } } = {}
    for(const [key, value] of Object.entries(filters)) {
      filtersRegex[key] =  { $regex: new RegExp(value, 'i')};
    }

    if (!limit) limit = '10';

    if (realEstate) {
      const posts = await this.postModel.find({ ...filtersRegex, realEstate, status: PostStatus.Published }).sort({ lastModified: -1 }).limit(parseInt(limit)).populate('author').populate('realEstate');
      return posts;
    }
    const posts = await this.postModel.find({ ...filtersRegex, status: PostStatus.Published }).sort({ lastModified: -1 }).limit(parseInt(limit)).populate('author').populate('realEstate');
    return posts;
  }

  public async getPublishedPostById(postId: string) {
    const post = await this.getPostById(postId, PostStatus.Published);
    await post.updateOne({ $inc: { 'views': 1 }});
    return post;
  }

  public async createPublishedPost(user: User, createPostDto: CreatePostDto) {
    const post = await this.createPost(user, PostStatus.Published, createPostDto);
    return post;
  }

  public async updatePublishedPostById(user: User, postId: string, updateData: Partial<UpdatePostDto>) {
    const post = await this.getPublishedPostByIdAndAuthor(user, postId);
    const updatedPost = await this.updatePost(post, updateData);
    return updatedPost;
  }

  public async deletePublishedPostById(user: User, postId: string) {
    const post = await this.getPublishedPostByIdAndAuthor(user, postId);
    await this.deletePost(user, post);
  }

  public async getDraftingPosts(user: User) {
    const posts = await this.postModel.find({ author: user._id, status: PostStatus.Drafting }).populate('realEstate');
    return posts;
  }

  public async getDraftingPostById(user: User, postId: string) {
    const post = await this.getPostByIdAndAuthor(user, postId, PostStatus.Drafting);
    return post;
  }

  public async createDraftingPost(user: User, createPostDto: CreatePostDto) {
    const post = await this.createPost(user, PostStatus.Drafting, createPostDto);
    return post;
  }

  public async updateDraftingPostById(user: User, postId: string, updateData: Partial<UpdatePostDto>) {
    const post = await this.getDraftingPostById(user, postId);
    const updatedPost = await this.updatePost(post, updateData);
    return updatedPost;
  }

  public async deleteDraftingPostById(user: User, postId: string) {
    const post = await this.getDraftingPostById(user, postId);
    await this.deletePost(user, post);
  }

  public async getSuspendedPosts(user: User) {
    const posts = await this.postModel.find({ author: user._id, status: PostStatus.Suspended }).populate('realEstate');
    return posts;
  }

  public async getSuspendedPostsById(user: User, postId: string) {
    const post = await this.getPostByIdAndAuthor(user, postId, PostStatus.Suspended);
    return post;
  }

  public async deleteSuspendedPostById(user: User, postId: string) {
    const post = await this.getPostByIdAndAuthor(user, postId, PostStatus.Suspended);
    await this.deletePost(user, post);
  }

  public async promotePublishedPostById(user: User, postId: string) {
    const post = await this.getPublishedPostByIdAndAuthor(user, postId);
    if (user.usedPromote >= user.promoteLimit) 
      throw new ForbiddenException('used promote exceed limit');
    await user.updateOne({$inc : {'usedPromote' : 1}});
    return await post.updateOne({ lastModified: new Date() }, { new: true })
  }

  public async getPublishedPostsSortedByViews() {
    return await this.postModel.find({ status: PostStatus.Published }).sort({ views: -1 }).limit(4).populate('author').populate('realEstate');
  }

  private async deletePost(user: User, post: Post) {
    await user.updateOne({$inc : {'createdPosts' : -1}});
    await post.deleteOne(); 
  }
  
  private async getPublishedPostByIdAndAuthor(user: User, postId: string) {
    const post = await this.getPostByIdAndAuthor(user, postId, PostStatus.Published);
    return post;
  }

  private async getPostByIdAndAuthor(author: User, postId: string, postStatus: PostStatus) {
    const authorId = author._id;
    const post = await this.postModel.findOne({ _id: postId , author: authorId , status: postStatus }).populate('author').populate('realEstate');

    if (!post)
      throw new NotFoundException(`post with id ${postId} not found`);
    
    return post;
  }

  private async getPostById(postId: string, postStatus: PostStatus) {
    const post = await this.postModel.findOne({ _id: postId, status: postStatus }).populate('author').populate('realEstate');

    if (!post)
      throw new NotFoundException(`post with id ${postId} not found`);
    
    return post;
  }

  private async createPost(author: User, postStatus: PostStatus, createPostDto: CreatePostDto) {
    const { images } = createPostDto;

    if (!(await this.isUserCanCreatePost(author))) {
      this.deleteUploadedFiles(images);
      throw new ForbiddenException('posts number exceed limit');
    }

    const imagesPath = images.map((image) => this.imageFileToImagePath(image));
    console.log(createPostDto);

    const post = new this.postModel({
      ...createPostDto,
      author: author._id,
      status: postStatus,
      images: imagesPath,
      publishDate: new Date(),
      lastModified: new Date(),
    })

    await author.updateOne({$inc : {'createdPosts' : 1}});
    await post.save();
    return post;
  }

  private async isUserCanCreatePost(user: User) {
    const postsCount = await this.postModel.countDocuments({ author: user._id });
    if (postsCount >= user.postLimit) {
      return false;
    }
    return true
  }

  private deleteUploadedFiles(files: Express.Multer.File[]) {
    for(let file of files) {
      unlinkSync(file.path);
    }
  }

  private async updatePost(post: Post, updateData: Partial<UpdatePostDto>) {
    const { status } = updateData;
    if (status && status === PostStatus.Suspended) throw new ForbiddenException('forbidden');
    const updatedPost = this.postModel.findByIdAndUpdate(post._id, updateData, { new: true });
    return updatedPost;
  }

  private imageFileToImagePath(image: Express.Multer.File) {
    const splitedPath = image.path.split('/uploads/');
    return `uploads/${splitedPath[splitedPath.length - 1]}`
  }

}

export default new PostService();