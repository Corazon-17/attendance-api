import { Controller, Req, Sse, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'apps/api-gateway/src/auth/jwt/jwt.guard';
import { NotificationServiceService } from './notification-service.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationServiceController {
  constructor(
    private readonly notificationService: NotificationServiceService,
  ) {}

  @Sse('user-updated')
  notifyUserUpdated(@Req() req) {
    const userId = req.user.id;
    const stream = this.notificationService.register(userId);

    req.on('close', () => {
      this.notificationService.remove(userId);
    });

    return stream;
  }
}
