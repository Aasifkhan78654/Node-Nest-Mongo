// src/user/dto/signup.dto.ts
import { IsEmail, IsOptional, IsString, IsEnum, MinLength } from 'class-validator';

export class SignupDto {
  @IsEnum(['email', 'google'])
  strategy: 'email' | 'google';

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;  // Password is required if strategy is email

  @IsOptional()
  @IsString()
  googleProviderId?: string;  // Google provider ID is required if strategy is google

  @IsOptional()
  @IsString()
  firebasePushToken?: string;
}
