import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Authentication } from '../auth/auth.schema';
import { Model } from 'mongoose';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService, // Inject ConfigService
    @InjectModel(Authentication.name) private authModel: Model<Authentication>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: configService.get<string>('JWT_SECRET')
    });
  }

  async validate(payload: any) {
    try {
      // Assuming the payload has the 'sub' as user ID
      const auth = await this.authModel.findById(payload.userId);
      if (!auth) {
        throw new UnauthorizedException('Invalid token');
      }
      return auth;
    } catch (error) {
      // Catch the TokenExpiredError if token has expired
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired, please log in again');
      }
      // Other errors (invalid token, etc.)
      throw new UnauthorizedException('Invalid token');
    }
  }
}
