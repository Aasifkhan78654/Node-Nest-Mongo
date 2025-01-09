
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Authentication, AuthenticationSchema } from './auth.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../jwt-strategy/jwt-strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from 'src/user/user.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Authentication.name, schema: AuthenticationSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const jwtExpiration = configService.get<number>('JWT_EXPIRATION');  // Ensure it's a number if needed
        console.log('JWT_EXPIRATION:', jwtExpiration);

        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: jwtExpiration,  // Convert to string like '60s'
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }

