import { IsString, IsEmail } from "class-validator";

class AuthenticateDto {
  @IsString()
  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง'})
  public email: string;

  @IsString()
  public password: string;
}

export default AuthenticateDto;