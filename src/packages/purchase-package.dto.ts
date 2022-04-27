import { IsEnum, IsNumber, IsString } from "class-validator";
import PackageType from "./package-type.enum";

class PurchasePackageDto {
  @IsEnum(PackageType)
  packageType: PackageType;
  
  @IsNumber()
  amount: number;

  @IsString()
  token: string;
}

export default PurchasePackageDto;