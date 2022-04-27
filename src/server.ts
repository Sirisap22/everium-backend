import 'dotenv/config';
import adminController from './admin/admin.controller';
import App from './app';
import authenticationController from './authentication/authentication.controller';
import emailController from './email/email.controller';
import packageController from './packages/package.controller';
import postController from './posts/post.controller';
import realEstateController from './real-estates/real-estate.controller';
import userController from './users/user.controller';

const app = new App([
  authenticationController,
  userController,
  postController,
  adminController,
  packageController,
  emailController,
  realEstateController
]);

app.listen();