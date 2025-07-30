import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Account } from "@prisma/client";

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  // Controller-facing methods
  async create(createAccountDto: {
    userId: number;
    balance: number;
  }): Promise<Account> {
    return this.createAccount(
      createAccountDto.userId,
      createAccountDto.balance
    );
  }

  async findOne(id: string): Promise<Account | null> {
    return this.getAccountById(Number(id));
  }

  async findAll(): Promise<Account[]> {
    return this.prisma.account.findMany();
  }

  async update(
    id: string,
    updateAccountDto: { balance?: number }
  ): Promise<Account> {
    // Only balance is updatable
    return this.updateAccount(Number(id), updateAccountDto.balance!);
  }

  async remove(id: string): Promise<Account> {
    return this.deleteAccount(Number(id));
  }


  // internal methods for Prisma operations
  async createAccount(
    userId: number,
    initialBalance: number
  ): Promise<Account> {
    return this.prisma.account.create({
      data: {
        userId,
        balance: initialBalance,
      },
    });
  }

  async getAccountById(accountId: number): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: { id: accountId },
    });
  }

  async updateAccount(accountId: number, balance: number): Promise<Account> {
    return this.prisma.account.update({
      where: { id: accountId },
      data: { balance },
    });
  }

  async deleteAccount(accountId: number): Promise<Account> {
    return this.prisma.account.delete({
      where: { id: accountId },
    });
  }

  async getAllAccountsByUserId(userId: number): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: { userId },
    });
  }
}
