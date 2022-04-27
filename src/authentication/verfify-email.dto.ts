import { IsString } from "class-validator";
import { isValidChecksum } from "./token.validator";

class VerifyEmailDto {
  @IsString()
  @isValidChecksum({ message: 'verification token ไม่ถูกรูปแบบ' })
  verificationToken: string;
}

export default VerifyEmailDto;