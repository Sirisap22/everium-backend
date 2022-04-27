import { IsEmail, IsString } from "class-validator";

class ForgotPasswordDto {
  @IsString()
  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง'})
  email: string;
}

export default ForgotPasswordDto;