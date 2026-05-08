import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WebhookService } from './webhook.service';
import { APP_EVENTS } from '../cv/config/events.config';
import { CvEventPayload } from '../cv/listeners/cv-events.service';

@Injectable()
export class WebhookListener {
  constructor(private readonly webhookService: WebhookService) {}

  @OnEvent(APP_EVENTS.addedCv)
  handleAdded(payload: CvEventPayload) {
    this.webhookService.dispatch(payload);
  }

  @OnEvent(APP_EVENTS.updatedCv)
  handleUpdated(payload: CvEventPayload) {
    this.webhookService.dispatch(payload);
  }

  @OnEvent(APP_EVENTS.deletedCv)
  handleDeleted(payload: CvEventPayload) {
    this.webhookService.dispatch(payload);
  }

  @OnEvent(APP_EVENTS.restoredCv)
  handleRestored(payload: CvEventPayload) {
    this.webhookService.dispatch(payload);
  }
}
