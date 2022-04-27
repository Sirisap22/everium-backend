import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import PostStatus from './post-status.enum';

class UpdatePostDto {
  @IsString()
  postId: string;

  @IsString()
  postName: string;

  @IsString()
  realEstate: string; 

  @IsString({ each: true })
  detail: string[];

  @IsString()
  type: string;

  @IsString()
  contractType: string;

  @IsString()
  price: string;

  @IsString()
  pricePerMonth: string;

  images: Express.Multer.File[];

  @IsString()
  moreDetail: string;

  @IsEnum(PostStatus)
  status: PostStatus;
}

export default UpdatePostDto;