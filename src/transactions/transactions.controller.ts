import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { Transaction } from "@prisma/client";
import {
  DepositDto,
  WithdrawDto,
  TransferDto,
} from "./dto/transaction-ops.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";

import { PrismaService } from "../prisma/prisma.service";

@Controller("transactions")
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly prisma: PrismaService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("deposit")
  async deposit(
    @Req() req: any,
    @Body() depositDto: DepositDto
  ): Promise<Transaction> {
    const user = req.user;
    if (user.role !== "admin") {
      const account = await this.prisma.account.findUnique({
        where: { id: depositDto.accountId },
      });
      if (!account || account.userId !== user.id) throw new Error("Forbidden");
    }
    return this.transactionsService.deposit(depositDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("withdraw")
  async withdraw(
    @Req() req: any,
    @Body() withdrawDto: WithdrawDto
  ): Promise<Transaction> {
    const user = req.user;
    if (user.role !== "admin") {
      const account = await this.prisma.account.findUnique({
        where: { id: withdrawDto.accountId },
      });
      if (!account || account.userId !== user.id) throw new Error("Forbidden");
    }
    return this.transactionsService.withdraw(withdrawDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("transfer")
  async transfer(
    @Req() req: any,
    @Body() transferDto: TransferDto
  ): Promise<{ from: Transaction; to: Transaction }> {
    const user = req.user;
    if (user.role !== "admin") {
      const fromAccount = await this.prisma.account.findUnique({
        where: { id: transferDto.fromAccountId },
      });
      if (!fromAccount || fromAccount.userId !== user.id)
        throw new Error("Forbidden");
    }
    return this.transactionsService.transfer(transferDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Req() req: any,
    @Param("id") id: string
  ): Promise<Transaction | null> {
    const user = req.user;
    const tx = await this.transactionsService.getTransactionById(Number(id));
    if (!tx) return null;
    if (user.role !== "admin" && tx.userId !== user.id)
      throw new Error("Forbidden");
    return tx;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: any): Promise<Transaction[]> {
    const user = req.user;
    if (user.role === "admin") {
      return this.transactionsService.getAllTransactions();
    } else {
      const all = await this.transactionsService.getAllTransactions();
      return all.filter((tx) => tx.userId === user.id);
    }
  }
}
