// src/user/user.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() userDto: any) {
    return this.userService.createUser(userDto);
  }

  @Get('activate/:code')
  async activateUser(@Param('code') code: string) {
    return this.userService.activateUser(code);
  }
}
