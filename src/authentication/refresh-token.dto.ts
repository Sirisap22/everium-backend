import { IsString } from "class-validator";
import { isValidChecksum } from "./token.validator";

class RefreshTokenDto {
  @IsString()
  @isValidChecksum({ message: 'refresh token ไม่ถูกรูปแบบ'})
  refreshToken: string;
}

export default RefreshTokenDto;