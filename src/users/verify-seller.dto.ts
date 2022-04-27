import { IsString } from "class-validator";

class VerifySellerDto {
  @IsString()
  firstName: string;
  
  @IsString()
  lastName: string;

  @IsString()
  citizenId: string;

  // citizenIdVerificationImage: Express.Multer.File;

  @IsString()
  phoneNumber: string;
}

export default VerifySellerDto;