import { Injectable, MessageEvent } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class NotificationServiceService {
  private clients = new Map<string, Subject<MessageEvent>>();

  register(userId: string) {
    const subject = new Subject<MessageEvent>();
    this.clients.set(userId, subject);
    return subject.asObservable();
  }

  remove(userId: string) {
    this.clients.delete(userId);
  }

  notify(userId: string, payload: any) {
    const client = this.clients.get(userId);
    if (client) {
      client.next({ data: payload });
    }
  }
}
