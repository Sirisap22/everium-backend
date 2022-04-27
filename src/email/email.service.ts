import { createTransport, Transporter, SentMessageInfo } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import handlebars from 'handlebars';
import { promises as fs } from 'fs';
import path from 'path';

import UnknownException from '../exceptions/UnknownException';
import ContactStaffDto from './contact-staff.dto';
import VerifySellerDto from '../users/verify-seller.dto';
import ConfirmSellerDto from './confirm-seller.dto';

class EmailService {
  private transporter: Transporter<SentMessageInfo>;

  constructor() {
    this.transporter = createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
    });
  }

  public async sendRegisterVerificationEmail(recieverEmail: string, verificationToken: string) {
    const html = await this.readTemplateFile('./register-verification.hbs');
    const data = {
      clientUrl: process.env.CLIENT_URL,
      verificationToken,
    }
    const htmlToSend = this.complieHtmlTemplate(html, data)
    const emailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: recieverEmail,
      subject: '[Everium] ยืนยันอีเมล',
      text: '[Everium] ยืนยันอีเมล',
      html: htmlToSend
    }
    return await this.sendEmail(emailOptions);
  }

  public async sendResetPasswordEmail(recieverEmail: string, resetToken: string) {
    const html = await this.readTemplateFile('./reset-password.hbs');
    const data = {
      clientUrl: process.env.CLIENT_URL,
      resetToken,
    }
    const htmlToSend = this.complieHtmlTemplate(html, data);
    const emailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: recieverEmail,
      subject: '[Everium] เปลี่ยนรหัสผ่าน',
      text: '[Everium] เปลี่ยนรหัสผ่าน',
      html: htmlToSend
    }
    return await this.sendEmail(emailOptions);
  }

  public async sendToStaff(contactStaffDto: ContactStaffDto) {
    const html = await this.readTemplateFile('./contact-staff.hbs');
    const { senderName, email, topic, message } = contactStaffDto;
    const data = {
      email,
      senderName,
      topic,
      message
    }
    const htmlToSend = this.complieHtmlTemplate(html, data)
    const emailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.STAFF_EMAIL,
      subject: topic,
      text: message,
      html: htmlToSend
    }
    return await this.sendEmail(emailOptions);
  }

  public async sendVerifySellerToStaff(verifySellerDto: VerifySellerDto, verifySellerToken: string) {
    const html = await this.readTemplateFile('./verify-seller.hbs');
    const { firstName, lastName, citizenId, phoneNumber } = verifySellerDto;
    const data = {
      clientUrl: process.env.API_URL,
      firstName,
      lastName,
      citizenId,
      phoneNumber,
      verifySellerToken
    }
    const htmlToSend = this.complieHtmlTemplate(html, data)
    const emailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.STAFF_EMAIL,
      subject: `${firstName} ${lastName} ต้องการเป็นผู้ขาย`,
      text: `${phoneNumber}`,
      html: htmlToSend
    }
    return await this.sendEmail(emailOptions);
  }

  public async sendConfirmSellerToUser(confirmSellerDto: ConfirmSellerDto) {
    const html = await this.readTemplateFile('./confirm-seller.hbs');
    const { firstName, lastName, phoneNumber, email } = confirmSellerDto;
    const data = {
      firstName,
      lastName,
      phoneNumber,
    }
    const htmlToSend = this.complieHtmlTemplate(html, data)
    const emailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: `[Everium] ${firstName} ${lastName} ได้รับการยืนยันให้เป็นผู้ขายเรียบร้อยแล้ว`,
      text: `${phoneNumber}`,
      html: htmlToSend
    }
    return await this.sendEmail(emailOptions);

  }

  private async sendEmail(mailOptions: Mail.Options): Promise<SentMessageInfo> {
    const info: SentMessageInfo = await this.transporter.sendMail(mailOptions).catch((error: Error) => {
      throw new UnknownException(error.message);
    });

    return info;
  }

  private async readTemplateFile(relativePath: string) {
    return await fs.readFile(path.resolve(__dirname, relativePath), 'utf8');
  }

  private complieHtmlTemplate(html: string, data: {[key: string]: unknown}) {
    const template = handlebars.compile(html);
    return template(data);
  }

}

export default new EmailService();