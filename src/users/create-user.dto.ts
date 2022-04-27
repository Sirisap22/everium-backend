import { IsEmail, IsString } from 'class-validator';

class CreateUserDto {
  @IsString()
  public username: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง'})
  public email: string;

  @IsString()
  public password: string;
  
}

export default CreateUserDto;