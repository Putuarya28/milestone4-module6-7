import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { AccountsService } from "./accounts.service";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";

@Controller("accounts")
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: Request & { user: any },
    @Body() createAccountDto: CreateAccountDto
  ) {
    // Only allow users to create accounts for themselves unless admin
    const user = req.user;
    if (user.role !== "admin" && Number(createAccountDto.userId) !== user.id) {
      throw new Error("Forbidden");
    }
    return this.accountsService.create({
      userId: Number(createAccountDto.userId),
      balance: createAccountDto.balance,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(@Req() req: Request & { user: any }, @Param("id") id: string) {
    const user = req.user;
    const account = await this.accountsService.findOne(id);
    if (!account) return null;
    if (user.role !== "admin" && account.userId !== user.id) {
      throw new Error("Forbidden");
    }
    return account;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: Request & { user: any }) {
    const user = req.user;
    if (user.role === "admin") {
      return this.accountsService.findAll();
    } else {
      // Only return accounts belonging to the user
      const all = await this.accountsService.findAll();
      return all.filter((acc) => acc.userId === user.id);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Req() req: Request & { user: any },
    @Param("id") id: string,
    @Body() updateAccountDto: UpdateAccountDto
  ) {
    const user = req.user;
    const account = await this.accountsService.findOne(id);
    if (!account) throw new Error("Not found");
    if (user.role !== "admin" && account.userId !== user.id) {
      throw new Error("Forbidden");
    }
    return this.accountsService.update(id, updateAccountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Req() req: Request & { user: any }, @Param("id") id: string) {
    const user = req.user;
    const account = await this.accountsService.findOne(id);
    if (!account) throw new Error("Not found");
    if (user.role !== "admin" && account.userId !== user.id) {
      throw new Error("Forbidden");
    }
    return this.accountsService.remove(id);
  }
}
