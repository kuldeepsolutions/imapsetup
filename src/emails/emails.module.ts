// emails.module.ts

import { Module } from '@nestjs/common';
import { EmailService } from './emails.service';

@Module({
  providers: [EmailService],
})
export class EmailsModule {}
