import { IsString, IsEmail } from 'class-validator';

class ConfirmSellerDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;
}

export default ConfirmSellerDto;