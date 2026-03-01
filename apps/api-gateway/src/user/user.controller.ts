import { CreateUserPositionDto } from '@app/shared/users/dto/user-position.dto';
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
} from '@app/shared/users/dto/user.dto';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Post('positions')
  createUserPosition(@Body() dto: CreateUserPositionDto) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'create-user-position' }, dto),
    );
  }

  @Get('positions')
  getUserPositions() {
    return firstValueFrom(
      this.userClient.send({ cmd: 'get-user-positions' }, {}),
    );
  }

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return firstValueFrom(this.userClient.send({ cmd: 'create-user' }, dto));
  }

  @Patch('change-password/:id')
  changePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'change-password' }, { id, ...dto }),
    );
  }

  @Patch(':id')
  updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDto,
    @Req() req,
  ) {
    const actorId = req.user.id;

    return firstValueFrom(
      this.userClient.send({ cmd: 'update-user' }, { id, actorId, ...dto }),
    );
  }

  @Get(':id')
  getUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return firstValueFrom(this.userClient.send({ cmd: 'get-user' }, id));
  }

  @Get()
  getUsers() {
    return firstValueFrom(this.userClient.send({ cmd: 'get-users' }, {}));
  }
}
