import { updateUserForAdminDto } from '@app/shared/users/dto/user.dto';
import {
  Body,
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,
  ) {}

  @Patch('users/:id')
  clockIn(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: updateUserForAdminDto,
    @Req() req,
  ) {
    const actorId = req.user.id;

    return firstValueFrom(
      this.userClient.send(
        { cmd: 'update-user-for-admin' },
        { id, actorId, ...dto },
      ),
    );
  }
}
