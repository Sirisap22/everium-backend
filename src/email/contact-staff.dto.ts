import { IsString } from "class-validator";

class ContactStaffDto {
  @IsString()
  senderName: string

  @IsString()
  email: string

  @IsString()
  topic: string

  @IsString()
  message: string
}

export default ContactStaffDto;