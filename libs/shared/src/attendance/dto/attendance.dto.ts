import { IsUUID } from 'class-validator';

export class ClockInDto {
  @IsUUID()
  userId!: string;
}
