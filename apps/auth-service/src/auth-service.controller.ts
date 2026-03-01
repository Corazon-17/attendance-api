import { LoginDto } from '@app/shared/auth/dto/auth.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthServiceService } from './auth-service.service';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @MessagePattern({ cmd: 'login' })
  login(data: LoginDto) {
    return this.authServiceService.login(data);
  }

  @MessagePattern({ cmd: 'refresh-token' })
  refreshToken(token: string) {
    return this.authServiceService.refreshToken(token);
  }

  @MessagePattern({ cmd: 'me' })
  me(userId: string) {
    return this.authServiceService.me(userId);
  }
}
