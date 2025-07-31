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
    if (amount <= 0) throw new Error("Deposit amount must be positive");
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new Error("Account not found");
    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: { increment: amount } },
    });
    return this.prisma.transaction.create({
      data: {
        accountId,
        userId: account.userId,
        amount,
        type: "deposit",
      },
    });
  }

  async withdraw({ accountId, amount }: WithdrawDto): Promise<Transaction> {
    if (amount <= 0) throw new Error("Withdraw amount must be positive");
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new Error("Account not found");
    if (account.balance < amount) throw new Error("Insufficient balance");
    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: { decrement: amount } },
    });
    return this.prisma.transaction.create({
      data: {
        accountId,
        userId: account.userId,
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
    if (amount <= 0) throw new Error("Transfer amount must be positive");
    if (fromAccountId === toAccountId)
      throw new Error("Cannot transfer to the same account");
    const fromAccount = await this.prisma.account.findUnique({
      where: { id: fromAccountId },
    });
    const toAccount = await this.prisma.account.findUnique({
      where: { id: toAccountId },
    });
    if (!fromAccount || !toAccount) throw new Error("Account not found");
    if (fromAccount.balance < amount)
      throw new Error("Insufficient balance in source account");
    // Use transaction for atomicity
    return this.prisma.$transaction(async (prisma) => {
      await prisma.account.update({
        where: { id: fromAccountId },
        data: { balance: { decrement: amount } },
      });
      await prisma.account.update({
        where: { id: toAccountId },
        data: { balance: { increment: amount } },
      });
      const fromTx = await prisma.transaction.create({
        data: {
          accountId: fromAccountId,
          userId: fromAccount.userId,
          amount,
          type: "transfer_out",
        },
      });
      const toTx = await prisma.transaction.create({
        data: {
          accountId: toAccountId,
          userId: toAccount.userId,
          amount,
          type: "transfer_in",
        },
      });
      return { from: fromTx, to: toTx };
    });
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
