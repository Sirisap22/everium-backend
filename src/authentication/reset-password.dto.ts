import { IsString } from "class-validator";
import { isValidChecksum } from "./token.validator";

class ResetPasswordDto {
  @IsString()
  @isValidChecksum({ message: 'rest token ไม่ถูกรูปแบบ'})
  resetToken: string;

  @IsString()
  password: string;
}

export default ResetPasswordDto;