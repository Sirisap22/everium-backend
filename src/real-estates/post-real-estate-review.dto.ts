import { IsNumberString, IsString } from "class-validator";

class PostRealEstateReviewDto {
  @IsString()
  comment: string;

  @IsNumberString()
  star: string;
}

export default PostRealEstateReviewDto;