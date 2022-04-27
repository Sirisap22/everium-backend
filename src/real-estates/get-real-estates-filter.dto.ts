import { IsNumberString, IsOptional, IsString } from "class-validator";

class GetRealEstatesFilterDto {
  @IsOptional()
  @IsNumberString()
  limit?: string;


  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsNumberString()
  averageStar?: string;
}

export default GetRealEstatesFilterDto;