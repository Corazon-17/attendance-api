import { Injectable } from '@nestjs/common';
import { InputJsonValue } from '@prisma/client/runtime/client';
import { AuditLog } from '../generated/prisma/client';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AuditServiceService {
  constructor(private prisma: PrismaService) {}

  createLog(data: AuditLog) {
    return this.prisma.auditLog.create({
      data: {
        id: data.id,
        entity: data.entity,
        entityId: data.entityId,
        action: data.action,
        actorId: data.actorId,
        changes: data.changes as InputJsonValue,
      },
    });
  }
}
