import { IsOptional, IsString } from 'class-validator';

class UpdateUserDto {
  @IsOptional()
  public profileImage?: Express.Multer.File;

  @IsOptional()
  @IsString()
  public username?: string;

  // @IsOptional()
  // @IsString()
  // firstName?: string;

  // @IsOptional()
  // @IsString()
  // lastName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

export default UpdateUserDto;