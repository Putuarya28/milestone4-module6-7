import {
  DepositDto,
  WithdrawDto,
  TransferDto,
} from "./dto/transaction-ops.dto";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Transaction } from "@prisma/client";

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async deposit({ accountId, amount }: DepositDto): Promise<Transaction> {
    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: { increment: amount } },
    });
    return this.prisma.transaction.create({
      data: {
        accountId,
        userId: (await this.prisma.account.findUnique({
          where: { id: accountId },
        }))!.userId,
        amount,
        type: "deposit",
      },
    });
  }

  async withdraw({ accountId, amount }: WithdrawDto): Promise<Transaction> {
    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: { decrement: amount } },
    });
    return this.prisma.transaction.create({
      data: {
        accountId,
        userId: (await this.prisma.account.findUnique({
          where: { id: accountId },
        }))!.userId,
        amount,
        type: "withdraw",
      },
    });
  }

  async transfer({
    fromAccountId,
    toAccountId,
    amount,
  }: TransferDto): Promise<{ from: Transaction; to: Transaction }> {
    await this.prisma.account.update({
      where: { id: fromAccountId },
      data: { balance: { decrement: amount } },
    });
    await this.prisma.account.update({
      where: { id: toAccountId },
      data: { balance: { increment: amount } },
    });
    const fromUserId = (await this.prisma.account.findUnique({
      where: { id: fromAccountId },
    }))!.userId;
    const toUserId = (await this.prisma.account.findUnique({
      where: { id: toAccountId },
    }))!.userId;
    const fromTx = await this.prisma.transaction.create({
      data: {
        accountId: fromAccountId,
        userId: fromUserId,
        amount,
        type: "transfer_out",
      },
    });
    const toTx = await this.prisma.transaction.create({
      data: {
        accountId: toAccountId,
        userId: toUserId,
        amount,
        type: "transfer_in",
      },
    });
    return { from: fromTx, to: toTx };
  }

  async createTransaction(
    data: Omit<Transaction, "id" | "createdAt" | "account" | "user">
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data,
    });
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany();
  }

  async updateTransaction(
    id: number,
    data: Partial<Omit<Transaction, "id" | "createdAt" | "account" | "user">>
  ): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async deleteTransaction(id: number): Promise<Transaction> {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
