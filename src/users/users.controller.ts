import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Request } from "express";

interface AuthRequest extends Request {
  user?: any;
}

@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@Req() req: AuthRequest) {
    // req.user is set by JwtStrategy
    return this.usersService.findOne(req.user?.userId || req.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("profile")
  async updateProfile(
    @Req() req: AuthRequest,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(
      req.user?.userId || req.user?.sub,
      updateUserDto
    );
  }
}
