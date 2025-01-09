import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async createUser(userDto: any) {
    try {
      const activationCode = this.generateUniqueCode(); // Generate a unique code
      const newUser = new this.userModel({ ...userDto, activationCode });
      return await newUser.save();
    } catch (error) {
      throw new BadRequestException('Failed to create user', error.message);
    }
  }

  async activateUser(code: string) {
    try {
      const user = await this.userModel.findOne({ activationCode: code });
      if (!user) {
        throw new NotFoundException('Invalid activation code');
      }

      user.isSubscribed = true;
      user.activationCode = null; // Clear the activation code after use (optional)
      return await user.save();
    } catch (error) {
      throw new BadRequestException('Activation failed', error.message);
    }
  }

  private generateUniqueCode(): string {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // Generate a 6-character hex string
  }
}
