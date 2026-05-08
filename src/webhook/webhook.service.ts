import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Webhook } from './entities/webhook.entity';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { User } from '../user/entities/user.entity';
import { CvEventPayload } from '../cv/listeners/cv-events.service';
import { UserRoleEnum } from '../enums/use-role.enum';

@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(Webhook)
    private webhookRepository: Repository<Webhook>,
    private readonly httpService: HttpService,
  ) {}

  async create(createWebhookDto: CreateWebhookDto, user: User): Promise<Webhook> {
    const webhook = this.webhookRepository.create({
      ...createWebhookDto,
      user,
    });
    return await this.webhookRepository.save(webhook);
  }

  async findAll(user: User): Promise<Webhook[]> {
    if (user.role === UserRoleEnum.ADMIN) {
      return await this.webhookRepository.find();
    }
    return await this.webhookRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async findOne(id: number, user: User): Promise<Webhook> {
    const webhook = await this.webhookRepository.findOne({ where: { id } });
    if (!webhook) {
      throw new NotFoundException(`Webhook with id ${id} not found`);
    }
    if (user.role !== UserRoleEnum.ADMIN && webhook.user.id !== user.id) {
      throw new ForbiddenException('You can only access your own webhooks');
    }
    return webhook;
  }

  async update(id: number, updateWebhookDto: UpdateWebhookDto, user: User): Promise<Webhook> {
    const webhook = await this.findOne(id, user);
    const updated = await this.webhookRepository.preload({ id: webhook.id, ...updateWebhookDto });
    return await this.webhookRepository.save(updated);
  }

  async remove(id: number, user: User): Promise<void> {
    const webhook = await this.findOne(id, user);
    await this.webhookRepository.remove(webhook);
  }

  async dispatch(event: CvEventPayload): Promise<void> {
    const webhooks = await this.webhookRepository.find({
      where: { isActive: true },
    });

    const targets = webhooks.filter((wh) => wh.events.includes(event.type) && (wh.user.id === event.userId || wh.user.role === UserRoleEnum.ADMIN));

    for (const webhook of targets) {
      try {
        await firstValueFrom(
          this.httpService.post(webhook.url, {
            event: event.type,
            cvId: event.cvId,
            userId: event.userId,
            timestamp: event.timestamp,
            details: event.details ?? null,
          }),
        );
        console.log(`Dispatched webhook "${event.type}" to ${webhook.url}`);
      } catch (err) {
        console.error(`Failed to call ${webhook.url}: ${err.message}`);
      }
    }
  }
}
