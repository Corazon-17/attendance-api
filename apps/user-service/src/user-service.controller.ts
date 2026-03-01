import { CreateUserPositionDto } from '@app/shared/users/dto/user-position.dto';
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
} from '@app/shared/users/dto/user.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './user-service.service';

@Controller('users')
export class UserServiceController {
  constructor(private readonly userService: UsersService) {}

  @MessagePattern({ cmd: 'create-user' })
  createUser(data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'update-user' })
  updateUser(data: { id: string; actorId: string } & UpdateUserDto) {
    return this.userService.updateUser(data);
  }

  @MessagePattern({ cmd: 'change-password' })
  changePassword(data: { id: string } & ChangePasswordDto) {
    return this.userService.changePassword(data);
  }

  @MessagePattern({ cmd: 'get-user' })
  getUser(id: string) {
    return this.userService.getUser(id);
  }

  @MessagePattern({ cmd: 'get-user-by-email' })
  getUserByEmail(data: { email: string }) {
    return this.userService.getUserByEmail(data.email);
  }

  @MessagePattern({ cmd: 'get-users' })
  getUsers() {
    return this.userService.getUsers();
  }

  @MessagePattern({ cmd: 'create-user-position' })
  createUserPosition(data: CreateUserPositionDto) {
    return this.userService.createUserPosition(data);
  }

  @MessagePattern({ cmd: 'get-user-positions' })
  getUserPositions() {
    return this.userService.getUserPositions();
  }
}
