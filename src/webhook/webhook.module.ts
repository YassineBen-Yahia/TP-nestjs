import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { WebhookListener } from './webhook.listener';
import { Webhook } from './entities/webhook.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Webhook]),
    HttpModule,
    AuthModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookService, WebhookListener],
})
export class WebhookModule {}
