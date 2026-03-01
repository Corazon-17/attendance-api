import { CreateUserPositionDto } from '@app/shared/users/dto/user-position.dto';
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
} from '@app/shared/users/dto/user.dto';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PasswordService } from 'libs/security/password.service';
import { v7 } from 'uuid';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private password: PasswordService,
    @Inject('AUDIT_SERVICE') private readonly auditClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}

  private buildChanges(
    before: Record<string, any>,
    after: Record<string, any>,
  ) {
    const changes: Record<string, any> = {};
    const commonKeys = Object.keys(after).filter((key) =>
      Object.hasOwn(before, key),
    );

    for (const key of commonKeys) {
      if (key === 'password') {
        continue;
      }

      if (before[key] !== after[key]) {
        changes[key] = {
          before: before[key],
          after: after[key],
        };
      }
    }

    return changes;
  }

  createUserPosition(dto: CreateUserPositionDto) {
    const uuidv7 = v7();

    return this.prisma.userPosition.create({
      data: {
        id: uuidv7,
        name: dto.name,
      },
    });
  }

  getUserPositions() {
    return this.prisma.userPosition.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async createUser(dto: CreateUserDto) {
    const uuidv7 = v7();
    const hashedPassword = await this.password.hash(dto.password);

    return this.prisma.user.create({
      data: {
        id: uuidv7,
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        phone: dto.phone,
        photo: dto.photo,
        positionId: dto.positionId,
      },
    });
  }

  async updateUser(data: { id: string; actorId: string } & UpdateUserDto) {
    const current = await this.prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!current) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }

    const updateData = {
      phone: data.phone,
      photo: data.photo,
    };

    const updated = await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data: updateData,
      omit: {
        password: true,
      },
    });

    const changes = this.buildChanges(current, updateData);

    if (Object.keys(changes).length > 0) {
      const uuidv7 = v7();
      this.auditClient.emit('user.updated.log', {
        id: uuidv7,
        entity: 'user',
        entityId: data.id,
        action: 'UPDATE',
        actorId: data.actorId,
        changes: changes,
      });

      this.notificationClient.emit('user.updated.notify', {
        id: data.id,
        message: current.name + ' profile was updated',
        changes: changes,
      });
    }

    return updated;
  }

  async changePassword(data: { id: string } & ChangePasswordDto) {
    const isPasswordChange = data.currentPassword !== data.newPassword;
    if (!isPasswordChange) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'New password cannot be the same as the current password',
      });
    }

    const isNewPasswordValid = data.newPassword === data.newPassword2;
    if (!isNewPasswordValid) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "New password doesn't match",
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: data.id },
    });
    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }

    const isPasswordValid = await this.password.compare(
      data.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Current password invalid',
      });
    }

    const hashedPassword = await this.password.hash(data.newPassword);

    const updated = await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data: { password: hashedPassword },
      omit: {
        password: true,
      },
    });

    const uuidv7 = v7();
    this.auditClient.emit('user.updated.log', {
      id: uuidv7,
      entity: 'user',
      entityId: data.id,
      action: 'UPDATE-PASSWORD',
      actorId: data.id,
      changes: {},
    });

    this.notificationClient.emit('user.updated.notify', {
      userId: data.id,
      message: user.name + ' password was updated',
    });

    return updated;
  }

  getUser(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        photo: true,
        position: true,
      },
    });
  }

  getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        password: true,
        position: true,
      },
    });
  }

  getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        photo: true,
        position: true,
      },
    });
  }
}
