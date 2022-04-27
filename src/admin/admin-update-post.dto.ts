import { IsOptional, IsString } from "class-validator";
import PostStatus from "../posts/post-status.enum";

class AdminUpdatePostDto {
  @IsOptional()
  @IsString()
  author?: string; 

  @IsOptional()
  @IsString()
  status?: PostStatus;

  @IsOptional()
  @IsString()
  postName?: string

  @IsOptional()
  @IsString()
  realEstateName?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  contractType?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  moreDetail?: string;

}

export default AdminUpdatePostDto;