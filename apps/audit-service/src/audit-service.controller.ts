import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { AuditLog } from '../generated/prisma/client';
import { AuditServiceService } from './audit-service.service';

@Controller()
export class AuditServiceController {
  constructor(private readonly auditService: AuditServiceService) {}

  @EventPattern('user.updated.log')
  async handleUserUpdated(@Payload() data: AuditLog) {
    return this.auditService.createLog(data);
  }
}
