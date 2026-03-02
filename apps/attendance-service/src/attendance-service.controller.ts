import { ClockInDto } from '@app/shared/attendance/dto/attendance.dto';
import { DateRangeDto, PaginationDto } from '@app/shared/shared.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AttendanceService } from './attendance-service.service';

@Controller()
export class AttendanceServiceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern({ cmd: 'clock-in' })
  clockIn(@Payload() data: ClockInDto) {
    return this.attendanceService.clockIn(data);
  }

  @MessagePattern({ cmd: 'clock-out' })
  clockOut(@Payload() data: ClockInDto) {
    return this.attendanceService.clockOut(data);
  }

  @MessagePattern({ cmd: 'user-attendance' })
  getAttendance(@Payload() data: { userId: string } & DateRangeDto) {
    return this.attendanceService.getAttendance(data);
  }

  @MessagePattern({ cmd: 'all-user-attendance' })
  getAllAttendance(
    @Payload() data: { userId: string } & DateRangeDto & PaginationDto,
  ) {
    return this.attendanceService.getAllAttendance(data);
  }
}
