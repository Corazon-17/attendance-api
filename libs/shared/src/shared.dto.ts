import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Min(1)
  page!: number;

  @IsNumber()
  @Min(1)
  pageSize!: number;
}

export class DateRangeDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
