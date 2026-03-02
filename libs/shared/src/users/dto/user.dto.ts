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

  @MinLength(10)
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsUUID()
  positionId!: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  phone: string | undefined;

  @IsUrl()
  @IsOptional()
  photo: string | undefined;
}

export class updateUserForAdminDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  name!: string;

  @MinLength(10)
  @IsOptional()
  phone?: string;

  @IsOptional()
  photo?: string;

  @IsUUID()
  positionId!: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;

  @IsString()
  @MinLength(8)
  newPassword2!: string;
}
