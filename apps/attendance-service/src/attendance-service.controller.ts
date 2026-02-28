import { ClockInDto } from '@app/shared/attendance/dto/attendance.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AttendanceService } from './attendance-service.service';

@Controller()
export class AttendanceServiceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern({ cmd: 'clock-in' })
  clockIn(@Payload() dto: ClockInDto) {
    return this.attendanceService.clockIn(dto);
  }

  @MessagePattern({ cmd: 'clock-out' })
  clockOut(@Payload() dto: ClockInDto) {
    return this.attendanceService.clockOut(dto);
  }

  @MessagePattern({ cmd: 'get-attendance' })
  getAttendance(@Payload() userId: string) {
    return this.attendanceService.getAttendance(userId);
  }
}
