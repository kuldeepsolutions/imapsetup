import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ImapsController } from './imaps.controller';
import { ImapsService } from './imaps.service';
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ImapsController],

  providers: [ImapsService],
})
export class ImapsModule {}
