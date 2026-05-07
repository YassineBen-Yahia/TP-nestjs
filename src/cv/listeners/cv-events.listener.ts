import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CvEventsService } from './cv-events.service';
import { APP_EVENTS } from '../config/events.config';

@Injectable()
export class CvEventsListener {
  constructor(private readonly events: CvEventsService) {}

  @OnEvent(APP_EVENTS.addedCv)
  handleAdded(payload: any) {
    console.log('[CvEvent][added]', payload);
    this.events.emit(payload);
  }

  @OnEvent(APP_EVENTS.updatedCv)
  handleUpdated(payload: any) {
    console.log('[CvEvent][updated]', payload);
    this.events.emit(payload);
  }

  @OnEvent(APP_EVENTS.deletedCv)
  handleDeleted(payload: any) {
    console.log('[CvEvent][deleted]', payload);
    this.events.emit(payload);
  }

  @OnEvent(APP_EVENTS.restoredCv)
  handleRestored(payload: any) {
    console.log('[CvEvent][restored]', payload);
    this.events.emit(payload);
  }
}
