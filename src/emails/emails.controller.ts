// emails.controller.ts

import { Controller, Get } from '@nestjs/common';
import { EmailService } from './emails.service';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailService: EmailService) {}

  @Get('fetch')
  async getAllEmails(): Promise<any[]> {
    return this.emailService.fetchAllEmails();
  }
}
