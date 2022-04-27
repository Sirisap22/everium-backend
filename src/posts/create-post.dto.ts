import { IsString, MinLength, MaxLength } from 'class-validator';

class CreatePostDto {
  @IsString()
  @MinLength(1, {
    message: 'ชื่อประกาศ (ไทย) สั้นเกินไป (อย่างน้อย 1 ตัวอักษร)'
  })
  @MaxLength(150, {
    message: 'ชื่อประกาศ (ไทย) ยาวเกินไป (อย่างมาก 150 ตัวอักษร)'
  })
  postNameTH: string;

  @IsString()
  @MinLength(1, {
    message: 'ชื่อประกาศ (อังกฤษ) สั้นเกินไป (อย่างน้อย 1 ตัวอักษร)'
  })
  @MaxLength(150, {
    message: 'ชื่อประกาศ (อังกฤษ) ยาวเกินไป (อย่างมาก 150 ตัวอักษร)'
  })
  postNameEN: string;

  @IsString()
  realEstate: string; 

  @IsString({ each: true })
  detail: string[];

  @IsString()
  size: string;

  @IsString()
  floor: string;

  @IsString()
  bedRoom: string;
  
  @IsString()
  bathRoom: string;

  @IsString()
  type: string;

  @IsString()
  contractType: string;

  @IsString()
  price: string;

  @IsString()
  pricePerMonth: string;

  images: Express.Multer.File[];

  @IsString()
  @MinLength(1, {
    message: 'รายละเอียดเพิ่มเติม (ไทย) สั้นเกินไป (อย่างน้อย 1 ตัวอักษร)'
  })
  @MaxLength(150, {
    message: 'รายละเอียดเพิ่มเติม (ไทย) ยาวเกินไป (อย่างมาก 500 ตัวอักษร)'
  })
  moreDetailTH: string;

  @IsString()
  @MinLength(1, {
    message: 'รายละเอียดเพิ่มเติม (อังกฤษ) สั้นเกินไป (อย่างน้อย 1 ตัวอักษร)'
  })
  @MaxLength(150, {
    message: 'รายละเอียดเพิ่มเติม (อังกฤษ) ยาวเกินไป (อย่างมาก 500 ตัวอักษร)'
  })
  moreDetailEN: string;
}

export default CreatePostDto;