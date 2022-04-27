import { IsString } from "class-validator";

class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}

export default ChangePasswordDto;


