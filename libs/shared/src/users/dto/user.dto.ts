import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(3)
  name!: string;

  @IsString()
  @MinLength(10)
  phone: string | undefined;

  @IsUrl()
  @MinLength(3)
  @IsOptional()
  photo: string | undefined;

  @IsUUID()
  positionId!: string;
}

export class UpdateUserDto {
  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(10)
  phone: string | undefined;

  @IsUrl()
  @MinLength(3)
  @IsOptional()
  photo: string | undefined;
}
