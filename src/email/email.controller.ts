import { NextFunction, Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
import validate from '../middlewares/validation.middleware';
import ContactStaffDto from "./contact-staff.dto";
import emailService from "./email.service";

class EmailController implements Controller {
  public path = '/email';
  public router = Router();
  private emailService = emailService;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/contact-staff`, validate(ContactStaffDto), this.sendEmailToStaff);
  }

  private sendEmailToStaff = async (req: Request, res: Response, next: NextFunction) => {
    const contactStaffDto = req.body as ContactStaffDto;
    try {
      await this.emailService.sendToStaff(contactStaffDto)
      res.status(200).send({
        state: 200,
        message: 'send email to staff successfully'
      })
    } catch(error) {
      next(error);
    }
  }
}

export default new EmailController();