// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.schema';
import { Authentication } from '../auth/auth.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Authentication.name) private authModel: Model<Authentication>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    let user = await this.userModel.findOne({ email: signupDto.email });

    if (user) {
      throw new Error('User already exists');
    }

    user = new this.userModel({
      name: signupDto.name,
      email: signupDto.email,
      phoneNumber: signupDto.phoneNumber,
      activationCode: Math.random().toString(36).substring(7),
      isSubscribed: false,
    });

    await user.save();

    const authentication = new this.authModel({
      strategy: signupDto.strategy,
      email: signupDto.strategy === 'email' ? signupDto.email : undefined,
      password: signupDto.strategy === 'email' ? await bcrypt.hash(signupDto.password, 10) : undefined,
      googleProviderId: signupDto.strategy === 'google' ? signupDto.googleProviderId : undefined,
      firebasePushToken: signupDto.firebasePushToken,
      whitelistedRefreshToken: Math.random().toString(36).substring(7),
    });

    await authentication.save();

    return { message: 'User signed up successfully' };
  }

  async login(loginDto: LoginDto) {
    const auth = await this.authModel.findOne({ email: loginDto.email });

    if (!auth || auth.strategy !== 'email') {
      throw new Error('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(loginDto.password, auth.password);

    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    const payload = { userId: auth._id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = Math.random().toString(36).substring(7);

    auth.whitelistedRefreshToken = refreshToken;
    await auth.save();

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    const auth = await this.authModel.findOne({ whitelistedRefreshToken: refreshToken });

    if (!auth) {
      throw new Error('Invalid refresh token');
    }

    auth.whitelistedRefreshToken = '';
    await auth.save();

    return { message: 'Logged out successfully' };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const auth = await this.authModel.findOne({ whitelistedRefreshToken: refreshTokenDto.refreshToken });

    if (!auth) {
      throw new Error('Invalid refresh token');
    }

    const payload = { userId: auth._id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
