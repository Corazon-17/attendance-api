import { ClockInDto } from '@app/shared/attendance/dto/attendance.dto';
import { DateRangeDto, PaginationDto } from '@app/shared/shared.dto';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async clockIn(data: ClockInDto) {
    const datetime = new Date();
    const date = new Date(
      datetime.getFullYear(),
      datetime.getMonth(),
      datetime.getDate(),
    );

    try {
      return await this.prisma.attendance.create({
        data: {
          userId: data.userId,
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

  async clockOut(data: ClockInDto) {
    const datetime = new Date();
    const date = new Date(
      datetime.getFullYear(),
      datetime.getMonth(),
      datetime.getDate(),
    );

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        userId: data.userId,
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

  async getAttendance(data: { userId: string } & DateRangeDto) {
    const attendanceData = await this.prisma.attendance.findMany({
      where: {
        userId: data.userId,
        date: {
          gte: data.from,
          lte: data.to,
        },
      },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        clockIn: true,
        clockOut: true,
      },
    });

    if (attendanceData.length < 1) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No attendance data found',
      });
    }

    const userData = await firstValueFrom(
      this.userClient.send({ cmd: 'get-user' }, data.userId),
    );
    const result = {
      user: userData,
      attendance: attendanceData,
    };

    return result;
  }

  async getAllAttendance(
    data: { userId: string } & DateRangeDto & PaginationDto,
  ) {
    const fromDate = data.from ? new Date(data.from) : undefined;
    const toDate = data.to ? new Date(data.to) : undefined;
    const limit = Number(data.pageSize) || 10;
    const offset = (Number(data.page) - 1) * limit;

    const [attendanceCount, attendanceData] = await this.prisma.$transaction([
      this.prisma.attendance.count({
        where: {
          userId: data.userId,
          date: {
            gte: fromDate,
            lte: toDate,
          },
        },
      }),

      this.prisma.attendance.findMany({
        where: {
          userId: data.userId,
          date: {
            gte: fromDate,
            lte: toDate,
          },
        },
        select: {
          userId: true,
          date: true,
          clockIn: true,
          clockOut: true,
        },
        orderBy: { date: 'asc' },
        take: limit,
        skip: offset,
      }),
    ]);

    if (attendanceData.length < 1) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No attendance data found',
      });
    }

    const uniqueUserIds = [
      ...new Set(attendanceData.map((data) => data.userId)),
    ];
    const userData = await firstValueFrom(
      this.userClient.send({ cmd: 'get-users' }, uniqueUserIds),
    );

    const userObject = Object.fromEntries(
      userData.map((data) => [data.id, data]),
    );

    const finalAttendanceData = attendanceData.map((data) => ({
      ...data,
      user: userObject[data.userId],
    }));

    const result = {
      meta: {
        page: Number(data.page),
        pageSize: Number(data.pageSize),
        totalPages: Math.ceil(attendanceCount / Number(data.pageSize)),
        totalItems: attendanceCount,
      },
      data: finalAttendanceData,
    };

    return result;
  }
}
