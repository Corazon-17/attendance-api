import { ClockInDto } from '@app/shared/attendance/dto/attendance.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async clockIn(dto: ClockInDto) {
    const datetime = new Date();
    const date = new Date(
      datetime.getFullYear(),
      datetime.getMonth(),
      datetime.getDate(),
    );

    try {
      return await this.prisma.attendance.create({
        data: {
          userId: dto.userId,
          date: date,
          clockIn: datetime,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new RpcException({
          statusCode: HttpStatus.CONFLICT,
          message: 'You already clocked in today',
        });
      }
      throw error;
    }
  }

  async clockOut(dto: ClockInDto) {
    const datetime = new Date();
    const date = new Date(
      datetime.getFullYear(),
      datetime.getMonth(),
      datetime.getDate(),
    );

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        userId: dto.userId,
        date: date,
      },
    });

    if (!attendance) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "You haven't clocked in yet",
      });
    }

    return this.prisma.attendance.update({
      where: { id: attendance.id },
      data: { clockOut: datetime },
    });
  }

  async getAttendance(userId: string) {
    return this.prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }
}
