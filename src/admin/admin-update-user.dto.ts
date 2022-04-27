import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import Package from "../packages/package.interface";
import UserRole from "../users/user-role.enum";

class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsNumber()
  usedPromote?: number;

  @IsOptional()
  @IsNumber()
  createdPosts?: number;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  citizenId?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  package?: Package;
}

export default AdminUpdateUserDto;