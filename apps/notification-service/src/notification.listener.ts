import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationServiceService } from './notification-service.service';

@Controller()
export class NotificationServiceListener {
  constructor(
    private readonly notificationService: NotificationServiceService,
  ) {}

  @MessagePattern('user.updated.notify')
  handleUserUpdated(
    @Payload() data: { userId: string; message: string; changes: any },
  ) {
    this.notificationService.notify(data.userId, {
      type: 'USER_UPDATED',
      message: data.message,
      changes: data.changes,
    });
  }
}
