import { ClockInDto } from '@app/shared/attendance/dto/attendance.dto';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(
    @Inject('ATTENDANCE_SERVICE')
    private readonly attendanceClient: ClientProxy,
  ) {}

  @Post('clock-in')
  clockIn(@Body() dto: ClockInDto) {
    return firstValueFrom(this.attendanceClient.send({ cmd: 'clock-in' }, dto));
  }

  @Post('clock-out')
  clockOut(@Body() dto: ClockInDto) {
    return firstValueFrom(
      this.attendanceClient.send({ cmd: 'clock-out' }, dto),
    );
  }

  @Get(':userId')
  getAttendance(@Param('userId') userId: string) {
    return firstValueFrom(
      this.attendanceClient.send({ cmd: 'get-attendance' }, userId),
    );
  }
}
