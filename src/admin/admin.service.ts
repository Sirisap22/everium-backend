import NotFoundException from "../exceptions/NotFoundException";
import GetPostsFilterDto from "../posts/get-posts-filter.dto";
import postModel from "../posts/post.model";
import UserRole from "../users/user-role.enum";
import userModel from "../users/user.model";
import AdminGetUserFilterDto from "./admin-get-user-filter.dto";
import AdminUpdatePostDto from "./admin-update-post.dto";
import AdminUpdateUserDto from "./admin-update-user.dto";

class AdminService {
  private userModel = userModel;
  private postModel = postModel;

  public async getSellerCandidates() {
    const candidates = await this.userModel.find({  
      citizenId: { $exists: true, $ne: null },
      citizenIdVerificationImage: { $exists: true, $ne: null },
      role: UserRole.Consumer
    })

    return candidates;
  }

  public async getUsers(adminGetUserFilterDto: AdminGetUserFilterDto) {
    const users = await this.userModel.find();
    return users;
  }

  public async getUserById(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user)
      throw new NotFoundException(`the user with id ${userId} not found`);

    return user;
  }

  public async updateUserById(userId: string, adminUpdateUserDto: AdminUpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, adminUpdateUserDto, { new: true });
    return updatedUser;
  }

  public async deleteUserById(userId: string) {
    const user = await this.getUserById(userId);
    await user.deleteOne();
  }

  public async getPosts(getPostFiltersDto: GetPostsFilterDto) {
    const posts = await this.postModel.find();
    return posts;
  }

  public async getPostById(postId: string) {
    const post = await this.postModel.findById(postId);

    if (!post)
      throw new NotFoundException(`the post ith id ${postId} not found`);

    return post;
  }

  public async updatePostById(postId: string, adminUpdatePostDto: AdminUpdatePostDto) {
    const updatedPost = await this.postModel.findByIdAndUpdate(postId, adminUpdatePostDto, { new: true });
    return updatedPost;
  }

  public async deletePostById(postId: string) {
    const post = await this.getPostById(postId);
    await post.deleteOne();
  }
}


export default new AdminService();