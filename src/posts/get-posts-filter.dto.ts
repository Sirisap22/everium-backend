import { IsNumberString, IsOptional, IsString } from "class-validator";

class GetPostsFilterDto {
  @IsOptional()
  @IsString()
  postNameTH?: string;

  @IsOptional()
  @IsString()
  realEstate?: string; //TODO เป็น id ของ real estate

  @IsOptional()
  @IsString({ each: true })
  detail?: string[];

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
  pricePerMonth?: string;

  @IsOptional()
  @IsString()
  moreDetailTH?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}

export default GetPostsFilterDto;