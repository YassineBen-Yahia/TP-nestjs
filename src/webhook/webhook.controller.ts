import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Webhook } from './entities/webhook.entity';

@Controller('webhooks')
@UseGuards(JwtAuthGuard)
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async create(
    @Body() createWebhookDto: CreateWebhookDto,
    @Request() req,
  ): Promise<Webhook> {
    return await this.webhookService.create(createWebhookDto, req['user']);
  }

  @Get()
  async findAll(@Request() req): Promise<Webhook[]> {
    return await this.webhookService.findAll(req['user']);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<Webhook> {
    return await this.webhookService.findOne(+id, req['user']);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWebhookDto: UpdateWebhookDto,
    @Request() req,
  ): Promise<Webhook> {
    return await this.webhookService.update(+id, updateWebhookDto, req['user']);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return await this.webhookService.remove(+id, req['user']);
  }
}
