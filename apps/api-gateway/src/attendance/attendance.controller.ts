import { DateRangeDto, PaginationDto } from '@app/shared/shared.dto';
import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
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
  clockIn(@Req() req) {
    const userId = req.user.id;

    return firstValueFrom(
      this.attendanceClient.send({ cmd: 'clock-in' }, { userId }),
    );
  }

  @Post('clock-out')
  clockOut(@Req() req) {
    const userId = req.user.id;

    return firstValueFrom(
      this.attendanceClient.send({ cmd: 'clock-out' }, { userId }),
    );
  }

  @Get()
  getAllAttendance(
    @Query() query: { userId: string } & DateRangeDto & PaginationDto,
  ) {
    return firstValueFrom(
      this.attendanceClient.send({ cmd: 'all-user-attendance' }, query),
    );
  }

  @Get(':userId')
  getAttendance(@Param('userId') userId: string, @Query() query: DateRangeDto) {
    return firstValueFrom(
      this.attendanceClient.send({ cmd: 'user-attendance' }, { userId, query }),
    );
  }
}
