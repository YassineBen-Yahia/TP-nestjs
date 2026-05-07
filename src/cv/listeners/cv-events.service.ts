import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

export type CvEventPayload = {
  type: string;
  cvId: number;
  userId: number;
  timestamp: string;
  details?: any;
};

@Injectable()
export class CvEventsService {
  private subject = new Subject<CvEventPayload>();
  private history: CvEventPayload[] = [];

  emit(event: CvEventPayload) {
    this.history.push(event);
    this.subject.next(event);
  }

  get events$(): Observable<CvEventPayload> {
    return this.subject.asObservable();
  }

  getHistory(): CvEventPayload[] {
    return [...this.history].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  }

  getHistoryForUser(userId: number): CvEventPayload[] {
    return this.getHistory().filter((h) => h.userId === userId);
  }
}
